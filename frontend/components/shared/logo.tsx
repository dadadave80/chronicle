import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = ({
  classname,
  image,
  href,
}: {
  classname: string;
  image: string;
  href: string;
}) => {
  return (
    <Link href={href} className={classname}>
      <Image
        src={image}
        alt="Logo"
        className={`w-full`}
        width={131}
        height={25}
        priority
        quality={100}
      />
    </Link>
  );
};

export default Logo;
