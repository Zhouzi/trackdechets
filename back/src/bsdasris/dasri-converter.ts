import {
  Bsdasri as GqlBsdasri,
  BsdasriEmitter,
  BsdasriTransporter,
  BsdasriRecipient,
  BsdasriTransportWasteDetails,
  BsdasriQuantity,
  BsdasriOperationQuantity,
  BsdasriEmissionWasteDetails,
  BsdasriReceptionWasteDetails,
  FormCompany,
  BsdasriInput,
  BsdasriEmitterInput,
  BsdasriTransporterInput,
  BsdasriRecipientInput,
  BsdasriOperationInput,
  WorkSite,
  BsdasriEmission,
  BsdasriTransport,
  BsdasriReception,
  BsdasriOperation,
  BsdasriWasteAcceptation,
  BsdasriEmissionInput,
  BsdasriTransportInput,
  BsdasriReceptionInput,
  BsdasriPackagingInfo,
  BsdasriPackagingInfoInput,
  BsdasriSignature
} from "../generated/graphql/types";
import { chain, nullIfNoValues, safeInput } from "../forms/form-converter";
import { Prisma, Bsdasri, BsdasriStatus } from "@prisma/client";

export function expandBsdasriFromDb(bsdasri: Bsdasri): GqlBsdasri {
  return {
    id: bsdasri.id,
    isDraft: bsdasri.isDraft,
    bsdasriType: bsdasri.bsdasriType,
    emitter: nullIfNoValues<BsdasriEmitter>({
      company: nullIfNoValues<FormCompany>({
        name: bsdasri.emitterCompanyName,
        siret: bsdasri.emitterCompanySiret,
        address: bsdasri.emitterCompanyAddress,
        phone: bsdasri.emitterCompanyPhone,
        mail: bsdasri.emitterCompanyMail,
        contact: bsdasri.emitterCompanyContact
      }),
      onBehalfOfEcoorganisme: bsdasri.emitterOnBehalfOfEcoorganisme,
      customInfo: bsdasri.emitterCustomInfo,
      type: bsdasri.emitterType,
      workSite: nullIfNoValues<WorkSite>({
        name: bsdasri.emitterWorkSiteName,
        address: bsdasri.emitterWorkSiteAddress,
        city: bsdasri.emitterWorkSiteCity,
        postalCode: bsdasri.emitterWorkSitePostalCode,
        infos: bsdasri.emitterWorkSiteInfos
      })
    }),
    emission: nullIfNoValues<BsdasriEmission>({
      wasteCode: bsdasri.wasteDetailsCode,
      handedOverAt: bsdasri.handedOverToTransporterAt,
      signature: nullIfNoValues<BsdasriSignature>({
        author: bsdasri.emissionSignatureAuthor,
        date: bsdasri.emissionSignatureDate
      }),

      wasteDetails: nullIfNoValues<BsdasriEmissionWasteDetails>({
        quantity: nullIfNoValues<BsdasriQuantity>({
          value: bsdasri.emitterWasteQuantity,
          type: bsdasri.emitterWasteQuantityType
        }),

        volume: bsdasri.emitterWasteVolume,
        packagingInfos: bsdasri.emitterWastePackagingsInfo as BsdasriPackagingInfo[],
        onuCode: bsdasri.wasteDetailsOnuCode
      }),
      isTakenOverWithoutEmitterSignature: bsdasri.isEmissionDirectTakenOver,
      isTakenOverWithSecretCode: bsdasri.isEmissionTakenOverWithSecretCode
    }),

    transporter: nullIfNoValues<BsdasriTransporter>({
      company: nullIfNoValues<FormCompany>({
        name: bsdasri.transporterCompanyName,
        siret: bsdasri.transporterCompanySiret,
        address: bsdasri.transporterCompanyAddress,
        phone: bsdasri.transporterCompanyPhone,
        mail: bsdasri.transporterCompanyMail,
        contact: bsdasri.transporterCompanyContact
      }),
      customInfo: bsdasri.transporterCustomInfo,
      receipt: bsdasri.transporterReceipt,
      receiptDepartment: bsdasri.transporterReceiptDepartment,
      receiptValidityLimit: bsdasri.transporterReceiptValidityLimit
    }),
    transport: nullIfNoValues<BsdasriTransport>({
      mode: bsdasri.transportMode,
      wasteDetails: nullIfNoValues<BsdasriTransportWasteDetails>({
        quantity: nullIfNoValues<BsdasriQuantity>({
          value: bsdasri.transporterWasteQuantity,
          type: bsdasri.transporterWasteQuantityType
        }),

        volume: bsdasri.transporterWasteVolume,
        packagingInfos: bsdasri.transporterWastePackagingsInfo as BsdasriPackagingInfo[]
      }),

      wasteAcceptation: nullIfNoValues<BsdasriWasteAcceptation>({
        status: bsdasri.transporterWasteAcceptationStatus,
        refusalReason: bsdasri.transporterWasteRefusalReason,
        refusedQuantity: bsdasri.transporterWasteRefusedQuantity
      }),
      takenOverAt: bsdasri.transporterTakenOverAt,
      handedOverAt: bsdasri.handedOverToRecipientAt,
      signature: nullIfNoValues<BsdasriSignature>({
        author: bsdasri.transportSignatureAuthor,
        date: bsdasri.transportSignatureDate
      })
    }),
    recipient: nullIfNoValues<BsdasriRecipient>({
      company: nullIfNoValues<FormCompany>({
        name: bsdasri.recipientCompanyName,
        siret: bsdasri.recipientCompanySiret,
        address: bsdasri.recipientCompanyAddress,
        phone: bsdasri.recipientCompanyPhone,
        mail: bsdasri.recipientCompanyMail,
        contact: bsdasri.recipientCompanyContact
      }),
      customInfo: bsdasri.recipientCustomInfo
    }),

    reception: nullIfNoValues<BsdasriReception>({
      wasteDetails: nullIfNoValues<BsdasriReceptionWasteDetails>({
        volume: bsdasri.recipientWasteVolume,
        packagingInfos: bsdasri.recipientWastePackagingsInfo as BsdasriPackagingInfo[]
      }),
      wasteAcceptation: nullIfNoValues<BsdasriWasteAcceptation>({
        status: bsdasri.recipientWasteAcceptationStatus,
        refusalReason: bsdasri.recipientWasteRefusalReason,
        refusedQuantity: bsdasri.recipientWasteRefusedQuantity
      }),
      receivedAt: bsdasri.receivedAt,
      signature: nullIfNoValues<BsdasriSignature>({
        author: bsdasri.receptionSignatureAuthor,
        date: bsdasri.receptionSignatureDate
      })
    }),
    operation: nullIfNoValues<BsdasriOperation>({
      quantity: nullIfNoValues<BsdasriOperationQuantity>({
        value: bsdasri.recipientWasteQuantity
      }),
      processingOperation: bsdasri.processingOperation,
      processedAt: bsdasri.processedAt,
      signature: nullIfNoValues<BsdasriSignature>({
        author: bsdasri.operationSignatureAuthor,
        date: bsdasri.operationSignatureDate
      })
    }),
    createdAt: bsdasri.createdAt,
    updatedAt: bsdasri.updatedAt,
    status: bsdasri.status as BsdasriStatus,
    metadata: null,
    allowDirectTakeOver: null
  };
}

