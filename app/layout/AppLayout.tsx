import { AppShell } from "@mantine/core"
import { Outlet } from "@remix-run/react"
import { Navbar } from "./Navbar/Navbar"
import { Logo } from "../components/Logo/Logo"

import classes from "./Navbar/Navbar.module.css"
import { Header } from "./Header/Header"

export const AppLayout = () => {
  return (
    <AppShell
      header={{ height: 75 }}
      navbar={{ width: 265, breakpoint: "sm" }}
      layout="alt"
    >
      <AppShell.Navbar withBorder={false} className={classes.appLayout__navbar}>
        <Logo height={28} />
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
