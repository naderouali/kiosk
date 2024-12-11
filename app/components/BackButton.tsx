import { ActionIcon, ThemeIcon } from "@mantine/core"
import { Link } from "@remix-run/react"
import { IconChevronLeft } from "@tabler/icons-react"

type Props = {
  readonly onClick?: () => void
  readonly type?: "button" | "submit" | "reset"
}

export function BackButton({ onClick, type }: Props) {
  return (
    <ActionIcon
      color="gray.2"
      h={42}
      p={12}
      variant="outline"
      w={42}
      {...(onClick ? { onClick } : {})}
      {...(type ? { type } : {})}
    >
      <ThemeIcon c="black" h={17} w={17}>
        <IconChevronLeft />
      </ThemeIcon>
    </ActionIcon>
  )
}

export const BackLink = ({ href }: { readonly href: string }) => {
  return (
    <Link prefetch="render" to={href}>
      <ActionIcon color="gray.2" h={42} p={12} variant="outline" w={42}>
        <ThemeIcon c="black" h={17} w={17}>
          <IconChevronLeft />
        </ThemeIcon>
      </ActionIcon>
    </Link>
  )
}
