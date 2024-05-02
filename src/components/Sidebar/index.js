import React from "react";
import { Button, Flex, Menu, Text } from "@mantine/core";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import classes from "./style.module.css";
import { setUser } from "../../redux/userSlice";
import { Dashboard, Room, LogOut } from "../icon";

const tabs = [
  { link: "/", label: "Users", icon: Dashboard },
  { link: "/lessons", label: "Lessons", icon: Room },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const links = tabs.map((item) => (
    <NavLink
      className={classes.link}
      to={item.link}
      key={item.label}
      children={
        <>
          <item.icon />
          <span>{item.label}</span>
        </>
      }
    />
  ));

  const handleLogout = () => {
    dispatch(setUser({}));
    navigate("/login", { replace: true });
    localStorage.clear();
  };

  return (
    <nav className={classes.navbar}>
      <NavLink to={"/"}>
        <Text fw={500} size="sm" className={classes.title} c="dimmed" mb="xs">
          Admin panel
        </Text>
      </NavLink>
      <div className={classes.navbarMain}>
        {links}
        <Menu position="bottom" width={"150px"}>
          <Menu.Target>
            <Button w={"100%"} py={"5px"} h={"auto"} mt={80} bg={"red"}>
              <Text pr={"sm"}>Log out</Text> <LogOut fill="#fff" />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Are you sure you want to log out?</Menu.Label>
            <Menu.Divider />
            <Flex>
              <Menu.Item c={"red"} onClick={handleLogout}>
                Yes
              </Menu.Item>
              <Menu.Item>No</Menu.Item>
            </Flex>
          </Menu.Dropdown>
        </Menu>
      </div>
    </nav>
  );
}
