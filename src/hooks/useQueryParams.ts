import { useMemo } from "react";

const useQueryParams = () => {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);

    return {
      CUSTOMER_ID: params.get("customerId") || "67acc42af94882ff6a7463fa",
      AMOUNT: params.get("amount") || "100",
      IS_STAGING: params.get("environment")?.toLowerCase() === "staging",
    };
  }, []);
};

export default useQueryParams;
