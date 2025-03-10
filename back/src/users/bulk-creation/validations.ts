import { CompanyType, UserRole } from "@prisma/client";
import * as yup from "yup";
import prisma from "../../prisma";
import { getCompanyThrottled } from "./sirene";
import { CompanyRow } from "./types";

/**
 * Validation schema for company
 */
export const companyValidationSchema = yup.object({
  siret: yup
    .string()
    .required()
    .length(14)
    .test(
      "sirene-validation-failed",
      "Siret ${value} was not found in SIRENE database",
      async value => {
        try {
          await getCompanyThrottled(value);
          return true;
        } catch (err) {
          return false;
        }
      }
    )
    .test(
      "company-already-created",
      "A company with SIRET ${value} was already created",
      async value => {
        const exists = await prisma.company.findFirst({
          where: { siret: value }
        });
        // always return true, but emit warning if the company was
        // already created
        if (exists) {
          console.warn(`WARNING: company ${value} was already created`);
        }
        return true;
      }
    ),
  gerepId: yup.string().notRequired(),
  companyTypes: yup
    .array()
    .of(yup.string().oneOf(Object.values(CompanyType)))
    .ensure()
    .compact()
    .required()
    .min(1),
  givenName: yup.string().notRequired(),
  contactEmail: yup.string().notRequired().email(),
  contactPhone: yup
    .string()
    .notRequired()
    .trim()
    .matches(/^(0[1-9])(?:[ _.-]?(\d{2})){4}$/, {
      message: "Le numéro de téléphone de contact est invalide",
      excludeEmptyString: true
    }),
  website: yup.string().notRequired().url()
});

/**
 * Validate company row extracted from etablissements.csv
 */
export function validateCompany(company): Promise<any> {
  return companyValidationSchema.validate(company);
}

/**
 * Validation schema generator for user roles
 * Email adresses should match one entry from utilisateurs.csv
 * SIRET should match one entry from etablissements.csv
 */
export const roleValidationSchema = (companies: CompanyRow[]) =>
  yup.object().shape({
    siret: yup
      .string()
      .required()
      .length(14)
      .oneOf(companies.map(c => c.siret)),
    email: yup
      .string()
      .required()
      .email()
      .test(
        "user-alreay-exists",
        "A user with this email already exist",
        async value => {
          const exists = await prisma.user.findFirst({
            where: { email: value }
          });
          // always return true, but emit a warning if this email
          // is already used
          if (exists) {
            console.warn(`WARNING: A user with email ${value} already exists`);
          }
          return true;
        }
      ),
    role: yup.string().required().oneOf(Object.values(UserRole))
  });

/** Generates a validateRole function */
export function validateRoleGenerator(companies: CompanyRow[]) {
  const schema = roleValidationSchema(companies);
  return (role: any) => schema.validate(role);
}
