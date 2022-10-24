import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import DelegatedClient from "./pages/DelegatedClient";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/view",
        element: <DelegatedClient />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        {/* <DelegatedClient /> */}
        <RouterProvider router={router} />
    </React.StrictMode>
);
