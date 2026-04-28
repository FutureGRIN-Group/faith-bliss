/* eslint-disable no-irregular-whitespace */
import { FaithBlissMark } from "@/components/branding/FaithBlissLogo";
// Note: Ensure your index.css file (or equivalent) contains the .mini-heartbeat class

interface HeartBeatIconProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const HeartBeatIcon = ({
  size = "md",
  className = "",
}: HeartBeatIconProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <span
      className={`inline-flex items-center justify-center mini-heartbeat ${className}`}
    >
      <FaithBlissMark
        alt=""
        aria-hidden
        className={sizeClasses[size]}
      />
    </span>
  );
};
