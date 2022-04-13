import clsx from "clsx";
import "./style.scss";

interface InputProps {
  [key: string]: any;
  className?: string;
}

export default function Input({ className, ...rest }: InputProps) {
  return <input {...rest} className={clsx("input-box", className)} />;
}
