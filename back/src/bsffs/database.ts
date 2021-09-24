import type { SetRequired } from "type-fest";
import {
  Bsff,
  BsffFicheIntervention as PrismaBsffFicheIntervention,
  BsffType,
  Prisma
} from "@prisma/client";
import { UserInputError } from "apollo-server-express";
import prisma from "../prisma";
import {
  BsffFicheIntervention,
  BsffInput,
  BsffSplitInput
} from "../generated/graphql/types";
import getReadableId, { ReadableIdPrefix } from "../forms/readableId";
import {
  flattenBsffInput,
  unflattenBsff,
  unflattenFicheInterventionBsff
} from "./converter";
import { isBsffContributor } from "./permissions";
import { validateBsff } from "./validation";
import { indexBsff } from "./elastic";
import { GraphQLContext } from "../types";

export async function getBsffOrNotFound(
  where: SetRequired<Prisma.BsffWhereInput, "id">
): Promise<Bsff> {
  const bsff = await prisma.bsff.findFirst({
    where: { ...where, isDeleted: false }
  });

  if (bsff == null) {
    throw new UserInputError(
      `Le bordereau de fluides frigorigènes n°${where.id} n'existe pas.`
    );
  }

  return bsff;
}

export async function getFicheInterventionBsffOrNotFound(
  where: SetRequired<Prisma.BsffFicheInterventionWhereInput, "id">
): Promise<PrismaBsffFicheIntervention> {
  const ficheIntervention = await prisma.bsffFicheIntervention.findFirst({
    where
  });
  if (ficheIntervention == null) {
    throw new UserInputError(
      `La fiche d'intervention n°${where.id} n'existe pas.`
    );
  }
  return ficheIntervention;
}

/**
 * Return the "ficheInterventions" of a bsff, hiding some fields depending
 * on the user reading it
 * @param param0
 */
export async function getFicheInterventions({
  bsff,
  context
}: {
  bsff: Bsff;
  context: GraphQLContext;
}): Promise<BsffFicheIntervention[]> {
  const ficheInterventions = await prisma.bsffFicheIntervention.findMany({
    where: {
      bsffId: bsff.id
    }
  });

  const unflattenedFicheInterventions = ficheInterventions.map(
    unflattenFicheInterventionBsff
  );

  // the user trying to read ficheInterventions might not be a contributor of the bsff
  // for example they could be reading the ficheInterventions of a bsff that was forwarded:
  // bsffs { forwarding { ficheInterventions } }
  // in this case, they are still allowed to read ficheInterventions but not all fields
  try {
    await isBsffContributor(context.user, bsff);
  } catch (err) {
    unflattenedFicheInterventions.forEach(ficheIntervention => {
      delete ficheIntervention.detenteur;
      delete ficheIntervention.operateur;
    });
  }

  return unflattenedFicheInterventions;
}

/** Returns BSFF splits grouped into this one */
export async function getGroupingBsffsSplits(bsffId: string) {
  const bsffGroupement = await prisma.bsffGroupement.findMany({
    where: { next: { id: bsffId } },
    include: { previous: true }
  });
  return bsffGroupement.map(({ previous, weight }) => ({
    bsff: previous,
    weight
  }));
}

export async function getGroupingBsffs(bsffId: string) {
  const splits = await getGroupingBsffsSplits(bsffId);
  return splits.map(s => s.bsff);
}

/** Returns the different groupement splits of a BSFF */
export async function getGroupedInBsffsSplits(bsffId: string) {
  const bsffGroupement = await prisma.bsffGroupement.findMany({
    where: { previous: { id: bsffId } },
    include: { next: true }
  });
  return bsffGroupement.map(({ next, weight }) => ({
    bsff: next,
    weight
  }));
}

function getBsffType(input: BsffInput): BsffType {
  if (input.grouping?.length > 0) {
    return BsffType.GROUPEMENT;
  }

  if (input.forwarding) {
    if (input.packagings?.length > 0) {
      return BsffType.RECONDITIONNEMENT;
    }
    return BsffType.REEXPEDITION;
  }

  if (input.ficheInterventions?.length === 1) {
    return BsffType.TRACER_FLUIDE;
  }

  return BsffType.COLLECTE_PETITES_QUANTITES;
}

export async function getBsffCreateGroupementInput(
  splits: BsffSplitInput[]
): Promise<Prisma.BsffGroupementCreateNestedManyWithoutNextInput> {
  // set default weight to previous BSFF destination weight
  const destinationReceptionWeight = async (bsffId: string) => {
    const bsff = await prisma.bsff.findUnique({ where: { id: bsffId } });
    return bsff.destinationReceptionWeight;
  };
  const createInput = splits.map(async ({ bsffId, weight }) => {
    return {
      previousId: bsffId,
      weight: weight ?? (await destinationReceptionWeight(bsffId))
    };
  });

  return {
    create: await Promise.all(createInput)
  };
}

export async function createBsff(
  user: Express.User,
  input: BsffInput,
  additionalData: Partial<Bsff> = {}
) {
  const flatInput = {
    id: getReadableId(ReadableIdPrefix.FF),
    type: getBsffType(input),

    ...flattenBsffInput(input),
    ...additionalData
  };

  await isBsffContributor(user, flatInput);

  const groupingBsffs =
    input.grouping?.length > 0
      ? await prisma.bsff.findMany({
          where: { id: { in: input.grouping.map(({ bsffId }) => bsffId) } }
        })
      : [];
  const forwardingBsff = input.forwarding
    ? await getBsffOrNotFound({ id: input.forwarding })
    : null;

  const previousBsffs = groupingBsffs;
  if (forwardingBsff) {
    previousBsffs.push(forwardingBsff);
  }

  const ficheInterventions =
    input.ficheInterventions?.length > 0
      ? await prisma.bsffFicheIntervention.findMany({
          where: { id: { in: input.ficheInterventions } }
        })
      : [];

  await validateBsff(flatInput, previousBsffs, ficheInterventions);

  const data: Prisma.BsffCreateInput = flatInput;

  if (input.grouping?.length > 0) {
    data.grouping = await getBsffCreateGroupementInput(input.grouping);
  }

  if (input.forwarding) {
    data.forwarding = { connect: { id: input.forwarding } };
  }

  if (ficheInterventions.length > 0) {
    data.ficheInterventions = {
      connect: ficheInterventions.map(({ id }) => ({ id }))
    };
  }

  const bsff = await prisma.bsff.create({ data });

  await indexBsff(bsff, { user } as GraphQLContext);

  return unflattenBsff(bsff);
}
