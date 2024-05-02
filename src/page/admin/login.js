import React from "react";
import {
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { post } from "../../services/api";
import classes from "./style.module.css";
import { useDispatch } from "react-redux";
import { setLoader } from "../../redux/loaderSlice";
import { setUser } from "../../redux/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values) => {
    dispatch(setLoader(true));
    post("/login", values)
      .then(({ data }) => {
        if (data?.user?.teacher) {
          dispatch(setUser({ ...data?.user, token: data?.token }));
          navigate("/", { replace: true });
        } else {
          toast.error("You are not allowed to access this page");
        }
      })
      .catch((err) => {
        toast.error(JSON.stringify(err?.response?.data?.error));
      })
      .finally(() => {
        dispatch(setLoader(false));
      });
  };

  return (
    <Container my={"auto"} mx={"auto"}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Title ta="center" className={classes.title}>
          Sign in
        </Title>

        <Paper withBorder shadow="md" w={400} p={30} mt={30} radius="md">
          <TextInput
            label={
              <Text
                style={{
                  display: "inline-block",
                }}
                pb={"lg"}
              >
                E-mail
              </Text>
            }
            placeholder="Enter your email"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label={
              <Text
                style={{
                  display: "inline-block",
                }}
                pb={"lg"}
              >
                Password
              </Text>
            }
            placeholder="Enter your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </Paper>
      </form>
    </Container>
  );
};

export default Login;