type computeTotalVolumeFn = (
  packagingInfos: BsdasriPackagingInfoInput[]
) => number;
/**
 * Compute total volume according to packaging infos details
 */
const computeTotalVolume: computeTotalVolumeFn = packagingInfos => {
  if (!packagingInfos) {
    return undefined;
  }
  return packagingInfos.reduce(
    (acc, packaging) =>
      acc + (packaging.volume || 0) * (packaging.quantity || 0),
    0
  );
};

function flattenEmitterInput(input: { emitter?: BsdasriEmitterInput }) {
  return {
    emitterCompanyName: chain(input.emitter, e =>
      chain(e.company, c => c.name)
    ),
    emitterCompanySiret: chain(input.emitter, e =>
      chain(e.company, c => c.siret)
    ),
    emitterCompanyAddress: chain(input.emitter, e =>
      chain(e.company, c => c.address)
    ),
    emitterCompanyContact: chain(input.emitter, e =>
      chain(e.company, c => c.contact)
    ),
    emitterCompanyPhone: chain(input.emitter, e =>
      chain(e.company, c => c.phone)
    ),
    emitterCompanyMail: chain(input.emitter, e =>
      chain(e.company, c => c.mail)
    ),
    emitterWorkSiteName: chain(input.emitter, e =>
      chain(e.workSite, w => w.name)
    ),
    emitterWorkSiteAddress: chain(input.emitter, e =>
      chain(e.workSite, w => w.address)
    ),
    emitterWorkSiteCity: chain(input.emitter, e =>
      chain(e.workSite, w => w.city)
    ),
    emitterWorkSitePostalCode: chain(input.emitter, e =>
      chain(e.workSite, w => w.postalCode)
    ),
    emitterWorkSiteInfos: chain(input.emitter, e =>
      chain(e.workSite, w => w.infos)
    ),
    emitterCustomInfo: chain(input.emitter, e => e.customInfo),
    emitterOnBehalfOfEcoorganisme: chain(
      input.emitter,
      e => e.onBehalfOfEcoorganisme
    )
  };
}

