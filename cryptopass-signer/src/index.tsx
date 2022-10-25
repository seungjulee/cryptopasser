import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import DelegatedClient from "./pages/DelegatedClient";
import Issue from "./pages/Issue";
import Verifier from "./pages/Verifier";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Issue />,
    },
    {
        path: "issue",
        element: <Issue />,
    },
    {
        path: "view",
        element: <DelegatedClient />,
    },
    // {
    //     path: "app",
    //     element: <App />,
    // },
    {
        path: "verify",
        element: <Verifier />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        {/* <DelegatedClient /> */}
        <RouterProvider router={router} />
    </React.StrictMode>
);
