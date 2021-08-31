import { MutationResolvers } from "../../../generated/graphql/types";
import { checkIsAuthenticated } from "../../../common/permissions";
import { createBsff } from "../../database";

const createDraftBsffResolver: MutationResolvers["createDraftBsff"] = async (
  _,
  { input },
  context
) => {
  const user = checkIsAuthenticated(context);
  return createBsff(user, input, { isDraft: true });
};

export default createDraftBsffResolver;
