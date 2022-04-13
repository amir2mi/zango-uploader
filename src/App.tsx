import { ToastContainer } from "react-toastify";
import FilePicker from "./components/FilePicker";

function App() {
  return (
    <div className="App">
      <h1 className="site-title">آپلودسنتر زانگو</h1>
      <FilePicker />
      <ToastContainer />
    </div>
  );
}

export default App;
