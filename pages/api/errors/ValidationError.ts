import { Error } from "./error";

export const ValidationError = (
  correlationId: string,
  detail: string
): Error => {
  return {
    status: "ERROR",
    type: "ValidationError",
    detail,
    correlationId,
  };
};
