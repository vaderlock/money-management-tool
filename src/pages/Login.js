import React from "react";
import { useForm } from "@mantine/form";
import {
  Anchor,
  Button,
  Card,
  Divider,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { collection, getDocs, query, where } from "firebase/firestore";
import { fireDb } from "../firebaseConfig";
import cryptojs from "crypto-js";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function Login() {
  const dispatch = useDispatch(); // Use useDispatch and useNavigate hooks from react-router
  const navigate = useNavigate();
  const loginForm = useForm({
    // Use useForm hook to manage login form state
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(ShowLoading());
      const qry = query(
        // Query fireDb for users with specified email
        collection(fireDb, "users"),
        where("email", "==", loginForm.values.email)
      );
      const existingUsers = await getDocs(qry);
      if (existingUsers.size > 0) {
        // decrypt password
        const decryptedPassword = cryptojs.AES.decrypt(
          existingUsers.docs[0].data().password,
          "money-management-tool"
        ).toString(cryptojs.enc.Utf8);
        if (decryptedPassword === loginForm.values.password) {
          showNotification({
            title: "Login successful",
            color: "green",
          });
          const dataToPutInLocalStorage = {
            name: existingUsers.docs[0].data().name,
            email: existingUsers.docs[0].data().email,
            id: existingUsers.docs[0].id,
          };
          localStorage.setItem("user", JSON.stringify(dataToPutInLocalStorage));
          navigate("/");
        } else {
          showNotification({
            title: "Invalid Password. Try Again",
            color: "red",
          });
        }
      } else {
        showNotification({
          title: "Oops, User not found!",
          color: "red",
        });
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      showNotification({
        title: "Oops, Something went wrong!",
        color: "red",
      });
    }
  };

  return (
    <div className="flex h-screen justify-center items-center auth">
      <Card
        sx={{
          width: 400,
          padding: "md",
        }}
        shadow="lg"
        withBorder
      >
        <Title order={1} mb={5}>
          LOGIN
        </Title>
        <Divider variant="solid" color="dark" />
        <form action="" onSubmit={onSubmit}>
          <Stack mt={40}>
            <TextInput
              label="Email"
              placeholder="Enter email"
              name="email"
              {...loginForm.getInputProps("email")}
            />
            <TextInput
              label="Password"
              placeholder="Enter password"
              type="password"
              name="password"
              {...loginForm.getInputProps("password")}
            />
            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: "orange", to: "red" }}
            >
              Login
            </Button>
            <Anchor href="/register" color="orange">
              Don't have an account? Sign up here
            </Anchor>
          </Stack>
        </form>
      </Card>
    </div>
  );
}

export default Login;
