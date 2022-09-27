import type { FC } from "react";
import { Moon } from "../../atoms/icons/Moon";
import { Sun } from "../../atoms/icons/Sun";
import { useTheme } from "./use-theme";

type ThemeModeToggleProps = {
  className?: string;
  onClick?(): void;
};

export const ThemeModeToggle: FC<ThemeModeToggleProps> = (props) => {
  const { className = "", onClick = () => {} } = props;
  const { isDarkSelected, toggleTheme } = useTheme();

  const onButtonClick = () => {
    toggleTheme();
    onClick();
  };

  return (
    <button
      className={`flex items-center justify-center w-10 h-10 bg-white rounded-full cursor-pointer hover:bg-gray-100 ${className}`}
      tabIndex={0}
      onClick={onButtonClick}
    >
      {isDarkSelected ? <Sun /> : <Moon />}
    </button>
  );
};
