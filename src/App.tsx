import { ToastContainer } from "react-toastify";
import FilePicker from "./components/FilePicker";

function App() {
  return (
    <div className="App">
      <FilePicker />
      <ToastContainer />
    </div>
  );
}

export default App;
