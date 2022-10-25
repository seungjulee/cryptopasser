import { ethers } from "ethers";
import React, { useState } from "react";
import { signInWithEthereum } from "./eth/swie";

declare let window: any;

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = 24 * HOUR;

export default function App() {
    const [myAddress, setMyAddress] = useState<string>("");
    const [chainId, setChainId] = useState<number>(1);
    const [signedToken, setSignedToken] = useState<string>("");

    async function requestAccount() {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setMyAddress(address);
            const network = await provider.getNetwork();
            setChainId(network.chainId);
        } catch (e: any) {
            window.alert(e.data?.message?.toString() || e.message);
        }
    }

    async function onSignIn() {
        const msg = await signInWithEthereum();
        setSignedToken(JSON.stringify(msg));
    }

    return (
        <div className="bg-gradient-to-b from-pink-100 to-purple-200">
            <div className="container m-auto px-6 py-20 md:px-12 lg:px-20 w-full h-full">
                {/* <div className="m-auto text-center lg:w-8/12 xl:w-7/12">
                    <h2 className="text-2xl text-pink-900 font-bold md:text-4xl">
                        A Tailus Blocks subscription gives you access to our components and more.
                    </h2>
                </div> */}
                <div className="mt-12 m-auto -space-y-4 items-center justify-center md:flex md:space-y-0 md:-space-x-4 xl:w-10/12">
                    <div className="relative z-10 -mx-4 group md:w-6/12 md:mx-0 lg:w-5/12">
                        <div
                            aria-hidden="true"
                            className="absolute top-0 w-full h-full rounded-2xl bg-white shadow-xl transition duration-500 group-hover:scale-105 lg:group-hover:scale-110"
                        />
                        <div className="relative p-6 space-y-6 lg:p-8">
                            <h3 className="text-3xl text-gray-700 font-semibold text-center">
                                Organisation
                            </h3>
                            <div>
                                <div className="relative flex justify-around">
                                    <div className="flex items-end">
                                        <span className="text-8xl text-gray-800 font-bold leading-0">
                                            35
                                        </span>
                                        <div className="pb-2">
                                            <span className="block text-2xl text-gray-700 font-bold">
                                                %
                                            </span>
                                            <span className="block text-xl text-purple-500 font-bold">
                                                Off
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div role="list" className="w-max space-y-4 py-6 m-auto text-gray-600">
                                <li className="space-x-2">
                                    <span className="text-purple-500 font-semibold">&check;</span>
                                    <span>First premium advantage</span>
                                </li>
                                <li className="space-x-2">
                                    <span className="text-purple-500 font-semibold">&check;</span>
                                    <span>Second advantage weekly</span>
                                </li>
                                <li className="space-x-2">
                                    <span className="text-purple-500 font-semibold">&check;</span>
                                    <span>Third advantage donate to project</span>
                                </li>
                            </div>
                            <p className="flex items-center justify-center space-x-4 text-lg text-gray-600 text-center">
                                <span>Call us at</span>
                                <a
                                    href="tel:+24300"
                                    className="flex space-x-2 items-center text-purple-600"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        className="w-6"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                                    </svg>
                                    <span className="font-semibold">+1 000 000</span>
                                </a>
                                <span>or</span>
                            </p>
                            <p className="text-gray-700">
                                Team can be any size, and you can add or switch members as needed.
                                Companies using our platform include:
                            </p>
                            <button
                                type="submit"
                                title="Submit"
                                className="block w-full py-3 px-6 text-center rounded-xl transition bg-purple-600 hover:bg-purple-700 active:bg-purple-800 focus:bg-indigo-600"
                            >
                                <span className="text-white font-semibold">Send us an email</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
