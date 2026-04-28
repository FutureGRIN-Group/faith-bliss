/* eslint-disable no-irregular-whitespace */
import { FaithBlissLogo } from "@/components/branding/FaithBlissLogo";

interface HeartBeatLoaderProps {
  message?: string;
}

export const HeartBeatLoader = ({
  message = "Finding your perfect match...",
}: HeartBeatLoaderProps) => {
  return (
    <div className="fixed inset-0 bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center z-50">
      {/* REMOVED: The <style jsx global> block */}
      <div className="text-center">
        <div className="relative flex items-center justify-center">
          {/* Pulsing rings - now relying on global .pulse-ring class */}
          <div className="absolute w-32 h-32 rounded-full border-2 border-pink-500/30 pulse-ring"></div>
          <div
            className="absolute w-24 h-24 rounded-full border-2 border-pink-400/20 pulse-ring"
            style={{ animationDelay: "0.5s" }}
          ></div>

          <div className="relative z-10 heartbeat-animation flex items-center justify-center">
            <FaithBlissLogo
              imgProps={{
                className: "w-20 h-20 max-w-[5rem] object-contain",
              }}
            />
          </div>
        </div>
        <div className="mt-8 space-y-2">
          <p className="text-white text-lg font-medium animate-pulse">
            {message}
          </p>
          <div className="flex justify-center space-x-1">
            <div
              className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
