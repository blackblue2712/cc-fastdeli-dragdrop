export type Error = {
  correlationId: string;
  status: "ERROR";
  detail: string;
  type: "ValidationError";
};
