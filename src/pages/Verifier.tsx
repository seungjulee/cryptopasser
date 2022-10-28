import React from "react";
import { Link } from "react-router-dom";
import NFTCard, { NewNFTCard } from "../components/NFTCard";
// eslint-disable-next-line
const QrReader = require("react-qr-reader");

export enum VerificationMode {
    UNINITIALIZED = 0,
    USER = 1,
    NFT = 2,
    TOKEN = 3,
}

interface VerifierProps {
    mode: VerificationMode;
}

export default function Verifier(props: VerifierProps) {
    const { mode } = props;

    return (
        <div className="bg-gradient-to-b from-pink-100 to-purple-200 h-screen">
            <div className="container m-auto px-6 py-20 md:px-12 lg:px-20">
                <div className="mt-12 m-auto -space-y-4 items-center justify-center md:flex md:space-y-0 md:-space-x-4 xl:w-10/12">
                    <div className="relative z-10 -mx-4 group md:w-6/12 md:mx-0 lg:w-5/12">
                        <div
                            aria-hidden="true"
                            className="absolute top-0 w-full h-full rounded-2xl bg-white shadow-xl"
                        />
                        {mode === VerificationMode.UNINITIALIZED && (
                            <div className="relative">
                                <div className="flex flex-col text-center">
                                    <Link to="/verify/user">
                                        <div className="py-8 h-1/3 border-4 rounded-2xl hover:bg-pink-100 border-pink-300">
                                            <span className="text-5xl">Verify User</span>
                                        </div>
                                    </Link>
                                    <Link to="/verify/nft">
                                        <div className="py-8 h-1/3 border-4 rounded-2xl hover:bg-pink-100 border-pink-300">
                                            <span className="text-5xl">{`Verify User's NFT`}</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )}
                        {mode === VerificationMode.NFT && (
                            <>
                                <div className="relative p-6 space-y-6 lg:p-8">
                                    <h3 className="text-3xl text-gray-700 font-semibold text-center">
                                        Verify NFT Ownership
                                    </h3>
                                    <div>
                                        <p className="text-gray-700 text-center">
                                            Select a NFT to verify the ownership
                                        </p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="flex flex-wrap">
                                        <NFTCard contractAddress="0x25ed58c027921e14d86380ea2646e3a1b5c55a8b" />
                                        <NFTCard contractAddress="0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D" />
                                        <NewNFTCard />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
