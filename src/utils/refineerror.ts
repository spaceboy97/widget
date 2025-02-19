// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const refineErrorResponse = (err: any) => {
  const errorMessage: string =
    err?.data?.message ?? err?.message ?? err?.data?.response?.message;
  return errorMessage?.replaceAll("_", " ");
};
