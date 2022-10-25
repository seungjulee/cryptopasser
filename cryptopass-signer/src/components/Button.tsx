import React from "react";

interface ButtonProps {
    onClick: () => void;
    label: string;
    isRed?: boolean;
}

Button.defaultProps = {
    isRed: false,
};

export default function Button(props: ButtonProps) {
    const { label, onClick, isRed } = props;

    return (
        <button
            onClick={onClick}
            type="button"
            className={`block w-full py-3 px-6 text-center rounded-xl transition ${
                isRed ? "bg-red-600" : "bg-purple-600"
            } hover:${isRed ? "bg-red-700" : "bg-purple-700"} active:${
                isRed ? "bg-red-800" : "bg-purple-800"
            } focus:${isRed ? "bg-red-600" : "bg-indigo-600"}`}
        >
            <span className="text-white font-semibold">{label}</span>
        </button>
    );
}
