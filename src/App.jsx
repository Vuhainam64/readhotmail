import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";

import Routers from "./routers/Routers";
import { MainLoader } from "./components";

const App = () => {
  return (
    <Suspense fallback={<MainLoader />}>
      <ToastContainer position="top-right" autoClose={2000} />
      <Routers />
    </Suspense>
  );
};

export default App;
