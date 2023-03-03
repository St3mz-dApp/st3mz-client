import ReactDOM from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import App from "./App";
import { ScrollToTop } from "./components/common/ScrollToTop";
import "./assets/index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Router>
    <ScrollToTop />
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Router>
);
