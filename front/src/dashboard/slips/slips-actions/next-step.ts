import { Form, FormStatus } from "generated/graphql/types";

export function getNextStep(form: Form, currentSiret: string) {
  const currentUserIsRecipient =
    currentSiret === form.recipient?.company?.siret;
  const currentUserIsTempStorer =
    currentUserIsRecipient && form.recipient?.isTempStorage;
  const currentUserIsDestination =
    currentSiret === form.temporaryStorageDetail?.destination?.company?.siret;

  if (form.status === FormStatus.Draft) return FormStatus.Sealed;

  if (currentUserIsDestination) {
    if (form.status === FormStatus.Resent) return FormStatus.Received;
    if (form.status === FormStatus.Received) return FormStatus.Processed;
  }

  if (currentUserIsTempStorer) {
    if (form.status === FormStatus.Sent) return FormStatus.TempStored;
    if (form.status === FormStatus.TempStored) return FormStatus.Resealed;
    return null;
  }

  if (currentUserIsRecipient) {
    if (
      form.status === FormStatus.Sent &&
      form.temporaryStorageDetail?.temporaryStorer == null
    )
      return FormStatus.Received;
    if (form.status === FormStatus.Received) return FormStatus.Processed;
  }

  return null;
}
