import type { FC } from "react";
import type { Icon } from "./icon";

export const Youtube: FC<Icon> = ({ color, size }) => {
  return (
    <svg
      className={`w-6 h-6 stroke-[#ff0000]`}
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: size,
        height: size,
        stroke: color,
      }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <rect x="3" y="5" width="18" height="14" rx="4"></rect>
      <path d="M10 9l5 3l-5 3z"></path>
    </svg>
  );
};
