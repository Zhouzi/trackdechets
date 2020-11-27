import { MutationResolvers } from "../../../generated/graphql/types";
import { prisma } from "../../../generated/prisma-client";
import { checkIsAuthenticated } from "../../../common/permissions";
import { expandFormFromDb } from "../../form-converter";
import { checkCanReadUpdateDeleteForm } from "../../permissions";
import { getFormOrFormNotFound } from "../../database";
import { UserInputError } from "apollo-server-express";

const deleteFormResolver: MutationResolvers["deleteForm"] = async (
  parent,
  { id },
  context
) => {
  const user = checkIsAuthenticated(context);

  const form = await getFormOrFormNotFound({ id });

  if (!["DRAFT", "SEALED"].includes(form.status)) {
    const errMessage =
      "Seuls les bordereaux en brouillon ou en attente de collecte peuvent être supprimés";
    throw new UserInputError(errMessage);
  }

  await checkCanReadUpdateDeleteForm(user, form);

  const deletedForm = await prisma.updateForm({
    where: { id },
    data: { isDeleted: true }
  });

  return expandFormFromDb(deletedForm);
};

export default deleteFormResolver;
