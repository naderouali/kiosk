import { Menu, UnstyledButton, Avatar, Group, Text, Flex } from "@mantine/core";
import { Link } from "@remix-run/react";
import { IconLogout2 } from "@tabler/icons-react";

import classes from "./UserPopover.module.css";

export const UserPopover = () => {
  return (
    <Menu position="bottom-end">
      <Menu.Target>
        <UnstyledButton>
          <Group>
            <Text className={classes["menu__target-title"]}>John Doe</Text>
            <Avatar alt="user-profile-picture" color="green" radius="xl" />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={
            <Avatar alt="user-profile-picture" color="green" radius="xl" />
          }
        >
          <Link to="/settings/account/edit">
            <Flex direction="column">
              <Text>John Doe</Text>
              <Text className={classes["menu__item-email"]}>
                john.doe@gmail.com
              </Text>
            </Flex>
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item leftSection={<IconLogout2 size={20} />}>Sign Out</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
