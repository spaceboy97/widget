import { useMemo } from "react";

const useQueryParams = () => {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);

    return {
      SCALE_BASE_URL: import.meta.env.VITE_SCALE_BASE_URL,
      VFD_ACCESS_TOKEN: import.meta.env.VITE_VFD_ACCESS_TOKEN,
      VFD_MERCHANT_ID: import.meta.env.VITE_VFD_MERCHANT_ID,
      VFD_ENVIRONMENT: import.meta.env.VITE_VFD_ENVIRONMENT,
      CUSTOMER_ID: params.get("customerId"),
      AMOUNT: params.get("amount"),
    };
  }, []);
};

export default useQueryParams;
