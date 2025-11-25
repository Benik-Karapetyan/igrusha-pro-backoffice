import { useAuthContext } from "@providers";
import { router } from "@routes";
import { RouterProvider } from "@tanstack/react-router";

import "./global.css";

function App() {
  const { auth } = useAuthContext();

  return <RouterProvider router={router} context={{ auth }} />;
}

export default App;
