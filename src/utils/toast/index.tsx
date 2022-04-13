import { toast, cssTransition } from "react-toastify";
import "./style.scss";

export default function sendToast(message: string) {
  const animation = cssTransition({
    collapseDuration: 250,
    enter: "toast-in",
    exit: "toast-out",
  });

  return toast(message, {
    transition: animation,
  });
}
