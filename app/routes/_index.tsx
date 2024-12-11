import {
  Stack,
  Title,
  Text,
  List,
  Checkbox,
  Group,
  Center,
  Container,
  Space,
  Anchor,
} from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Kiosk Audit" },
    { name: "description", content: "The CSRD audit app by Kiosk" },
  ];
};

export const handle = {
  breadcrumb: () => "Case study",
};

export default function Index() {
  return (
    <Stack maw={800} mr="auto" pt={20} pl={24} justify="center">
      <Title>Welcome to the Kiosk case study!</Title>
      <Text>
        This is the skeleton of Kiosk’s latest application: the Audit App.
      </Text>

      <Space />
      <Title order={2}>Context</Title>
      <Text>
        The CSRD is a new European regulation that has companies produce yearly
        sustainability reports. After they are produced, these reports need to
        be audited, and this is where this application comes in!
      </Text>

      <Space />
      <Title order={2}>Goals</Title>
      <Text>
        Help auditors by creating a simple tasking system. By the end of it, it
        should be straightforward for them to create new tasks and attribute
        them to each other.
      </Text>
      <Text>Here are the product requirements:</Text>
      <List>
        <List.Item>
          <Checkbox label="Users can create tasks" />
        </List.Item>
        <List.Item>
          <Checkbox label="Users can filter tasks" />
        </List.Item>
        <List.Item>
          <Group>
            <Checkbox label="Users can create sub-tasks" />
          </Group>
        </List.Item>
        <List.Item>
          <Checkbox label="Users can reorder tasks" />
        </List.Item>
      </List>

      <Title order={3}>Users can create tasks</Title>
      <Text>A task has:</Text>
      <List listStyleType="disc">
        <List.Item>
          <Text>a title</Text>
        </List.Item>
        <List.Item>
          <Text>a state: TODO/DOING/DONE</Text>
        </List.Item>
        <List.Item>
          <Text>an owner</Text>
        </List.Item>
        <List.Item>
          <Text>(optional) a description</Text>
        </List.Item>
      </List>

      <Text>
        Create a checklist page where users can see all their tasks and create
        or delete them.
      </Text>

      <Text>
        To create a new task, you are free to use whichever method you prefer: a
        modal, a drawer, a new page...
      </Text>

      <Title order={3}>Users can filter tasks</Title>
      <Text>
        We are starting to have a lot of tasks on the checklist page and it
        becomes hard for our users to navigate. You now need to add filters to
        navigate more easily and find exactly the task you are looking for.
      </Text>

      <Text>
        Users said they want to filter task by owner, state, or name. If several
        filters are active, the result should be the intersection of all
        filters.
      </Text>

      <Title order={3}>Users can create sub-tasks</Title>
      <Text>
        Some tasks are complex and involve several steps. We now want to be able
        to breakdown tasks into subtasks.
      </Text>

      <Text>
        Subtasks belong to exactly one task and have a simpler model. They only
        have a name and a TODO/DONE state.
      </Text>

      <Text>
        On the checklist page, subtasks appear below their tasks and are easily
        «toggleable».
      </Text>

      <Text>
        You are free to do whatever you want on the display side: show/don’t
        show, collapse sub-tasks...
      </Text>

      <Title order={3}>Users can reorder tasks</Title>
      <Text>
        Filters help a lot navigating tasks, but users also want to reorder
        their tasks now.
      </Text>

      <Text>
        Implement re-ordering by allowing users to drag and drop tasks.
      </Text>

      <Space />
      <Title order={2}>Guidelines</Title>
      <List listStyleType="number">
        <List.Item>
          <Text fw="bold">
            Remix{" "}
            <Anchor href="https://remix.run/docs/en/main/start/tutorial">
              tutorial
            </Anchor>
            :
          </Text>
          <Text>
            Spend sometimes going through the Remix tutorial to understand how
            it works. It is pragmatic and based on HTML fundamentals and it does
            not stand in the way.
            <br />
            You will be assessed notably on your ability to understand how it
            works and apply its principles.
          </Text>
        </List.Item>
        <List.Item>
          <Text fw="bold">Favor finished work:</Text>
          <Text>
            It’s ok to not complete all the requirements. Always favor something
            done and done well against trying to do everything.
          </Text>
        </List.Item>
        <List.Item>
          <Text fw="bold">Clear is better than clever:</Text>
          <Text>If you can, try to do things simply.</Text>
        </List.Item>
      </List>

      <Space />
      <Title order={2}>References</Title>
      <List listStyleType="disc">
        <List.Item>
          <Anchor href="https://remix.run/docs/en/main/start/tutorial">
            Remix tutorial
          </Anchor>
        </List.Item>
        <List.Item>
          <Anchor href="https://mantine.dev/core/app-shell/">Mantine</Anchor>
        </List.Item>
      </List>
      <Space h="200" />
    </Stack>
  );
}
