import { useMemo } from "react";

const useQueryParams = () => {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);

    return {
      CUSTOMER_ID: params.get("customerId"),
      TRXN_REF: params.get("trxnRef"),
      AMOUNT: Number(params.get("amount")) / 100,
      TYPE: params.get("type"),
      TOKEN: params.get("token"),
      REPAYMENT_IDS: params.get("repaymentIds"),
      IS_STAGING: params.get("environment")?.toLowerCase() === "staging",
    };
  }, []);
};

export default useQueryParams;
