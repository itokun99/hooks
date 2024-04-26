import React from "react";
import ReactDOM from "react-dom/client";
import { useDownload } from "../src";

const App = () => {
  const download = useDownload();

  return (
    <button
      onClick={() =>
        download.downloadFile(
          "https://nodejs.org/dist/v20.12.2/node-v20.12.2.pkg",
          "node-js.pkg",
          "application/octet-stream",
        )
      }
    >
      Test
    </button>
  );
};

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
