import React, { useState } from "react";
import { ErrorTypes, SiweMessage } from "siwe";
import { verify } from "../eth/swie";
// eslint-disable-next-line
const QrReader = require("react-qr-reader");

const STORAGE_KEY = "authtoken";

enum VerificationMode {
    UNINITIALIZED = 0,
    USER = 1,
    NFT = 2,
    TOKEN = 3,
}

export default function Verifier() {
    const [data, setData] = useState("");
    const [isImporting, setIsImporting] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [parsedMsg, setParsedMsg] = useState<SiweMessage>();

    const [verificationMode, setVerificationMode] = useState(VerificationMode.UNINITIALIZED);

    const handleScan = async (scanData: string) => {
        console.log(`loaded data `, scanData);
        if (scanData && scanData !== "") {
            setData(scanData);

            try {
                const parsed = await verify(scanData);
                setParsedMsg(parsed);
            } catch (e: any) {
                switch (e) {
                    case ErrorTypes.EXPIRED_MESSAGE: {
                        setErrMsg(e.message);
                        break;
                    }
                    case ErrorTypes.INVALID_SIGNATURE: {
                        setErrMsg(e.message);
                        break;
                    }
                    default: {
                        setErrMsg(e.message);
                        break;
                    }
                }
            }
        }
    };
    const handleError = (err: Error) => {
        // window.alert(err);
    };

    const onImporting = () => {
        // verify(exampleSig);
        setIsImporting(true);
    };

    const renderCard = () => {
        return (
            <div className="card bg-white w-1/2 h-[32rem] rounded-xl p-6 space-y-4 border border-black">
                <a href="./">
                    <img
                        className="w-full h-32 rounded-md transition hover:bg-cyan-300"
                        src="https://images.unsplash.com/photo-1635002962487-2c1d4d2f63c2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZGlnaXRhbCUyMGFydHxlbnwwfDJ8MHx8&auto=format&fit=crop&w=800&q=60"
                        alt=""
                    />
                </a>
                <div id="description" className="space-y-4">
                    <a href="./">
                        <h2 className="font-semibold text-xl transition hover:text-cyan-300">
                            Equilibrium #3429
                        </h2>
                    </a>
                    <p className="text-slate-500 text-sm select-none">
                        Our Equilibrium collection promotes balance and calm.
                    </p>
                    <div className="flex items-center justify-between font-semibold text-sm border-b border-slate-500 pb-6">
                        <span
                            id="price"
                            className="text-cyan-300 flex justify-between items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                viewBox="0 0 320 512"
                                fill="#67E7F9"
                            >
                                <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
                            </svg>
                            0.041 ETH
                        </span>
                        <span className="text-slate-500 flex justify-between items-center select-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            3 days left
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-b from-pink-100 to-purple-200 h-screen">
            <div className="container m-auto px-6 py-20 md:px-12 lg:px-20">
                <div className="mt-12 m-auto -space-y-4 items-center justify-center md:flex md:space-y-0 md:-space-x-4 xl:w-10/12">
                    <div className="relative z-10 -mx-4 group md:w-6/12 md:mx-0 lg:w-5/12">
                        <div
                            aria-hidden="true"
                            className="absolute top-0 w-full h-full rounded-2xl bg-white shadow-xl"
                        />
                        {verificationMode === VerificationMode.UNINITIALIZED && (
                            <div className="relative">
                                <div className="flex flex-col text-center">
                                    <div className="my-8 h-1/3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setVerificationMode(VerificationMode.USER)
                                            }
                                        >
                                            <span className="text-5xl">Verify User</span>
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setVerificationMode(VerificationMode.NFT)
                                            }
                                        >
                                            <span className="text-5xl">{`Verify User's NFT`}</span>
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setVerificationMode(VerificationMode.TOKEN)
                                            }
                                        >
                                            <span className="text-5xl">{`Verify User's Token`}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {verificationMode === VerificationMode.NFT && (
                            <>
                                <div className="relative p-6 space-y-6 lg:p-8">
                                    <h3 className="text-3xl text-gray-700 font-semibold text-center">
                                        Verify NFT Ownership
                                    </h3>
                                    <div>
                                        <p className="text-gray-700 text-center">
                                            Select a NFT to verify whether the user owns it
                                        </p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="flex">{renderCard()}</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
        // <Container>
        //     <Row
        //         style={{
        //             display: "flex",
        //             width: "100%",
        //             margin: "0 auto",
        //             justifyContent: "center",
        //             textAlign: "center",
        //         }}
        //         className="m-4"
        //     >
        //         <h2>Verify the token and the membership</h2>
        //     </Row>
        //     {isImporting && !data && (
        //         <Row style={{ justifyContent: "center", display: "flex" }}>
        //             <QrReader
        //                 facingMode="environment"
        //                 delay={500}
        //                 onError={handleError}
        //                 onScan={handleScan}
        //                 // chooseDeviceId={() => "environment"}
        //                 style={{ width: "420px", height: "420px" }}
        //             />
        //         </Row>
        //     )}
        //     {parsedMsg && (
        //         <Row style={{ justifyContent: "center", display: "flex" }}>
        //             <QRCodeSVG value={data} style={{ width: "420px", height: "420px" }} />
        //         </Row>
        //     )}
        // </Container>
    );
}
