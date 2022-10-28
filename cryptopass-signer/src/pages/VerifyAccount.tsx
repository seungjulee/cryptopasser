import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorTypes, SiweMessage } from "siwe";
import { UserNFTCard } from "../components/NFTCard";
import { EMPTY_ENS_PROFILE, ENSProfile, getENSProfile } from "../eth/ens";
import { checkNFTsOfUser, NFTUserMetadata } from "../eth/opensea";
import { verify } from "../eth/swie";
import { VerificationMode } from "./Verifier";
// eslint-disable-next-line
const QrReader = require("react-qr-reader");

interface VerifyAccountProps {
    mode: VerificationMode;
}

export default function VerifyAccount(props: VerifyAccountProps) {
    const { mode } = props;
    const { contractAddress } = useParams();

    const [data, setData] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [parsedMsg, setParsedMsg] = useState<SiweMessage>();
    const [ensProfile, setENSProfile] = useState<ENSProfile>(EMPTY_ENS_PROFILE);
    const [isCheckingNFT, setIsCheckingNFT] = useState(false);
    const [hasCheckedNFT, setHasCheckedNFT] = useState(false);
    const [nftMetadata, setNFTMetadata] = useState<NFTUserMetadata>();

    if (
        mode === VerificationMode.NFT &&
        parsedMsg &&
        parsedMsg.address &&
        contractAddress &&
        !hasCheckedNFT
    ) {
        setIsCheckingNFT(true);
        try {
            checkNFTsOfUser(parsedMsg.address, contractAddress).then((meta) => {
                if (meta) {
                    setNFTMetadata(meta);
                    console.log(meta);
                }
            });
        } catch (e) {
            setErrMsg(String(e));
        }
        setIsCheckingNFT(false);
        setHasCheckedNFT(true);
    }

    const handleScan = async (scanData: string) => {
        if (!scanData || scanData === "") return;
        setData(scanData);
        parseData(scanData);
    };

    const parseData = async (scanData: string) => {
        if (!scanData) return;
        try {
            const parsed = await verify(scanData);
            setParsedMsg(parsed);
            // getNFTsOfUser(parsed.address);
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
        setErrMsg(err.message);
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
                        <div className="relative p-6 space-y-6 lg:p-8">
                            <h3 className="text-3xl text-gray-700 font-semibold text-center">
                                Verify{" "}
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
                            {!data && (
                                <div>
                                    <QrReader
                                        facingMode="environment"
                                        delay={500}
                                        onError={handleError}
                                        onScan={handleScan}
                                    />
                                </div>
                            )}
                            {errMsg && <p className="text-red-600 font-bold">{errMsg}</p>}
                            {data && parsedMsg && (
                                <div>
                                    <div className="flex mb-4" />
                                    <div>
                                        {mode === VerificationMode.NFT && (
                                            <div className="flex flex-col mb-4">
                                                {isCheckingNFT && (
                                                    <span>Checking the NFT ownership...</span>
                                                )}
                                                {hasCheckedNFT &&
                                                    !nftMetadata &&
                                                    "User does not own this NFT"}
                                                {hasCheckedNFT && nftMetadata && (
                                                    <UserNFTCard
                                                        openseaLink={nftMetadata.openseaLink}
                                                        imageURL={nftMetadata.imageURL}
                                                        name={nftMetadata.name}
                                                        symbol={nftMetadata.symbol}
                                                        description={nftMetadata.description}
                                                        tokenID={nftMetadata.tokenID}
                                                    />
                                                )}
                                            </div>
                                        )}
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
