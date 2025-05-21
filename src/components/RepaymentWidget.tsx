import axios from "axios";
import { useEffect, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";

import { toast } from "react-toastify";
import VPaymentWidget from "vfd-react-widget";
import useQueryParams from "../hooks/useQueryParams";

export const RepaymentWidget = () => {
  let SCALE_BASE_URL = import.meta.env.VITE_SCALE_BASE_URL;
  let VFD_ACCESS_TOKEN = import.meta.env.VITE_VFD_ACCESS_TOKEN;
  let VFD_MERCHANT_ID = import.meta.env.VITE_VFD_MERCHANT_ID;
  let VFD_ENVIRONMENT = import.meta.env.VITE_VFD_ENVIRONMENT;

  const { CUSTOMER_ID, AMOUNT, ENV, TRXN_REF } = useQueryParams();

  useEffect(() => {
    switch (ENV) {
      case "staging":
        SCALE_BASE_URL = import.meta.env.VITE_SCALE_BASE_URL_STAGING;
        VFD_MERCHANT_ID = import.meta.env.VITE_VFD_MERCHANT_ID_STAGING;
        VFD_ENVIRONMENT = import.meta.env.VITE_VFD_ENVIRONMENT_STAGING;
        VFD_ACCESS_TOKEN = import.meta.env.VITE_VFD_ACCESS_TOKEN_STAGING;
        break;
      case "uat":
        SCALE_BASE_URL = import.meta.env.VITE_SCALE_BASE_URL_UAT;
        VFD_MERCHANT_ID = import.meta.env.VITE_VFD_MERCHANT_ID_STAGING;
        VFD_ENVIRONMENT = import.meta.env.VITE_VFD_ENVIRONMENT_STAGING;
        VFD_ACCESS_TOKEN = import.meta.env.VITE_VFD_ACCESS_TOKEN_STAGING;
        break;

      default:
        break;
    }
  }, [ENV]);

  const isWidgetSet = useRef(false);

  const triggerPaymentVerification = (res: {
    method: string;
    reference: string;
  }) => {
    console.log(CUSTOMER_ID, TRXN_REF, res?.reference);
    axios
      .post(
        SCALE_BASE_URL +
          `/scale/repayment/complete/${CUSTOMER_ID}/${TRXN_REF}/${res?.reference}`
      )
      .then(
        () =>
          (window.location.href =
            "https://scalebyrenda-web-staging-640575896362.us-central1.run.app/auth/sign-in")
      )
      .catch(() => toast.error("failure at fund api call"));
  };

  // Trigger the payment widget after fetching the necessary params
  const triggerOnlinePayment = async (reference: string) => {
    if (isWidgetSet.current) {
      return;
    }

    isWidgetSet.current = true;
    try {
      const widget = await VPaymentWidget.loadWidget();
      const widgetLaunch = new widget({
        token: VFD_ACCESS_TOKEN,
        merchantId: VFD_MERCHANT_ID,
        email: "user@email.com",
        logo: "https://scalebyrenda-web-staging-640575896362.us-central1.run.app/assets/scale-color-ce270efb.png",
        environment: VFD_ENVIRONMENT,
        onSuccess: (res: { method: string; reference: string }) => {
          triggerPaymentVerification(res);
          window.parent.postMessage(
            {
              event: "paymentSuccess",
              scale_transaction_Ref: reference,
              vfd_payment_response: res,
            },
            "*"
          );
        },
      });
      widgetLaunch.pay({ amount: AMOUNT });
    } catch (err) {
      console.log(err);
      toast.error("Error launching payment widget");
    }
  };

  useEffect(() => {
    if (CUSTOMER_ID && AMOUNT && TRXN_REF) {
      triggerOnlinePayment(TRXN_REF);
    } else {
      toast.error("Missing customer_id or amount in the query params.");
    }
  }, [CUSTOMER_ID, AMOUNT, TRXN_REF]);

  return <></>;
};
