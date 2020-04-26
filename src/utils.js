import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export const getDateFormat = (timedate) => {
  // return timedate.toISOString().split("T")[0];
  const parts = timedate.toLocaleDateString().split("/");
  const newDateStr = `${parts[2]}-${parts[0]}-${parts[1]}`;
  return newDateStr;
};

export const notify = (notificationType, msg) => {
  const options = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 4000,
    closeOnClick: false,
    hideProgressBar: true,
    pauseOnHover: false,
  };

  toast[notificationType](msg, options);
};

export const CapitalizeFirstLetter = (str) => {
  return str[0].toUpperCase() + str.slice(1);
};

export const SortStrArr = (strArr) => {
  return strArr.sort((a, b) => {
    const aUpper = a.toUpperCase();
    const bUpper = b.toUpperCase();

    if (aUpper > bUpper) return 1;
    if (aUpper < bUpper) return -1;
    return 0;
  });
};

export default {
  getDateFormat,
  notify,
  CapitalizeFirstLetter,
  SortStrArr,
};
