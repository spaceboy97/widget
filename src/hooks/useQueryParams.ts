import { useMemo } from "react";

const useQueryParams = () => {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);

    const isProduction =
      params.get("environment")?.toLowerCase() === "production";

    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzODkiLCJ0b2tlbklkIjoiMmRhZGE0NjMtOTZiYS00MmQyLThhYzMtZDRhYTg2YjgzNTU5IiwiaWF0IjoxNzM5MTkzMzAzLCJleHAiOjkyMjMzNzIwMzY4NTQ3NzV9.oxK5sxrh9OX3NzRj89V4AZ1lfwqRojag1umtk2V2mZNH3Alx21wSFEPKUvTijmXRC1_g3WJKV_r9oPwt5BsI_Q";

    return {
      SCALE_BASE_URL: isProduction
        ? "https://scaleapiproduction-640575896362.europe-central2.run.app/v1"
        : "https://scaleapistaging-640575896362.europe-central2.run.app/v1",
      VFD_ACCESS_TOKEN: token,
      VFD_MERCHANT_ID: isProduction ? "389" : "890",
      VFD_ENVIRONMENT: isProduction ? "production" : "development",
      CUSTOMER_ID: params.get("customerId") || "67acc42af94882ff6a7463fa",
      AMOUNT: params.get("amount") || "100",
    };
  }, []);
};

export default useQueryParams;
