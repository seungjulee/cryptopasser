import { ethers } from "ethers";
import { QRCodeSVG } from "qrcode.react";
import React, { useState } from "react";
import Button from "../components/Button";
import { EMPTY_ENS_PROFILE, ENSProfile, getENSProfile } from "../eth/ens";
import { signInWithEthereum } from "../eth/swie";

declare let window: any;

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = 24 * HOUR;
const DEFAULT_EXPIRATION_DURATION = 7 * DAY;

interface ToggleButtonProps {
    onClick: () => void;
    label: string;
}

function ToggleButton(props: ToggleButtonProps) {
    const { onClick, label } = props;
    return (
        <label
            // htmlFor="default-toggle"
            className="inline-flex relative items-center cursor-pointer"
        >
            <input
                type="checkbox"
                value="checked"
                // id="default-toggle"
                className="sr-only peer"
                onClick={onClick}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            <span className="ml-3 text-sm font-medium">{label}</span>
        </label>
    );
}

interface SelectInputProps {
    onChange: (duration: number) => void;
}

function SelectInput(props: SelectInputProps) {
    const { onChange } = props;

    return (
        <div className="flex justify-center">
            <div className="mb-3 xl:w-96">
                <select
                    className="form-select
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    aria-label="Default select example"
                    defaultValue={DEFAULT_EXPIRATION_DURATION}
                    onChange={(e) => onChange(Number(e.target.value))}
                >
                    <option value={1 * DAY}>1 day</option>
                    <option value={3 * DAY}>3 days</option>
                    <option value={DEFAULT_EXPIRATION_DURATION}>7 days</option>
                    <option value={30 * DAY}>30 days</option>
                    <option value={0}>Never</option>
                </select>
            </div>
        </div>
    );
}

export default function Issue() {
    const [myAddress, setMyAddress] = useState<string>("");
    const [chainId, setChainId] = useState<number>();
    const [signedToken, setSignedToken] = useState<string>("");
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const [ensProfile, setENSProfile] = useState<ENSProfile>(EMPTY_ENS_PROFILE);

    const [allowAllNetwork, setAllowAllNetwork] = useState(false);
    const [isUseOnlyOnce, setIsUseOnlyOnce] = useState(false);
    const [expDuration, setExpDuration] = useState<number>(DEFAULT_EXPIRATION_DURATION);

    async function requestAccount() {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setMyAddress(address);
            const network = await provider.getNetwork();
            setChainId(network.chainId);
            setIsWalletConnected(true);
        } catch (e: any) {
            window.alert(e.data?.message?.toString() || e.message);
        }
    }

    async function onSign() {
        const msg = await signInWithEthereum(
            allowAllNetwork ? undefined : chainId,
            expDuration > 0 ? expDuration : undefined
        );
        setSignedToken(JSON.stringify(msg));
        setIsSigned(true);
        const ens = await getENSProfile(myAddress);
        setENSProfile(ens);
    }

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
                                Issue{" "}
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

                            {!isWalletConnected && (
                                <Button onClick={requestAccount} label="Connect Wallet" />
                            )}
                            {isWalletConnected && !isSigned && (
                                <div>
                                    <div className="flex flex-col mb-4">
                                        <h6 className="font-bold mb-2 ">Account</h6>
                                        <span className="truncate">{myAddress}</span>
                                        {ensProfile.name && (
                                            <span className="truncate">{ensProfile.name}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col mb-4">
                                        <h6 className="font-bold mb-2">Chain Id</h6>
                                        {chainId}
                                    </div>
                                    <div className="flex flex-col mb-4">
                                        <h6 className="font-bold mb-2">Expires in</h6>
                                        <SelectInput onChange={setExpDuration} />
                                    </div>
                                    <div className="mb-2">
                                        <ToggleButton
                                            onClick={() => setAllowAllNetwork(!allowAllNetwork)}
                                            label="Grant token access to all network"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <ToggleButton
                                            onClick={() => setIsUseOnlyOnce(!isUseOnlyOnce)}
                                            label="Use only once (prevent replay attack)"
                                        />
                                    </div>
                                    <div className="mx-2 pt-2">
                                        <Button onClick={onSign} label="Issue & Sign" />
                                    </div>
                                </div>
                            )}
                            {isWalletConnected && isSigned && (
                                <div className="w-full">
                                    <div className="mb-4">
                                        <QRCodeSVG
                                            value={signedToken}
                                            style={{ height: "256px" }}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-gray-700">
                                            From another device, please go to{" "}
                                            <span className="font-bold">{`${window.location.origin}/view`}</span>{" "}
                                            and scan the QR code to save the QR code onto your
                                            device.
                                        </p>
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
