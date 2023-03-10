import type { FC, ReactNode } from "react";
import type { SocialNetwork } from "../../../social/social-network";
import { Facebook } from "../../atoms/icons/facebook";
import { Github } from "../../atoms/icons/github";
import { Instagram } from "../../atoms/icons/instagram";
import { Linkedin } from "../../atoms/icons/linkedin";
import { Twitch } from "../../atoms/icons/twitch";
import { Twitter } from "../../atoms/icons/twitter";
import { Youtube } from "../../atoms/icons/youtube";

type SocialLinkProps = {
  href: string;
  type: SocialNetwork;
  name: string;
};

const SocialLinkIcon: { [key in SocialNetwork]: ReactNode } = {
  twitter: <Twitter />,
  linkedin: <Linkedin />,
  youtube: <Youtube />,
  twitch: <Twitch />,
  facebook: <Facebook />,
  instagram: <Instagram />,
  github: <Github />,
};

export const SocialLink: FC<SocialLinkProps> = (props) => {
  const { href, type, name } = props;
  return (
    <a
      href={href}
      target="_blank"
      className="w-10 h-10 rounded-full flex justify-center items-center bg-white border border-gray-400 shadow-xl"
      rel="nofollow"
      aria-label={`Enlace a ${type} de ${name}`}
    >
      {SocialLinkIcon[type]}
    </a>
  );
};
