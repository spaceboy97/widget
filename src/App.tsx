import axios from "axios";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

import { toast } from "react-toastify";
import VPaymentWidget from "vfd-react-widget";
import useQueryParams from "./hooks/useQueryParams";
import { refineErrorResponse } from "./utils/refineerror";

const App = () => {
  let SCALE_BASE_URL = import.meta.env.VITE_SCALE_BASE_URL;
  let VFD_ACCESS_TOKEN = import.meta.env.VITE_VFD_ACCESS_TOKEN;
  let VFD_MERCHANT_ID = import.meta.env.VITE_VFD_MERCHANT_ID;
  let VFD_ENVIRONMENT = import.meta.env.VITE_VFD_ENVIRONMENT;

  const { CUSTOMER_ID, AMOUNT, IS_STAGING } = useQueryParams();

  useEffect(() => {
    if (IS_STAGING) {
      SCALE_BASE_URL = import.meta.env.VITE_SCALE_BASE_URL_STAGING;
      VFD_MERCHANT_ID = import.meta.env.VITE_VFD_MERCHANT_ID_STAGING;
      VFD_ENVIRONMENT = import.meta.env.VITE_VFD_ENVIRONMENT_STAGING;
      VFD_ACCESS_TOKEN = import.meta.env.VITE_VFD_ACCESS_TOKEN_STAGING;
    }
  }, [IS_STAGING]);

  let isWidgetSet = false;
  const getRepaymentWidget = async () => {
    await axios
      .post(
        `${SCALE_BASE_URL}/scale/payments/fund/widget`,
        {
          amount: Number(AMOUNT),
          customer_id: CUSTOMER_ID,
        },
        {
          headers: {
            // Authorization: `Bearer ${HEADER}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (isWidgetSet) {
          return;
        }
        isWidgetSet = true;
        triggerOnlinePayment(res.data?.data?.reference);
      })
      .catch((err) => {
        toast.error(refineErrorResponse(err));
        console.error("Error fetching repayment wallet:", err);
      });
  };

  const triggerPaymentVerification = (
    trxnRef: string,
    res: { method: string; reference: string }
  ) => {
    axios
      .get(
        SCALE_BASE_URL +
          `/scale/payments/widget/fund/${trxnRef}/${res?.reference}&method=${res?.method}`
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
    try {
      const widget = await VPaymentWidget.loadWidget();
      const widgetLaunch = new widget({
        token: VFD_ACCESS_TOKEN,
        merchantId: VFD_MERCHANT_ID,
        email: "user@email.com",
        logo: "https://scalebyrenda-web-staging-640575896362.us-central1.run.app/assets/scale-color-ce270efb.png",
        environment: VFD_ENVIRONMENT,
        onSuccess: (res: { method: string; reference: string }) => {
          triggerPaymentVerification(reference, res);
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
    } catch (error) {
      console.error(error);
      toast.error("Error launching payment widget");
    }
  };

  useEffect(() => {
    if (CUSTOMER_ID && AMOUNT) {
      getRepaymentWidget();
    } else {
      toast.error("Missing customer_id or amount in the query params.");
    }
  }, [CUSTOMER_ID, AMOUNT]);

  return <></>;
};

export default App;
