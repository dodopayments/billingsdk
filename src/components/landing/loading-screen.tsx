"use client";

import Image from "next/image";
import React from "react";

interface LoadingScreenProps {
    className?: string;
    onLoadingComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
    className = "",
}) => {
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A] ${className}`}>
            <div className="flex flex-col items-center space-y-6">
                {/* Dodo Logo */}
                <div className="w-16 h-16 animate-pulse">
                    <Image
                        src="/logo/logo-dodo.svg"
                        alt="Dodo Payments"
                        width={64}
                        height={64}
                        className="w-16 h-16"
                    />
                </div>

                {/* Text */}
                <div className="text-center space-y-1">
                    <h1 className="text-xl font-semibold text-white">Dodo Payments</h1>
                    <p className="text-sm text-gray-300">Billing SDK</p>
                </div>
            </div>
        </div>
    );
};