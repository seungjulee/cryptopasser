import moment from "moment";
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
    const [isInvalidSig, setIsInvalidSig] = useState(false);
    const [isExpiredSig, setIsExpiredSig] = useState(false);

    if (
        mode === VerificationMode.NFT &&
        parsedMsg &&
        parsedMsg.address &&
        contractAddress &&
        !isCheckingNFT &&
        !hasCheckedNFT
    ) {
        setIsCheckingNFT(true);
        checkNFTsOfUser(parsedMsg.address, contractAddress)
            .then((meta) => {
                if (meta) {
                    setNFTMetadata(meta);
                }
                setHasCheckedNFT(true);
                setIsCheckingNFT(false);
            })
            .catch((e) => {
                setErrMsg(String(e));
                setHasCheckedNFT(true);
                setIsCheckingNFT(false);
            });
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
            setErrMsg("");
        } catch (e: any) {
            switch (e) {
                case ErrorTypes.EXPIRED_MESSAGE: {
                    setErrMsg(e.message);
                    setIsExpiredSig(true);
                    break;
                }
                case ErrorTypes.INVALID_SIGNATURE: {
                    setErrMsg(e.message);
                    setIsInvalidSig(true);
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

    const userHasNFT = !isCheckingNFT && hasCheckedNFT && nftMetadata;
    const renderNFTReason = () => {
        if (isCheckingNFT) {
            return <li>⏳ Checking the NFT ownership of the account</li>;
        }
        if (userHasNFT) {
            return <li>✅ User owns this NFT</li>;
        }

        return <li>❌ User does not own this NFT</li>;
    };

    const isAccessingFromSameDomain = window.location.host === parsedMsg?.domain;

    console.log(errMsg, isCheckingNFT, hasCheckedNFT);

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
                                    {errMsg && <p className="text-red-600 font-bold">{errMsg}</p>}
                                </div>
                            )}
                            {data && parsedMsg && (
                                <div>
                                    <div className="flex mb-4" />
                                    <div>
                                        <div>
                                            {((!errMsg && mode !== VerificationMode.NFT) ||
                                                (mode === VerificationMode.NFT && userHasNFT)) && (
                                                <div className="flex flex-col text-center space-y-2 justify-center">
                                                    <p className=" mr-2 text-9xl">✅</p>
                                                    <span className="text-6xl font-bold subpixel-antialiased pb-4">
                                                        VALID
                                                    </span>
                                                </div>
                                            )}
                                            {(errMsg && mode !== VerificationMode.NFT) ||
                                                (mode === VerificationMode.NFT &&
                                                    !isCheckingNFT &&
                                                    hasCheckedNFT &&
                                                    (!userHasNFT || errMsg) && (
                                                        <div className="flex flex-col text-center space-y-2 justify-center">
                                                            <p className=" mr-2 text-9xl">❌</p>
                                                            <span className="text-6xl font-bold subpixel-antialiased">
                                                                INVALID
                                                            </span>
                                                        </div>
                                                    ))}
                                            <ul className="list-none m-4 space-y-1.5 font-medium">
                                                {isInvalidSig ? (
                                                    <li>
                                                        ❌ Invalid signature. Not from the account
                                                        owner
                                                    </li>
                                                ) : (
                                                    <li>✅ Valid signature by the account owner</li>
                                                )}
                                                {isExpiredSig ? (
                                                    <li>
                                                        ❌ Expired{" "}
                                                        {moment(parsedMsg.expirationTime).fromNow()}
                                                    </li>
                                                ) : (
                                                    <li>
                                                        ✅ Not expired. Expire{" "}
                                                        {moment(parsedMsg.expirationTime).fromNow()}
                                                    </li>
                                                )}
                                                {isAccessingFromSameDomain ? (
                                                    <li>✅ Accessing from the same issuer host</li>
                                                ) : (
                                                    <li>
                                                        ❌ Not accessing from the same issuer host
                                                        {`. ${window.location.host} != ${parsedMsg.domain}`}
                                                    </li>
                                                )}
                                                <li>✅ Valid nonce</li>
                                                {mode === VerificationMode.NFT && renderNFTReason()}
                                                {errMsg && (
                                                    <li className="font-bold">❌ {errMsg}</li>
                                                )}
                                            </ul>
                                        </div>
                                        {mode === VerificationMode.NFT && userHasNFT && (
                                            <>
                                                <div className="relative flex py-5 items-center">
                                                    <div className="flex-grow border-t border-gray-400" />
                                                </div>
                                                <div className="flex flex-col mb-4">
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
                                            </>
                                        )}
                                        <div className="relative flex py-2 items-center">
                                            <div className="flex-grow border-t border-gray-400" />
                                        </div>
                                        <div className="flex flex-col mb-4 mt-2">
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
