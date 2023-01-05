import React, { useEffect } from "react";
import { useForm } from "@mantine/form";
import { Select, Stack, TextInput, Button, Group } from "@mantine/core";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { fireDb } from "../firebaseConfig";
import { showNotification } from "@mantine/notifications";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import moment from "moment";

function TransactionForm({
  formMode,
  setFormMode,
  setShowForm,
  transactionData,
  getData,
}) {
  const dispatch = useDispatch();
  // Retrieve the user object from local storage
  const user = JSON.parse(localStorage.getItem("user"));

  // Initialize the transaction form with default values
  const transactionForm = useForm({
    initialValues: {
      name: "",
      type: "",
      amount: "",
      date: "",
      category: "",
      reference: "",
    },
  });

  // Called when the form is submitted
  const onSubmit = async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    try {
      // Show the loading indicator
      dispatch(ShowLoading());

      //Check if the form is in "add" mode or "edit" mode
      if (formMode === "add") {
        //If in "add" mode, add a new transaction to the database
        await addDoc(
          collection(fireDb, `users/${user.id}/transactions`),
          transactionForm.values
        );
      } else {
        // If in "edit" mode, add a new transaction to the database
        await setDoc(
          doc(fireDb, `users/${user.id}/transactions`, transactionData.id),
          transactionForm.values
        );
      }

      // The transactions was successfull and it will notify the user
      showNotification({
        title: formMode === "add" ? "Transaction added" : "Transaction updated",
        color: "green",
      });
      dispatch(HideLoading());
      getData();
      setShowForm(false);
    } catch (error) {
      // There was an error either adding or updating the transaction
      showNotification({
        title:
          formMode === "add"
            ? "Error adding transaction"
            : "Error updating transaction",
        color: "red",
      });
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    if (formMode === "edit") {
      transactionForm.setValues(transactionData);
      transactionForm.setFieldValue(
        "date",
        moment(transactionData.date, "YYYY-MM-DD").format("YYYY-MM-DD")
      );
    }
  }, [transactionData]);

  return (
    // The follow will display text inputs for the user to add for their new transaction
    <div>
      <form action="" onSubmit={onSubmit}>
        <Stack>
          {/* The transaction name */}
          <TextInput
            name="name"
            label="Name"
            placeholder="Transaction Name"
            {...transactionForm.getInputProps("name")}
          />
          {/* Income or expense */}
          <Select
            name="type"
            label="Type"
            placeholder="Transaction Type"
            data={[
              { label: "Income", value: "income" },
              { label: "Expense", value: "expense" },
            ]}
            {...transactionForm.getInputProps("type")}
          />

          {/* Which category does the transaction fall on */}
          <Select
            name="category"
            label="Category"
            placeholder="Transaction Category"
            data={[
              { label: "Allowance", value: "allowance" },
              { label: "Income", value: "income" },
              { label: "Food", value: "food" },
              { label: "Transportation", value: "transportation" },
              { label: "Shopping", value: "shopping" },
              { label: "Entertainment", value: "entertainment" },
            ]}
            {...transactionForm.getInputProps("category")}
          />
          {/* The transaction amount */}
          <TextInput
            name="amount"
            label="Amount"
            placeholder="Transaction Amount"
            {...transactionForm.getInputProps("amount")}
          />

          {/* The date of the transaction */}
          <TextInput
            name="date"
            label="Date"
            type="date"
            placeholder="Transaction Date"
            {...transactionForm.getInputProps("date")}
          />

          {/* The comment for the transaction */}
          <TextInput
            name="comments"
            label="Comments"
            placeholder="Transaction Comments"
            {...transactionForm.getInputProps("reference")}
          />

          <Button color="orange" type="submit">
            {formMode === "add" ? "Add Transaction" : "Update Transaction"}
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default TransactionForm;
