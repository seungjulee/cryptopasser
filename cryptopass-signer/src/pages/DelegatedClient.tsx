import localforage from "localforage";
import { QRCodeSVG } from "qrcode.react";
import React, { useEffect, useState } from "react";
import { ErrorTypes, SiweMessage } from "siwe";
import Button from "../components/Button";
import { EMPTY_ENS_PROFILE, ENSProfile, getENSProfile } from "../eth/ens";
import { verify } from "../eth/swie";

// eslint-disable-next-line
const QrReader = require("react-qr-reader");

const STORAGE_KEY = "authtoken";

export default function DelegatedClient() {
    const [data, setData] = useState("");
    const [isImporting, setIsImporting] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [parsedMsg, setParsedMsg] = useState<SiweMessage>();
    const [hasLocalData, setHasLocalData] = useState(false);
    const [ensProfile, setENSProfile] = useState<ENSProfile>(EMPTY_ENS_PROFILE);
    const [isLoading, setIsLoading] = useState(true);

    const handleScan = async (scanData: string) => {
        console.log(`loaded data data`, scanData);
        if (!scanData || scanData === "") return;
        setData(scanData);
        parseData(scanData);

        try {
            await localforage.setItem(STORAGE_KEY, scanData);
        } catch (e: any) {
            setErrMsg("failed to save the item");
        }
    };

    const parseData = async (scanData: string) => {
        try {
            const parsed = await verify(scanData);
            setParsedMsg(parsed);
            const ens = await getENSProfile(parsed.address);
            setENSProfile(ens);
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
    };

    const handleError = (err: Error) => {
        // window.alert(err);
    };

    const onImporting = () => {
        // verify(exampleSig);
        setIsImporting(true);
    };

    const onRemoveQRCode = () => {
        localforage
            .removeItem(STORAGE_KEY)
            .then(() => {
                setData("");
                setParsedMsg(undefined);
                setIsImporting(false);
            })
            .catch((e) => setErrMsg(e.message));
    };

    useEffect(() => {
        if (data || parsedMsg) {
            setIsLoading(false);
            return;
        }

        localforage
            .getItem(STORAGE_KEY)
            .then((d) => {
                setData(d as string);
                parseData(d as string);
                setIsLoading(false);
            })
            .catch((e) => setErrMsg(e.message));
    });

    return (
        <div className="bg-gradient-to-b from-pink-100 to-purple-200 h-screen">
            <div className="container m-auto px-6 py-20 md:px-12 lg:px-20">
                {/* <div className="m-auto text-center lg:w-8/12 xl:w-7/12">
                    <h2 className="text-2xl text-pink-900 font-bold md:text-4xl">
                        A Tailus Blocks subscription gives you access to our components and more.
                    </h2>
                </div> */}
                <div className="mt-12 m-auto -space-y-4 items-center justify-center md:flex md:space-y-0 md:-space-x-4 xl:w-10/12">
                    <div className="relative z-10 -mx-4 group md:w-6/12 md:mx-0 lg:w-5/12">
                        <div
                            aria-hidden="true"
                            className="absolute top-0 w-full h-full rounded-2xl bg-white shadow-xl"
                        />
                        <div className="relative p-6 space-y-6 lg:p-8">
                            <h3 className="text-3xl text-gray-700 font-semibold text-center">
                                View{" "}
                                <a
                                    rel="noopener"
                                    target="_blank"
                                    href="https://eips.ethereum.org/EIPS/eip-4361"
                                    className="text-purple-500 hover:text-purple-300"
                                >
                                    ERC-4361
                                </a>{" "}
                                Authentication Token
                            </h3>
                            {!isImporting && !data && !isLoading && (
                                <>
                                    <div className="flex space-x-2">
                                        <p className="flex items-center align-middle mr-2 text-3xl">
                                            😢
                                        </p>
                                        <span>
                                            There is no saved auth token. Please import it by
                                            scanning the qr code from{" "}
                                            <span className="font-bold">{`${window.location.origin}/issue`}</span>
                                            .
                                        </span>
                                    </div>
                                    <Button onClick={onImporting} label="Import" />
                                </>
                            )}
                            {isImporting && !data && (
                                <div>
                                    <QrReader
                                        facingMode="environment"
                                        delay={500}
                                        onError={handleError}
                                        onScan={handleScan}
                                    />
                                    <p className="text-red-600">{errMsg}</p>
                                </div>
                            )}
                            {isImporting && errMsg && <p className="text-red-600">{errMsg}</p>}
                            {data && parsedMsg && (
                                <div>
                                    <QRCodeSVG
                                        value={data}
                                        style={{ height: "256px" }}
                                        className="w-full my-4"
                                    />
                                    <div className="w-full flex justify-center mb-4">
                                        <div className="w-1/2">
                                            <Button isRed label="Remove" onClick={onRemoveQRCode} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex flex-col mb-4">
                                            <h6 className="font-bold mb-2 ">Account</h6>
                                            <span className="truncate">{parsedMsg.address}</span>
                                            {ensProfile.name && (
                                                <span className="truncate">{ensProfile.name}</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col mb-4">
                                            <h6 className="font-bold mb-2">Expires in</h6>
                                            {parsedMsg.expirationTime
                                                ? parsedMsg.expirationTime
                                                : "Never"}
                                        </div>
                                        <div className="flex flex-col mb-4">
                                            <h6 className="font-bold mb-2">Chain Id</h6>
                                            {parsedMsg.chainId}
                                        </div>
                                        <div className="flex flex-col mb-4">
                                            <h6 className="font-bold mb-2">Issuer</h6>
                                            {parsedMsg.domain}
                                        </div>
                                        <div className="flex flex-col mb-4">
                                            <h6 className="font-bold mb-2">Statement</h6>
                                            {parsedMsg.statement}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
