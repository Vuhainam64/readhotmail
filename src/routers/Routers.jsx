import React from "react";
import { useRoutes } from "react-router-dom";

import ReadHotmail from "../pages/ReadHotmail";

const Routers = () => {
  const routing = useRoutes([
    {
      path: "/readHotmail",
      element: <ReadHotmail />,
    },
  ]);
  return routing;
};

export default Routers;
