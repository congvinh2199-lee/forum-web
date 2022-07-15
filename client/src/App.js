import MainRouter from "./router";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <MainRouter />
      <ToastContainer />
    </div>
  );
}

export default App;
