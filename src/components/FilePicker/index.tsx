import { useState, useRef } from "react";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import sendToast from "../../utils/toast";
import CopyToClipboard from "../CopyToClipboard";
import { ReactComponent as Upload } from "../../assets/svg/upload.svg";
import "./style.scss";
import clsx from "clsx";

interface FilePickerProps {
  [key: string]: any;
  fileSizeLimit?: number;
}

export default function FilePicker({ fileSizeLimit }: FilePickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [message, setMessage] = useState("");
  const [labelClasses, setLabelClasses] = useState("upload-label");
  const [uploadedList, setUploadedList] = useState<string[]>([]);

  const uploadedListScrollable = useRef<HTMLDivElement>(null);

  const onSubmit = (e: any) => {
    e.preventDefault();

    // reset upload progress
    setUploadPercent(0);
  };

  const onDragCheck = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    // reset upload progress
    if (e.type !== "dragover") {
      setUploadPercent(0);
    }

    // if file is dropped directly add effect
    setLabelClasses(e.type === "dragover" ? "dragged upload-label" : "upload-label");
  };

  const parseFile = (file: any) => {
    const isBad = !/\.(?=jpg|gif|jpeg|png|tiff|webp)/gi.test(file.name);
    if (isBad) {
      setIsAccepted(false);
      setIsUploading(false);
      setMessage("");
      sendToast("نوع فایل موردنظر پشتیبانی نمی‌شود.");
    } else {
      setIsAccepted(true);
      setMessage(encodeURI(file.name));
      uploadFile(file);
    }
  };

  const uploadFile = async (file: any) => {
    setIsUploading(true);

    fileSizeLimit = fileSizeLimit || 1;
    if (isAccepted || file.size <= fileSizeLimit * 1024 * 1024) {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "ml_default");

      try {
        const { data }: any = await axios.post("https://api.cloudinary.com/v1_1/dhvgwaugh/image/upload", uploadData, {
          onUploadProgress: (e) => {
            const percent = Math.floor((e.loaded / file.size) * 100);
            setUploadPercent(percent > 100 ? 100 : percent);
          },
        });

        // add to uploaded list
        setUploadedList((old) => [...old, data.secure_url]);
        // scroll to the bottom of uploaded list
        setTimeout(() => {
          if (uploadedListScrollable.current) {
            const height = uploadedListScrollable.current.scrollHeight;
            uploadedListScrollable.current.scroll({ top: height, behavior: "smooth" });
          }
        }, 100);
      } catch (e) {
        console.error(e);
      }
    } else {
      setIsAccepted(false);
      setIsUploading(false);
      sendToast(`حجم فایل موردنظر باید کمتر از ${fileSizeLimit} مگابایت باشد.`);
    }
  };

  const fileSelectHandler = (e: any) => {
    // Fetch FileList object
    const files = e.target.files || e.dataTransfer.files;
    // Cancel event and hover styling
    onDragCheck(e);
    // Process all File objects
    for (let i = 0, f; (f = files[i]); i++) {
      parseFile(f);
    }
  };

  return (
    <div className="uploader-wrapper">
      <form className="uploader" onSubmit={onSubmit}>
        <input type="file" id="file-upload" name="fileUpload" onChange={fileSelectHandler} multiple />
        <label
          htmlFor="file-upload"
          className={labelClasses}
          onDragLeave={onDragCheck}
          onDragOver={onDragCheck}
          onDrop={fileSelectHandler}
        >
          {!isUploading ? (
            <div className="upload-start">
              <Upload className="upload-icon" />
              <div>یک فایل انتخاب کنید یا به اینجا بکشید</div>
              <span className="btn select-button">انتخاب فایل</span>
            </div>
          ) : (
            <div className="upload-info">
              <CircularProgressbar
                className="progress"
                value={uploadPercent}
                text={`${uploadPercent}%`}
                strokeWidth={2}
              />
            </div>
          )}
          {message && <div className="upload-message">{message}</div>}
        </label>
      </form>
      {uploadedList.length > 0 && (
        <div className="uploaded-list-wrapper toast-in">
          <div ref={uploadedListScrollable} className="uploaded-list">
            {uploadedList.map((item) => (
              <CopyToClipboard key={item} value={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
