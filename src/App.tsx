import "react-toastify/dist/ReactToastify.css";

import useQueryParams from "./hooks/useQueryParams";
import { FundWidget } from "./components/FundWidget";
import { toast } from "react-toastify";
import { RepaymentWidget } from "./components/RepaymentWidget";
import { PaymentWidget } from "./components/PaymentWidget";

const App = () => {
  const { TYPE } = useQueryParams();

  switch (TYPE) {
    case "fund":
      return <FundWidget />
    case "repayment":
      return <RepaymentWidget />
    case "payment":
      return <PaymentWidget />
    default:
      toast.info("invalid widget query param for 'type', options are 'fund','repayment','payment' ")
  }
};

export default App;
