import type { FC, PropsWithChildren } from "react";

type ButtonVariant = "default" | "outline" | "text";

type ButtonProps = {
  type?: "button" | "link";
  href?: string;
  rel?: string;
  onClick?(): void;
  variant?: ButtonVariant;
  className?: string;
};

const BUTTON_DEFAULT_CLASSES =
  "inline-flex items-center justify-center w-full px-8 py-4 text-base font-bold leading-6 text-white bg-primary dark:bg-accent border border-transparent rounded-full md:w-auto hover:bg-primary-light dark:hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600";

const BUTTON_VARIANT_CLASSES: { [variant in ButtonVariant]: string } = {
  outline:
    "bg-transparent dark:bg-transparent border-primary text-primary dark:text-accent hover:bg-gray-100 dark:hover:bg-gray-50 dark:hover:bg-opacity-10",
  text: "bg-transparent dark:bg-transparent border-transparent text-primary dark:text-accent hover:bg-gray-50 dark:hover:bg-gray-50 dark:hover:bg-opacity-5",
  default: "",
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
  } = props;

  return type === "link" ? (
    <a
      href={href}
      type="button"
      rel={rel}
      className={`${BUTTON_DEFAULT_CLASSES} ${BUTTON_VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </a>
  ) : (
    <button
      className={`${BUTTON_DEFAULT_CLASSES} ${BUTTON_VARIANT_CLASSES[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