function flattenEmissionInput(input: { emission?: BsdasriEmissionInput }) {
  if (!input?.emission) {
    return null;
  }
  const emitterWastePackagingsInfo = chain(input.emission, e =>
    chain(e.wasteDetails, w => w.packagingInfos)
  );
  return {
    wasteDetailsCode: chain(input.emission, e => e.wasteCode),
    wasteDetailsOnuCode: chain(input.emission, e =>
      chain(e.wasteDetails, w => w.onuCode)
    ),
    handedOverToTransporterAt: chain(input.emission, e =>
      e.handedOverAt ? new Date(e.handedOverAt) : null
    ),
    emitterWasteQuantity: chain(input.emission, e =>
      chain(e.wasteDetails, w => chain(w.quantity, q => q.value))
    ),
    emitterWasteQuantityType: chain(input.emission, e =>
      chain(e.wasteDetails, w => chain(w.quantity, q => q.type))
    ),
    emitterWasteVolume: computeTotalVolume(emitterWastePackagingsInfo),
    emitterWastePackagingsInfo
  };
}
function flattenTransporterInput(input: {
  transporter?: BsdasriTransporterInput;
}) {
  return safeInput({
    transporterCompanyName: chain(input.transporter, t =>
      chain(t.company, c => c.name)
    ),
    transporterCompanySiret: chain(input.transporter, t =>
      chain(t.company, c => c.siret)
    ),
    transporterCompanyAddress: chain(input.transporter, t =>
      chain(t.company, c => c.address)
    ),
    transporterCompanyContact: chain(input.transporter, t =>
      chain(t.company, c => c.contact)
    ),
    transporterCompanyPhone: chain(input.transporter, t =>
      chain(t.company, c => c.phone)
    ),
    transporterCompanyMail: chain(input.transporter, t =>
      chain(t.company, c => c.mail)
    ),

    transporterReceipt: chain(input.transporter, t => t.receipt),
    transporterReceiptDepartment: chain(
      input.transporter,
      t => t.receiptDepartment
    ),
    transporterReceiptValidityLimit: chain(input.transporter, t =>
      t.receiptValidityLimit
        ? new Date(t.receiptValidityLimit)
        : t.receiptValidityLimit
    ),
    transporterCustomInfo: chain(input.transporter, e => e.customInfo)
  });
}
function flattenTransportInput(input: { transport?: BsdasriTransportInput }) {
  const transporterWastePackagingsInfo = chain(input.transport, t =>
    chain(t.wasteDetails, w => w.packagingInfos)
  );
  return {
    transportMode: chain(input.transport, t => t.mode),
    transporterTakenOverAt: chain(input.transport, t =>
      t.takenOverAt ? new Date(t.takenOverAt) : t.takenOverAt
    ),
    handedOverToRecipientAt: chain(input.transport, t =>
      t.handedOverAt ? new Date(t.handedOverAt) : t.handedOverAt
    ),
    transporterWasteQuantity: chain(input.transport, t =>
      chain(t.wasteDetails, w => chain(w.quantity, q => q.value))
    ),
    transporterWasteQuantityType: chain(input.transport, t =>
      chain(t.wasteDetails, w => chain(w.quantity, q => q.type))
    ),
    transporterWasteAcceptationStatus: chain(input.transport, t =>
      chain(t.wasteAcceptation, w => w.status)
    ),
    transporterWasteRefusedQuantity: chain(input.transport, t =>
      chain(t.wasteAcceptation, w => w.refusedQuantity)
    ),
    transporterWasteRefusalReason: chain(input.transport, t =>
      chain(t.wasteAcceptation, w => w.refusalReason)
    ),
    transporterWasteVolume: computeTotalVolume(transporterWastePackagingsInfo),
    transporterWastePackagingsInfo
  };
}

