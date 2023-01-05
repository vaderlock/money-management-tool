import React from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  Card,
  Divider,
  Stack,
  TextInput,
  Title,
  Anchor,
  Select,
} from "@mantine/core";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { fireDb } from "../firebaseConfig";
import cryptojs from "crypto-js";
import { showNotification } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function Register() {
  const dispatch = useDispatch();
  const registerForm = useForm({
    initialValues: {
      fname: "",
      lname: "",
      role: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      // check if user already exists based on the email entered
      dispatch(ShowLoading());
      const qry = query(
        collection(fireDb, "users"),
        where("email", "==", registerForm.values.email)
      );
      const existingUsers = await getDocs(qry);

      if (existingUsers.size > 0) {
        console.log(existingUsers);
        showNotification({
          title: "This user already exists",
          color: "red",
        });
        return;
      } else {
        // encrypt password using cryptojs npm
        const encryptedPassword = cryptojs.AES.encrypt(
          registerForm.values.password,
          "money-management-tool"
        ).toString();
        const response = await addDoc(collection(fireDb, "users"), {
          ...registerForm.values,
          password: encryptedPassword,
        });
        if (response.id) {
          showNotification({
            title: "User is now registered",
            color: "green",
          });
        } else {
          showNotification({
            title: "Oops, something went wrong!",
            color: "red",
          });
        }
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      showNotification({
        title: "Oops, something went wrong!",
        color: "red",
      });
    }
  };
  return (
    <div className="flex h-screen justify-center items-center auth">
      {/* The Card component has styles applied to it for its width, padding, and shadow. */}
      <Card
        sx={{
          width: 400,
          padding: "md",
        }}
        shadow="lg"
        withBorder
      >
        {/* The Title component is being used to display the signup box's title, 
        and its order and margin bottom styles are being customized. */}
        <Title order={1} mb={5}>
          Sign Up
        </Title>
        {/* A Divider is used to visually separate the title from the form fields. */}
        <Divider variant="solid" color="dark" />
        {/* The form is using the onSubmit event handler provided by the registerForm object. */}
        <form action="" onSubmit={onSubmit}>
          {/* The Stack component is used to arrange the form fields vertically, with a top margin applied. */}
          <Stack mt={40}>
            {/* The TextInput and Select components are being used to create the form fields, and their labels, placeholders, 
          and names are being set. The registerForm object is being used to manage the form state and get the input props 
          for each field. */}
            <TextInput
              label="First Name"
              placeholder="Enter your first name"
              name="fname"
              {...registerForm.getInputProps("fname")}
            />
            <TextInput
              label="Last Name"
              placeholder="Enter your last name"
              name="lname"
              {...registerForm.getInputProps("lname")}
            />
            <Select
              label="Choose your role"
              placeholder="Pick one"
              name="role"
              data={[
                { value: "parent", label: "Parent" },
                { value: "child", label: "Child" },
              ]}
              {...registerForm.getInputProps("role")}
            />
            <TextInput
              label="Email"
              placeholder="Enter email"
              name="email"
              {...registerForm.getInputProps("email")}
            />
            <TextInput
              label="Password"
              placeholder="Enter password"
              name="password"
              type="password"
              {...registerForm.getInputProps("password")}
            />
            {/* The Button component is used to submit the form, and it has a custom gradient applied to its styles. */}
            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: "orange", to: "red" }}
            >
              Sign up
            </Button>
            {/* The Anchor component is used to provide a link to the login page for users who already have an account. */}
            <Anchor href="/login" color="orange">
              Have an account? Login here
            </Anchor>
          </Stack>
        </form>
      </Card>
    </div>
  );
}

export default Register;
