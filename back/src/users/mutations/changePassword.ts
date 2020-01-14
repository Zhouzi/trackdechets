import { prisma } from "../../generated/prisma-client";
import { hash, compare } from "bcrypt";
import { DomainError, ErrorCode } from "../../common/errors";

/**
 * Change user password
 * @param userId
 * @param oldPassword
 * @param newPassword
 */
export async function changePassword(userId, oldPassword, newPassword) {
  const user = await prisma.user({ id: userId });
  const passwordValid = await compare(oldPassword, user.password);
  if (!passwordValid) {
    throw new DomainError(
      "L'ancien mot de passe est incorrect.",
      ErrorCode.BAD_USER_INPUT
    );
  }

  const hashedPassword = await hash(newPassword, 10);
  return await prisma.updateUser({
    where: { id: userId },
    data: { password: hashedPassword }
  });
}
