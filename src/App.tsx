import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import IndexPage from "@/pages/index";
import AboutPage from "@/pages/about";
import SupportPage from "@/pages/support";
import GuidelinesPage from "@/pages/guidelines";

function App() {
  // Add scroll to top behavior on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<SupportPage />} path="/support" />
      <Route element={<GuidelinesPage />} path="/guidelines" />
    </Routes>
  );
}

export default App;
