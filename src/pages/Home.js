import React, { useEffect } from "react";
import Header from "../components/Header";
import { Box, Card, Button, Modal, Group, Divider } from "@mantine/core";
import TransactionForm from "../components/TransactionForm";
import { useDispatch } from "react-redux";
import { fireDb } from "../firebaseConfig";
import { showNotification } from "@mantine/notifications";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { MantineProvider } from "@mantine/core";
import TransactionTable from "../components/TransactionTable";
import Filters from "../components/Filters";
import moment from "moment";
import Analytics from "../components/Analytics";

function Home() {
  const [view, setView] = React.useState("table");
  const [filters, setFilters] = React.useState({
    type: "",
    frequency: "7",
    dateRange: [],
  });
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const [transactions, setTransactions] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [formMode, setFormMode] = React.useState("add");
  const [selectedTransaction, setSelectedTransaction] = React.useState({});

  const getWhereConditions = () => {
    const tempConditions = [];

    // type condition
    if (filters.type !== "") {
      tempConditions.push(where("type", "==", filters.type));
    }

    // frequency condition
    if (filters.frequency !== "custom-range") {
      if (filters.frequency === "7") {
        tempConditions.push(
          where("date", ">=", moment().subtract(7, "days").format("YYYY-MM-DD"))
        );
      } else if (filters.frequency === "30") {
        tempConditions.push(
          where(
            "date",
            ">=",
            moment().subtract(30, "days").format("YYYY-MM-DD")
          )
        );
      } else if (filters.frequency === "365") {
        tempConditions.push(
          where(
            "date",
            ">=",
            moment().subtract(365, "days").format("YYYY-MM-DD")
          )
        );
      }
    } else {
      const fromDate = moment(filters.dateRange[0]).format("YYYY-MM-DD");
      const toDate = moment(filters.dateRange[1]).format("YYYY-MM-DD");
      tempConditions.push(where("date", ">=", fromDate));
      tempConditions.push(where("date", "<=", toDate));
    }
    return tempConditions;
  };

  const getData = async () => {
    try {
      const whereConditions = getWhereConditions();
      dispatch(ShowLoading());
      const qry = query(
        collection(fireDb, `users/${user.id}/transactions`),
        orderBy("date", "desc"),
        ...whereConditions
      );

      const response = await getDocs(qry);
      const data = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(data);

      dispatch(HideLoading());
    } catch (error) {
      console.log(error);
      showNotification({
        title: "Error fetching transactions",
        color: "red",
      });
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, [filters]);

  return (
    <Box>
      <Header />

      <div className="container">
        <MantineProvider
          theme={{ colorScheme: "dark" }}
          withGlobalStyles
          withNormalizeCSS
        >
          <Card
            sx={{
              height: "87vh",
            }}
            shadow="md"
            withBorder
            mt={20}
          >
            <div className="flex justify-between items-end">
              <Group>
                <Button.Group>
                  <Button
                    color="orange"
                    variant={view === "table" ? "filled" : "outline"}
                    onClick={() => setView("table")}
                  >
                    <i class="ri-layout-grid-line"></i>
                  </Button>
                  <Button
                    color="orange"
                    variant={view === "analytics" ? "filled" : "outline"}
                    onClick={() => setView("analytics")}
                  >
                    <i class="ri-pie-chart-2-line"></i>
                  </Button>
                </Button.Group>
                <Button
                  variant="gradient"
                  gradient={{ from: "orange", to: "red" }}
                  onClick={() => {
                    setShowForm(true);
                    setFormMode("add");
                  }}
                >
                  <pre>Add Transaction </pre>
                  <i class="ri-add-fill"></i>
                </Button>
              </Group>

              <div>
                <Filters
                  filters={filters}
                  setFilters={setFilters}
                  getData={getData}
                />
              </div>
            </div>

            <Divider mt={20} />
            {view === "table" && (
              <TransactionTable
                transactions={transactions}
                setSelectedTransaction={setSelectedTransaction}
                setFormMode={setFormMode}
                setShowForm={setShowForm}
                getData={getData}
              />
            )}
            {view === "analytics" && <Analytics transactions={transactions} />}
          </Card>
        </MantineProvider>
      </div>

      <Modal
        size="lg"
        title={formMode === "add" ? "Add Transaction" : "Edit Transaction"}
        opened={showForm}
        onClose={() => setShowForm(false)}
        centered
      >
        <TransactionForm
          formMode={formMode}
          setFormMode={setFormMode}
          setShowForm={setShowForm}
          showForm={showForm}
          transactionData={selectedTransaction}
          getData={getData}
        />
      </Modal>
    </Box>
  );
}

export default Home;
