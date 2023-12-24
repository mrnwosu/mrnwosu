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
      className={` flex flex-col items-center bg-claw_nueve/50 py-2 px-2 rounded-xl text-claw_diez transition duration-100 ease-in hover:text-claw_nueve`}
    >
      <props.icon sx={{ fontSize: props.size }} />
    </Link>
  );
};
