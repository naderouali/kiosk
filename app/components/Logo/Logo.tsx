import KioskLogo from "../../../assets/img/kiosk_full.svg";
import { Box } from "@mantine/core";

import classes from "./Logo.module.css";

type LogoProps = {
  height: number;
};

export const Logo = ({ height }: LogoProps) => {
  return (
    <Box className={classes.logo}>
      <img height={height} src={KioskLogo} alt="company logo" />
    </Box>
  );
};
