import { gql } from "@apollo/client";
import { companyFragment } from "common/fragments";

export const FicheInterventionFragment = gql`
  fragment FicheInterventionFragment on BsffFicheIntervention {
    id
    numero
    kilos
    postalCode
  }
`;

export const FullBsffFragment = gql`
  fragment FullBsff on Bsff {
    id
    status
    emitter {
      company {
        ...CompanyFragment
      }
      emission {
        signature {
          author
          date
        }
      }
    }
    packagings {
      name
      numero
      kilos
    }
    waste {
      code
      nature
      adr
    }
    quantity {
      kilos
      isEstimate
    }
    transporter {
      company {
        ...CompanyFragment
      }
      recepisse {
        number
        department
        validityLimit
      }
      transport {
        mode
        signature {
          author
          date
        }
      }
    }
    destination {
      company {
        ...CompanyFragment
      }
      reception {
        date
        kilos
        refusal
        signature {
          author
          date
        }
      }
      operation {
        code
        nextDestination {
          company {
            ...CompanyFragment
          }
        }
        signature {
          author
          date
        }
      }
      plannedOperation {
        code
      }
      cap
    }
    ficheInterventions {
      ...FicheInterventionFragment
    }
  }
  ${companyFragment}
  ${FicheInterventionFragment}
`;

export const GET_BSFF_FORM = gql`
  query Bsff($id: ID!) {
    bsff(id: $id) {
      ...FullBsff
    }
  }
  ${FullBsffFragment}
`;

export const GET_BSFF_FORMS = gql`
  query Bsffs {
    bsffs {
      totalCount
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          ...FullBsff
        }
      }
    }
  }
  ${FullBsffFragment}
`;

export const CREATE_BSFF_FORM = gql`
  mutation CreateBsff($input: BsffInput!) {
    createBsff(input: $input) {
      ...FullBsff
    }
  }
  ${FullBsffFragment}
`;

export const UPDATE_BSFF_FORM = gql`
  mutation UpdateBsff($id: ID!, $input: BsffInput!) {
    updateBsff(id: $id, input: $input) {
      ...FullBsff
    }
  }
  ${FullBsffFragment}
`;

export const SIGN_BSFF = gql`
  mutation SignBsff(
    $id: ID!
    $type: BsffSignatureType!
    $signature: SignatureInput!
  ) {
    signBsff(id: $id, type: $type, signature: $signature) {
      ...FullBsff
    }
  }
  ${FullBsffFragment}
`;

export const PDF_BSFF_FORM = gql`
  query PdfBsff($id: ID!) {
    bsffPdf(id: $id) {
      downloadLink
      token
    }
  }
`;
