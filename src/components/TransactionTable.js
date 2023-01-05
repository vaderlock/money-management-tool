import { Group, Table } from "@mantine/core";
import React from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { showNotification } from "@mantine/notifications";
import { deleteDoc, doc } from "firebase/firestore";
import { fireDb } from "../firebaseConfig";

function TransactionTable({
  transactions,
  setSelectedTransaction,
  setFormMode,
  setShowForm,
  getData,
}) {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const deleteTransaction = async (id) => {
    try {
      dispatch(ShowLoading());
      await deleteDoc(doc(fireDb, `users/${user.id}/transactions`, id));
      dispatch(HideLoading());
      showNotification({
        title: "Transaction has been deleted!",
        color: "green",
      });
      getData();
    } catch (error) {
      dispatch(HideLoading());
      showNotification({
        title: "Error removing the transaction!",
        color: "red",
      });
    }
  };

  const getRows = transactions.map((transaction) => (
    <tr key={transaction.name}>
      <td>{transaction.name}</td>
      <td>{transaction.type}</td>
      <td>{transaction.amount}</td>
      <td>{moment(transaction.date).format("MM-DD-YYYY")}</td>
      <td>{transaction.category}</td>
      <td>{transaction.reference}</td>
      <td>
        <Group>
          <i
            className="ri-settings-3-line"
            onClick={() => {
              setSelectedTransaction(transaction);
              setFormMode("edit");
              setShowForm(true);
            }}
          ></i>
          <i
            className="ri-close-circle-line"
            onClick={() => {
              deleteTransaction(transaction.id);
            }}
          ></i>
        </Group>
      </td>
    </tr>
  ));

  return (
    <Table verticalSpacing="md" fontSize="lg" striped>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Category</th>
          <th>Comments</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{getRows}</tbody>
    </Table>
  );
}

export default TransactionTable;
