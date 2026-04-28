import type { ImgHTMLAttributes } from "react";

/** Vite `public/` asset; encoded for safe use with spaces in the filename. */
export const FAITHBLISS_LOGO_PUBLIC_PATH = encodeURI("/FB LOGO TR.png");

/** Plain `<img>` mark for tight layouts (buttons, overlays). */
export function FaithBlissMark({
  className = "",
  alt = "FaithBliss",
  ...rest
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={FAITHBLISS_LOGO_PUBLIC_PATH}
      alt={alt}
      className={`object-contain ${className}`.trim()}
      {...rest}
    />
  );
}

export interface FaithBlissLogoProps {
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;
}

export function FaithBlissLogo({
  className = "",
  showWordmark = false,
  wordmarkClassName = "",
  imgProps,
}: FaithBlissLogoProps) {
  const {
    className: imgClassName = "h-8 w-auto shrink-0 object-contain",
    ...restImg
  } = imgProps ?? {};

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={FAITHBLISS_LOGO_PUBLIC_PATH}
        alt="FaithBliss"
        className={imgClassName}
        {...restImg}
      />
      {showWordmark ? (
        <span className={wordmarkClassName}>FaithBliss</span>
      ) : null}
    </div>
  );
}
