import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="bg-gradient-to-b from-pink-100 to-purple-200 h-screen">
            <div className="container m-auto px-6 py-20 md:px-12 lg:px-20">
                <div className="mt-12 m-auto -space-y-4 items-center justify-center md:flex md:space-y-0 md:-space-x-4 xl:w-10/12">
                    <div className="relative z-10 -mx-4 group md:w-6/12 md:mx-0 lg:w-5/12">
                        <div
                            aria-hidden="true"
                            className="absolute top-0 w-full h-full rounded-2xl bg-white shadow-xl"
                        />
                        <div className="relative">
                            <div className="flex flex-col text-center">
                                <Link to="/issue">
                                    <div className="py-8 h-1/3 border-4 rounded-2xl hover:bg-pink-100 border-pink-300">
                                        <span className="text-5xl">✍🏻 Issue</span>
                                    </div>
                                </Link>
                                <Link to="/view">
                                    <div className="py-8 h-1/3 border-4 rounded-2xl hover:bg-pink-100 border-pink-300">
                                        <span className="text-5xl">👀 View & Save</span>
                                    </div>
                                </Link>
                                <Link to="/verify">
                                    <div className="py-8 h-1/3 border-4 rounded-2xl hover:bg-pink-100 border-pink-300">
                                        <span className="text-5xl">✅ Verify</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
