import { Group, ThemeIcon, Divider, Text, Flex } from "@mantine/core";
import { Link, UIMatch, useMatches } from "@remix-run/react";
import { IconSettings } from "@tabler/icons-react";

import classes from "./Header.module.css";
import { UserPopover } from "@kiosk/audit/components/UserPopover/UserPopover";
import { routes } from "@kiosk/audit/utils/constants/routes";

type BreadcrumbMatch = UIMatch<
  Record<string, unknown>,
  { breadcrumb: (data?: unknown) => JSX.Element }
>;

export const Header = () => {
  const matches = useMatches() as BreadcrumbMatch[];
  const breadcrumb = matches
    .find(({ handle }) => handle?.breadcrumb)
    ?.handle.breadcrumb();

  return (
    <Flex className={classes.header__container}>
      <Text className={classes.header__title}>{breadcrumb}</Text>
      <Group>
        <Link to={routes.CASE_STUDY.path} className={classes.header__settings}>
          <ThemeIcon>
            <IconSettings />
          </ThemeIcon>
        </Link>
        <Divider orientation="vertical" />
        <UserPopover />
      </Group>
    </Flex>
  );
};
