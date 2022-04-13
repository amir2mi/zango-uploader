import clsx from "clsx";
import { ReactComponent as Copy } from "../../assets/svg/copy.svg";
import sendToast from "../../utils/toast";
import Input from "../input";
import "./style.scss";

interface CopyToClipboardProps {
  [key: string]: any;
  className?: string;
  value: string;
}

export default function CopyToClipboard({ className, value, ...rest }: CopyToClipboardProps) {
  const handleOnClick = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(value);
        sendToast("لینک کپی شد!");
      } catch (e) {
        sendToast("کپی لینک با خطا مواجه شد، لطفا مجددا امتحان کنید.");
      }
    }
  };

  return (
    <div {...rest} className={clsx("copy-to-clipboard", className)}>
      <Input type="text" readOnly value={value} />
      <button className="copy-btn" onClick={handleOnClick}>
        <Copy />
      </button>
    </div>
  );
}
