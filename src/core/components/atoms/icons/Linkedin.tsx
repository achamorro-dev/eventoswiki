import type { FC } from "react";
import type { Icon } from "./icon";

export const Linkedin: FC<Icon> = (props) => {
  const { size, color } = props;
  return (
    <svg
      className="w-6 h-6 stroke-[#0072b1]"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      style={{
        width: size,
        height: size,
        stroke: color,
      }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <rect x="4" y="4" width="16" height="16" rx="2"></rect>
      <line x1="8" y1="11" x2="8" y2="16"></line>
      <line x1="8" y1="8" x2="8" y2="8.01"></line>
      <line x1="12" y1="16" x2="12" y2="11"></line>
      <path d="M16 16v-3a2 2 0 0 0 -4 0"></path>
    </svg>
  );
};
