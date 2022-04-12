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
  const [isAccepted, setIsAccepted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [error, setError] = useState("");

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
      labelRef.current.className = e.type === "dragover" ? "dragged" : "file-upload";
    }
  };

  const parseFile = (file: any) => {
    setError(encodeURI(file.name));
    var imageName = file.name;
    var isBad = /\.(?=exe)/gi.test(imageName);
    setIsAccepted(!isBad);
  };

  const uploadFile = (file: any) => {
    fileSizeLimit = fileSizeLimit || 1;
    if (file.size <= fileSizeLimit * 1024 * 1024) {
      setIsUploading(true);

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "ml_default");
      axios.post("https://api.cloudinary.com/v1_1/dhvgwaugh/image/upload", data, {
        onUploadProgress: (e) => {
          const percent = Math.floor((e.loaded / file.size) * 100);
          setUploadPercent(percent > 100 ? 100 : percent);
        },
      });
    } else {
      setIsAccepted(false);
      setIsUploading(false);
      setError(`حجم فایل موردنظر باید کمتر از ${fileSizeLimit} مگابایت باشد.`);
    }
  };

  const fileSelectHandler = (e: any) => {
    // Fetch FileList object
    var files = e.target.files || e.dataTransfer.files;
    // Cancel event and hover styling
    onDragCheck(e);
    // Process all File objects
    for (var i = 0, f; (f = files[i]); i++) {
      parseFile(f);
      uploadFile(f);
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
          <div hidden={isUploading} className="upload-start">
            <Upload className="upload-icon" />
            <div>یک فایل انتخاب کنید یا به اینجا بکشید</div>
            <span className="btn select-button">انتخاب فایل</span>
          </div>
          <div className="upload-info" hidden={!isUploading}>
            {isUploading && (
              <CircularProgressbar
                className="progress"
                value={uploadPercent}
                text={`${uploadPercent}%`}
                strokeWidth={3}
              />
            )}
          </div>
          {error && <div className="upload-message">{error}</div>}
        </label>
      </form>
    </div>
  );
}
