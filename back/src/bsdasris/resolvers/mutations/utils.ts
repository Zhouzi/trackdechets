import prisma from "../../../prisma";
import { UserInputError } from "apollo-server-express";

import { DASRI_GROUPING_OPERATIONS_CODES } from "../../../common/constants";
export const checkDasrisAreGroupable = async (
  regroupedBsdasris,
  emitterSiret
) => {
  if (!regroupedBsdasris) {
    return;
  }
  if (!regroupedBsdasris.length) {
    return;
  }
  const regroupedBsdasrisIds = regroupedBsdasris.map(dasri => dasri.id);
  // retrieve dasris:
  // whose id is in regroupedBsdasrisIds array
  // which are in PROCESSED status
  // whose processingOperation is either D12 or  R12
  // which are not already grouped or are grouped on an initial dasri
  // which are not regrouping other dasris
  // whose recipient in current emitter
  const found = await prisma.bsdasri.findMany({
    where: {
      id: { in: regroupedBsdasrisIds },
      processingOperation: { in: DASRI_GROUPING_OPERATIONS_CODES },
      status: "PROCESSED",
      regroupedOnBsdasri: null,
      regroupedBsdasris: { none: {} },
      recipientCompanySiret: emitterSiret
    },
    select: { id: true }
  });

  const foundIds = found.map(el => el.id);
  const diff = regroupedBsdasrisIds.filter(el => !foundIds.includes(el));

  if (!!diff.length) {
    throw new UserInputError(
      `Les dasris suivants ne peuvent pas être regroupés ${diff.join()}`
    );
  }
};

export const emitterIsAllowedToGroup = async emitterSiret => {
  const emitterCompany = await prisma.company.findUnique({
    where: { siret: emitterSiret }
  });
  if (!emitterCompany?.companyTypes.includes("COLLECTOR")) {
    throw new UserInputError(
      `Le siret de l'émetteur n'est pas autorisé à regrouper des dasris`
    );
  }
};
