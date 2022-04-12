import { useState, useRef } from "react";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import { ReactComponent as Upload } from "../../assets/svg/upload.svg";
import "./style.scss";

interface FilePickerProps {
  [key: string]: any;
  fileSizeLimit?: number;
}

export default function FilePicker({ fileSizeLimit }: FilePickerProps) {
  const labelRef = useRef<HTMLLabelElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [message, setMessage] = useState("");
  const [uploadedList, setUploadedList] = useState<string[]>([]);

  const onSubmit = (e: any) => {
    e.preventDefault();

    // reset upload progress
    setUploadPercent(0);
  };

  const onDragCheck = (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    // reset upload progress
    setUploadPercent(0);

    if (labelRef.current) {
      labelRef.current.className = e.type === "dragover" ? "dragged" : "upload-label";
    }
  };

  const parseFile = (file: any) => {
    const isBad = /\.(?=exe)/gi.test(file.name);
    if (isBad) {
      setIsAccepted(false);
      setIsUploading(false);
      setMessage("نوع فایل موردنظر پشتیبانی نمی‌شود.");
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
        setUploadedList((old) => [...old, data.secure_url]);
      } catch (e) {
        console.error(e);
      }
    } else {
      setIsAccepted(false);
      setIsUploading(false);
      setMessage(`حجم فایل موردنظر باید کمتر از ${fileSizeLimit} مگابایت باشد.`);
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
          ref={labelRef}
          htmlFor="file-upload"
          className="upload-label"
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
                strokeWidth={3}
              />
            </div>
          )}
          {message && <div className="upload-message">{message}</div>}
        </label>
      </form>
      <div className="uploaded-list">
        {uploadedList?.map((item) => (
          <div>
            <input type="text" readOnly value={item} />
            <button>Copy</button>
          </div>
        ))}
      </div>
    </div>
  );
}