function flattenRecipientInput(input: { recipient?: BsdasriRecipientInput }) {
  return {
    recipientCompanyName: chain(input.recipient, r =>
      chain(r.company, c => c.name)
    ),
    recipientCompanySiret: chain(input.recipient, r =>
      chain(r.company, c => c.siret)
    ),
    recipientCompanyAddress: chain(input.recipient, r =>
      chain(r.company, c => c.address)
    ),
    recipientCompanyContact: chain(input.recipient, r =>
      chain(r.company, c => c.contact)
    ),
    recipientCompanyPhone: chain(input.recipient, r =>
      chain(r.company, c => c.phone)
    ),
    recipientCompanyMail: chain(input.recipient, r =>
      chain(r.company, c => c.mail)
    ),
    recipientCustomInfo: chain(input.recipient, e => e.customInfo)
  };
}

function flattenReceptiontInput(input: { reception?: BsdasriReceptionInput }) {
  const recipientWastePackagingsInfo = chain(input.reception, r =>
    chain(r.wasteDetails, w => w.packagingInfos)
  );
  return {
    recipientWasteVolume: computeTotalVolume(recipientWastePackagingsInfo),
    receivedAt: chain(input.reception, r =>
      r.receivedAt ? new Date(r.receivedAt) : r.receivedAt
    ),
    recipientWasteAcceptationStatus: chain(input.reception, t =>
      chain(t.wasteAcceptation, w => w.status)
    ),
    recipientWasteRefusedQuantity: chain(input.reception, t =>
      chain(t.wasteAcceptation, w => w.refusedQuantity)
    ),
    recipientWasteRefusalReason: chain(input.reception, t =>
      chain(t.wasteAcceptation, w => w.refusalReason)
    ),
    recipientWastePackagingsInfo
  };
}

function flattenOperationInput(input: { operation?: BsdasriOperationInput }) {
  return {
    processingOperation: chain(input.operation, o => o.processingOperation),
    recipientWasteQuantity: chain(input.operation, o =>
      chain(o.quantity, q => q.value)
    ),

    processedAt: chain(input.operation, o =>
      o.processedAt ? new Date(o.processedAt) : o.processedAt
    )
  };
}
export function flattenBsdasriInput(
  formInput: Pick<
    BsdasriInput,
    | "emitter"
    | "emission"
    | "transporter"
    | "transport"
    | "recipient"
    | "reception"
    | "operation"
  >
): Partial<Prisma.BsdasriCreateInput> {
  return safeInput({
    ...flattenEmitterInput(formInput),
    ...flattenEmissionInput(formInput),
    ...flattenTransporterInput(formInput),
    ...flattenTransportInput(formInput),
    ...flattenRecipientInput(formInput),
    ...flattenReceptiontInput(formInput),
    ...flattenOperationInput(formInput)
  });
}
