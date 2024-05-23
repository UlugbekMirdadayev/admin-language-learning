import { deleteRequest } from "../services/api";
import { toast } from "react-toastify";

export const handleDelete = (url, setLoader, handleUpdate, token) => {
  setLoader(true);
  deleteRequest(url, token)
    .then(({ data }) => {
      setLoader(false);
      toast.info(data?.result);
      handleUpdate(true);
    })
    .catch((err) => {
      setLoader(false);
      toast.error(err?.response?.data?.result);
    });
};
