import "./style.scss";

export default function FilePicker() {
  return (
    <form id="file-upload-form" className="uploader">
      <input id="file-upload" type="file" name="fileUpload" />
      <label htmlFor="file-upload" id="file-drag">
        <img id="file-image" src="#" alt="Preview" className="hidden" />
        <div id="start">
          <div>یک فایل انتخاب کنید یا به اینجا بکشید.</div>
          <button id="file-upload-btn" className="btn btn-primary">
            انتخاب فایل
          </button>
        </div>
        <div id="response" className="hidden">
          <div id="messages"></div>
          <progress className="progress" id="file-progress" value="0">
            <span>0</span>%
          </progress>
        </div>
      </label>
    </form>
  );
}
