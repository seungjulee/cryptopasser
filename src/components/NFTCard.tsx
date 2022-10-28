import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import {
    EMPTY_NFT_CONTRACT_METADATA,
    fetchNFTAssetFromOpenSea,
    NFTContractMetadata,
    NFTUserMetadata,
    normalizeOpenSeaContractData,
} from "../eth/opensea";

export interface NFTCardProps {
    contractAddress: string;
}

export default function NFTCard(props: NFTCardProps) {
    const { contractAddress } = props;
    const { isLoading, data, isError, error } = useQuery(
        `nft-info-${contractAddress}`,
        fetchNFTAssetFromOpenSea(contractAddress),
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        }
    );

    let normalizedData: NFTContractMetadata = EMPTY_NFT_CONTRACT_METADATA;
    if (!isLoading && !isError && data) {
        normalizedData = normalizeOpenSeaContractData(data);
    }

    return (
        <Link
            to={`/verify/nft/${contractAddress}`}
            className="card bg-white w-1/2 h-[16rem] rounded-xl p-6 space-y-4 border border-pink-300 hover:bg-pink-100"
        >
            {isLoading && <span>Loading...</span>}
            {!isLoading && isError && <span>{String(error)}</span>}
            {!isLoading && normalizedData && (
                <>
                    <div className="flex justify-center">
                        <img
                            className="w-32 h-32 rounded-md transition hover:bg-cyan-300 align-center"
                            src={normalizedData?.imageURL}
                            alt={normalizedData.name}
                        />
                    </div>
                    <div className="space-y-4">
                        <h2 className="font-semibold text-xl transition hover:text-cyan-300">
                            {`${normalizedData.name} (${normalizedData.symbol})`}
                        </h2>
                        {/* <p className="text-slate-500 text-sm select-none">
                            {normalizedData.description}
                        </p> */}
                    </div>
                </>
            )}
        </Link>
    );
}

export function UserNFTCard(props: NFTUserMetadata) {
    const { openseaLink, imageURL, name, symbol, description, tokenID } = props;
    return (
        <div className="flex flex-wrap flex-shrink">
            <a
                target="_blank"
                href={openseaLink}
                className="card bg-white h-[16rem] w-full rounded-2xl p-6 space-y-4 border border-pink-300 hover:bg-pink-100"
            >
                <div className="flex justify-center">
                    <img
                        className="w-32 h-32 rounded-md transition hover:bg-cyan-300 align-center"
                        src={imageURL}
                        alt={name}
                    />
                </div>
                <div className="space-y-1">
                    <div>
                        <h2 className="font-semibold text-xl transition hover:text-cyan-300">
                            {`${name} (${symbol})`}
                        </h2>
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm select-none truncate">#{tokenID}</p>
                        <p className="text-slate-500 text-sm select-none truncate">{description}</p>
                    </div>
                </div>
            </a>
        </div>
    );
}

export function NewNFTCard() {
    const [isAdding, setIsAdding] = useState(false);
    const [address, setAddress] = useState("");
    const [isSubitted, setIsSubmitted] = useState(false);

    if (isSubitted) {
        return <NFTCard contractAddress={address} />;
    }

    return isAdding ? (
        <div className="card bg-white w-1/2 h-[16rem] rounded-xl p-6 space-y-4 border border-pink-300 hover:bg-pink-100 flex justify-center">
            <div className="flex flex-col justify-center">
                <span className="font-bold text-center mb-2">Contract Address</span>
                <div className="flex flex-col justify-center">
                    <input
                        type="text"
                        className="border border-black rounded mb-2 py-2"
                        onChange={(e) => setAddress(e.target.value.trim())}
                    />
                    <button
                        type="button"
                        className="align-center border-black rounded-xl bg-purple-600 hover:purple-700 py-2 px-4"
                        onClick={() => setIsSubmitted(true)}
                    >
                        <span className="text-white font-semibold">Submit</span>
                    </button>
                </div>
            </div>
        </div>
    ) : (
        <button
            type="button"
            className="card bg-white w-1/2 h-[16rem] rounded-xl p-6 space-y-4 border border-pink-300 hover:bg-pink-100 flex justify-center"
            onClick={() => setIsAdding(true)}
        >
            <img src="https://www.svgrepo.com/show/2087/plus.svg" alt="+" />
        </button>
    );
}
