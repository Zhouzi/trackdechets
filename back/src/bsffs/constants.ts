import { BsffPackagingType } from "../generated/graphql/types";

export const OPERATION_CODES = {
  R2: "R 2",
  R12: "R 12",
  D10: "D 10",
  D13: "D 13",
  D14: "D 14"
};

export const GROUPING_CODES = [
  OPERATION_CODES.R12,
  OPERATION_CODES.D13,
  OPERATION_CODES.D14
];

export const OPERATION_QUALIFICATIONS = {
  INCINERATION: "INCINERATION",
  RECONDITIONNEMENT: "RECONDITIONNEMENT",
  RECUPERATION_REGENERATION: "RECUPERATION_REGENERATION",
  REEXPEDITION: "REEXPEDITION",
  GROUPEMENT: "GROUPEMENT"
};

export const OPERATION_QUALIFICATIONS_TO_CODES = {
  [OPERATION_QUALIFICATIONS.INCINERATION]: [OPERATION_CODES.D10],
  [OPERATION_QUALIFICATIONS.RECONDITIONNEMENT]: [
    OPERATION_CODES.R12,
    OPERATION_CODES.D14
  ],
  [OPERATION_QUALIFICATIONS.RECUPERATION_REGENERATION]: [OPERATION_CODES.R2],
  [OPERATION_QUALIFICATIONS.REEXPEDITION]: [],
  [OPERATION_QUALIFICATIONS.GROUPEMENT]: [
    OPERATION_CODES.R12,
    OPERATION_CODES.D13
  ]
};

export const WASTE_CODES = ["14 06 01*"];

export const PACKAGING_TYPE: Record<BsffPackagingType, BsffPackagingType> = {
  BOUTEILLE: "BOUTEILLE"
};
