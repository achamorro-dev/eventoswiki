import type { FC, ReactNode } from "react";
import type { SocialNetwork } from "../../../social/social-network";
import { Facebook } from "../../atoms/icons/Facebook";
import { Instagram } from "../../atoms/icons/Instagram";
import { Linkedin } from "../../atoms/icons/Linkedin";
import { Twitch } from "../../atoms/icons/twitch";
import { Twitter } from "../../atoms/icons/Twitter";
import { Youtube } from "../../atoms/icons/Youtube";

type SocialLinkProps = {
  href: string;
  type: SocialNetwork;
};

const SocialLinkIcon: { [key in SocialNetwork]: ReactNode } = {
  twitter: <Twitter />,
  linkedin: <Linkedin />,
  youtube: <Youtube />,
  twitch: <Twitch />,
  facebook: <Facebook />,
  instagram: <Instagram />,
};

export const SocialLink: FC<SocialLinkProps> = (props) => {
  const { href, type } = props;
  return (
    <a
      href={href}
      target="_blank"
      className="w-10 h-10 rounded-full flex justify-center items-center bg-white border border-gray-400 shadow-xl"
      rel="nofollow"
    >
      {SocialLinkIcon[type]}
    </a>
  );
};
