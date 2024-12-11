import { Avatar, Flex, Menu, Text, Group, UnstyledButton } from "@mantine/core";
import { Link } from "@remix-run/react";
import { IconChevronUp, IconList, IconTrash } from "@tabler/icons-react";

import classes from "./ReportMenu.module.css";

export const ReportMenu = () => {
  return (
    <Menu>
      <Menu.Target>
        <UnstyledButton className={classes["report-menu__button"]}>
          <Flex justify="space-between" align="center">
            <Group gap={8}>
              <Avatar
                alt="company profile"
                color="green"
                radius="sm"
                size={31}
                className={classes["report-menu__avatar"]}
              >
                K
              </Avatar>
              <Flex direction="column">
                <Text className={classes["report-menu__title"]}>CSRD 2024</Text>
                <Text className={classes["report-menu__subtitle"]}>Orange</Text>
              </Flex>
            </Group>
            <IconChevronUp color="var(--mantine-color-gray-8)" />
          </Flex>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown className={classes["report-menu__dropdown"]}>
        <Menu.Item
          leftSection={<IconList size={18} />}
          className={classes["report-menu__item"]}
        >
          <Link to="/reports">Switch report</Link>
        </Menu.Item>
        <Menu.Item
          leftSection={<IconTrash size={18} />}
          className={classes["report-menu__item"]}
        >
          Delete report
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
