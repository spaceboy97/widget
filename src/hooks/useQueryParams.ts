import { useMemo } from "react";

const useQueryParams = () => {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);

    return {
      CUSTOMER_ID: params.get("customerId"),
      AMOUNT: params.get("amount"),
      IS_STAGING: params.get("environment")?.toLowerCase() === "staging",
    };
  }, []);
};

export default useQueryParams;
