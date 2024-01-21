import Link from "next/link";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material/SvgIcon";

export type LinkProps = {
  href: string;
  description: string;
  icon: OverridableComponent<SvgIconTypeMap>;
  size: number;
};

export const TopIconLink = function (props: LinkProps) {
  return (
    <Link
      href={props.href}
      className={` flex flex-col items-center py-2 px-2 text-white/70 transition duration-100 ease-in hover:text-white/100`}
    >
      <props.icon sx={{ fontSize: props.size }} />
    </Link>
  );
};
