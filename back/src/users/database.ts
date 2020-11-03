/**
 * PRISMA HELPER FUNCTIONS
 */

import {
  prisma,
  User,
  UserRole,
  UserAccountHashWhereInput,
  CompanyAssociationWhereInput,
  Company,
  MembershipRequestWhereUniqueInput
} from "../generated/prisma-client";
import { FullUser } from "./types";
import { UserInputError } from "apollo-server-express";
import { hash } from "bcrypt";
import { getUid, sanitizeEmail } from "../utils";

export async function getUserCompanies(userId: string): Promise<Company[]> {
  const companyAssociations = await prisma
    .user({ id: userId })
    .companyAssociations();
  return Promise.all(
    companyAssociations.map(association => {
      return prisma.companyAssociation({ id: association.id }).company();
    })
  );
}

/**
 * Returns a user with linked objects
 * @param user
 */
export async function getFullUser(user: User): Promise<FullUser> {
  const companies = await getUserCompanies(user.id);
  return {
    ...user,
    companies
  };
}

/**
 * Create a temporary association between an email and
 * a siret
 * @param email
 * @param role
 * @param siret
 */
export async function createUserAccountHash(
  email: string,
  role: UserRole,
  siret: string
) {
  // check for existing records
  const existingHashes = await prisma.userAccountHashes({
    where: { email, companySiret: siret }
  });

  if (existingHashes && existingHashes.length > 0) {
    throw new UserInputError("Cet utilisateur a déjà été invité", {
      invalidArgs: ["email"]
    });
  }

  const userAccoutHash = await hash(
    new Date().valueOf().toString() + Math.random().toString(),
    10
  );

  return prisma.createUserAccountHash({
    hash: userAccoutHash,
    email,
    role,
    companySiret: siret
  });
}

/**
 * Associate an existing user with company
 * Make sure we do not create a double association
 * @param userId
 * @param siret
 * @param role
 */
export async function associateUserToCompany(userId, siret, role) {
  // check for current associations
  const associations = await prisma.companyAssociations({
    where: {
      user: {
        id: userId
      },
      company: {
        siret
      }
    }
  });

  if (associations && associations.length > 0) {
    throw new UserInputError(
      "L'utilisateur est déjà membre de l'établissement"
    );
  }

  return prisma.createCompanyAssociation({
    user: { connect: { id: userId } },
    role,
    company: { connect: { siret } }
  });
}

export async function getUserAccountHashOrNotFound(
  where: UserAccountHashWhereInput
) {
  const userAccountHashes = await prisma.userAccountHashes({
    where
  });
  if (userAccountHashes.length === 0) {
    throw new UserInputError("Cette invitation n'existe pas");
  }
  return userAccountHashes[0];
}

export async function getCompanyAssociationOrNotFound(
  where: CompanyAssociationWhereInput
) {
  const companyAssociations = await prisma.companyAssociations({ where });
  if (companyAssociations.length === 0) {
    throw new UserInputError(`L'utilisateur n'est pas membre de l'entreprise`);
  }
  return companyAssociations[0];
}

export async function createAccessToken(user: User) {
  const token = getUid(40);
  const accessToken = await prisma.createAccessToken({
    user: {
      connect: { id: user.id }
    },
    token
  });
  return accessToken;
}

export function userExists(unsafeEmail: string) {
  return prisma.$exists.user({
    email: sanitizeEmail(unsafeEmail)
  });
}

/**
 * Validate a user's pending invitations
 * @param user
 */
export async function acceptNewUserCompanyInvitations(user: User) {
  const existingHashes = await prisma.userAccountHashes({
    where: { email: user.email }
  });

  if (!existingHashes.length) {
    return Promise.resolve();
  }

  await Promise.all(
    existingHashes.map(existingHash =>
      prisma.createCompanyAssociation({
        company: { connect: { siret: existingHash.companySiret } },
        user: { connect: { id: user.id } },
        role: existingHash.role
      })
    )
  );

  return prisma.updateManyUserAccountHashes({
    where: {
      id_in: existingHashes.map(h => h.id)
    },
    data: { acceptedAt: new Date().toISOString() }
  });
}

export async function getMembershipRequestOrNotFoundError(
  where: MembershipRequestWhereUniqueInput
) {
  const membershipRequest = await prisma.membershipRequest(where);
  if (!membershipRequest) {
    throw new UserInputError("Cette demande de rattachement n'existe pas");
  }
  return membershipRequest;
}
