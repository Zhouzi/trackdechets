/**
 * PRISMA HELPER FUNCTIONS
 */

import prisma from "src/prisma";
import {
  CompanyWhereUniqueInput,
  User,
  TraderReceiptWhereUniqueInput,
  TransporterReceiptWhereUniqueInput,
  Company,
  TraderReceipt,
  TransporterReceipt
} from "@prisma/client";
import {
  CompanyNotFound,
  TraderReceiptNotFound,
  TransporterReceiptNotFound
} from "./errors";
import { CompanyMember } from "../generated/graphql/types";

/**
 * Retrieves a company by siret or or throw a CompanyNotFound error
 */
export async function getCompanyOrCompanyNotFound({
  id,
  siret
}: CompanyWhereUniqueInput) {
  if (!id && !siret) {
    throw new Error("You should specify an id or a siret");
  }
  const company = await prisma.company.findOne({
    where: id ? { id } : { siret }
  });
  if (company == null) {
    throw new CompanyNotFound();
  }
  return company;
}

/**
 * Returns the ICPE associated with this company if any
 * or null otherwise
 * The table installation is generated by the `etl`
 * container where we are consolidating data
 * (join and fuzzy join) from s3ic, irep, gerep
 * and sirene to associate a siret with an ICPE
 * @param siret
 */
export function getInstallation(siret: string) {
  return prisma.installation
    .findMany({
      where: {
        OR: [
          { s3icNumeroSiret: siret },
          { irepNumeroSiret: siret },
          { gerepNumeroSiret: siret },
          { sireneNumeroSiret: siret }
        ]
      }
    })
    .then(installations => {
      // return first installation if several match
      return installations ? installations[0] : null;
    });
}

/**
 * Returns list of rubriques of an ICPE
 * @param codeS3ic
 */
export function getRubriques(codeS3ic: string) {
  if (codeS3ic) {
    return prisma.rubrique.findMany({ where: { codeS3ic } });
  }
  return Promise.resolve([]);
}

/**
 * Returns list of GEREP declarations of an ICPE
 * @param codeS3ic
 */
export function getDeclarations(codeS3ic: string) {
  if (codeS3ic) {
    return prisma.declaration.findMany({ where: { codeS3ic } });
  }
  return Promise.resolve([]);
}

/**
 * Returns the role (ADMIN or MEMBER) of a user
 * in a company.
 * Returns null if the user is not a member of the company.
 * There should be only one association between a user
 * and a company, so we return the first one
 * @param userId
 * @param siret
 */
export async function getUserRole(userId: string, siret: string) {
  const associations = await prisma.companyAssociation.findMany({
    where: { user: { id: userId }, company: { siret } }
  });
  if (associations.length > 0) {
    return associations[0].role;
  }
  return null;
}

/**
 * Returns true if user belongs to company with either
 * MEMBER or ADMIN role, false otherwise
 * @param user
 */
export async function isCompanyMember(user: User, company: Company) {
  const count = await prisma.companyAssociation.count({
    where: {
      userId: user.id,
      companyId: company.id
    }
  });

  return count >= 1;
}

/**
 * Concat active company users and invited company users
 * @param siret
 */
export async function getCompanyUsers(siret: string): Promise<CompanyMember[]> {
  const activeUsers = await getCompanyActiveUsers(siret);
  const invitedUsers = await getCompanyInvitedUsers(siret);

  return [...activeUsers, ...invitedUsers];
}

/**
 * Returns company members that already have an account in TD
 * @param siret
 */
export function getCompanyActiveUsers(siret: string): Promise<CompanyMember[]> {
  return prisma.companyAssociation
    .findMany({ where: { company: { siret } }, include: { user: true } })
    .then(associations =>
      associations.map(a => {
        return {
          ...a.user,
          role: a.role,
          isPendingInvitation: false
        };
      })
    );
}

/**
 * Returns users who have been invited to join the company
 * but whose account haven't been created yet
 * @param siret
 */
export async function getCompanyInvitedUsers(
  siret: string
): Promise<CompanyMember[]> {
  const hashes = await prisma.userAccountHash.findMany({
    where: { companySiret: siret, acceptedAt: null }
  });
  return hashes.map(h => {
    return {
      id: h.id,
      name: "Invité",
      email: h.email,
      role: h.role,
      isActive: false,
      isPendingInvitation: true
    };
  });
}

/**
 * Returns active company members who are admin
 * of the company
 * @param siret
 */
export async function getCompanyAdminUsers(siret: string) {
  const users = await getCompanyActiveUsers(siret);
  return users.filter(c => c.role === "ADMIN");
}

export async function getTraderReceiptOrNotFound({
  id
}: TraderReceiptWhereUniqueInput) {
  const receipt = await prisma.traderReceipt.findOne({ where: { id } });
  if (receipt == null) {
    throw new TraderReceiptNotFound();
  }
  return receipt;
}

export async function getTransporterReceiptOrNotFound({
  id
}: TransporterReceiptWhereUniqueInput) {
  const receipt = await prisma.transporterReceipt.findOne({ where: { id } });
  if (receipt == null) {
    throw new TransporterReceiptNotFound();
  }
  return receipt;
}

export function stringifyDates(obj: TraderReceipt | TransporterReceipt) {
  return {
    ...obj,
    ...(obj?.validityLimit && {
      validityLimit: obj.validityLimit.toISOString()
    })
  };
}

export function convertUrls<T extends Partial<Company>>(
  company: T
): T & { ecoOrganismeAgreements: URL[] } {
  return {
    ...company,
    ...(company?.ecoOrganismeAgreements && {
      ecoOrganismeAgreements: company.ecoOrganismeAgreements.map(
        a => new URL(a)
      )
    })
  };
}
