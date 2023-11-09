import type { FC, HTMLAttributeAnchorTarget, PropsWithChildren } from "react";
import './button.css';

type ButtonVariant = "default" | "outline" | "text";

type ButtonProps = {
  type?: "button" | "link";
  href?: string;
  rel?: string;
  onClick?(): void;
  variant?: ButtonVariant;
  className?: string;
  target?: HTMLAttributeAnchorTarget;
};

export const Button: FC<PropsWithChildren<ButtonProps>> = (props) => {
  const {
    type = "button",
    variant = "default",
    onClick,
    href,
    className = "",
    children,
    rel,
    target = "_self",
  } = props;

  return type === "link" ? (
    <a
      href={href}
      type="button"
      rel={rel}
      className={`ew-button ew-button-${variant} ${className}`}
      target={target}
    >
      {children}
    </a>
  ) : (
    <button
      className={`button button-${variant} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
