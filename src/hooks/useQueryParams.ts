import { useMemo } from "react";

const useQueryParams = () => {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);

    return {
      USER_ID: params.get("userId"),
      CUSTOMER_ID: params.get("customerId"),
      TRXN_REF: params.get("trxnRef"),
      AMOUNT: Number(params.get("amount")) / 100,
      TYPE: params.get("type"),
      TOKEN: params.get("token"),
      REPAYMENT_IDS: params.get("repaymentIds"),
      ENV: params.get("environment")?.toLowerCase(), //"staging" | "uat",
    };
  }, []);
};

export default useQueryParams;
