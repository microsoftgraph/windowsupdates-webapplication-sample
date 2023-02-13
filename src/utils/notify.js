import { toast } from "react-toastify";

export const notify = (text, type) => {
    if (type === "error")
        return toast.error(text, {position: toast.POSITION.TOP_RIGHT});
    else {
        return toast.success(text, {position: toast.POSITION.TOP_RIGHT});
    }
};
