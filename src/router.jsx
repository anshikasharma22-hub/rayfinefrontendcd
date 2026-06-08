import React from "react";
import { Routes, Route } from "react-router-dom";

import App from "./App";
import RFOPanel from "./RFOPanel";
import Login from "./login";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/rfo" element={<RFOPanel />} />
      <Route path="/admin" element={<RFOPanel />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
