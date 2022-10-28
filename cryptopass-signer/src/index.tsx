import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import DelegatedClient from "./pages/DelegatedClient";
import Issue from "./pages/Issue";
import Verifier, { VerificationMode } from "./pages/Verifier";
import VerifyAccount from "./pages/VerifyAccount";

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
    {
        path: "verify",
        element: <Verifier mode={VerificationMode.UNINITIALIZED} />,
    },
    {
        path: "verify/nft",
        element: <Verifier mode={VerificationMode.NFT} />,
    },
    {
        path: "verify/user",
        element: <VerifyAccount mode={VerificationMode.USER} />,
    },
    {
        path: "verify/nft/:contractAddress",
        element: <VerifyAccount mode={VerificationMode.NFT} />,
    },
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        {/* <DelegatedClient /> */}
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
);
