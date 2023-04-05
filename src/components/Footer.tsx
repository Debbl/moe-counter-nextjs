import Image from "next/image";
import GithubIcon from "~/assets/images/github.svg";

export default function Footer() {
  return (
    <div className="">
      <a
        href="https://github.com/Debbl/moe-counter-nextjs"
        target="_blank"
        rel="noreferrer"
      >
        <Image src={GithubIcon} alt="github" />
      </a>
    </div>
  );
}
