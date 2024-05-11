import React from "react";
import ReactDOM from "react-dom/client";
import { useForm } from "../src";

const App = () => {
  const form = useForm({ name: "Indrawan" });

  return <button>{form.values.name}</button>;
};

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
