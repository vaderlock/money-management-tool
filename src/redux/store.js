import { configureStore } from "@reduxjs/toolkit";
import alertsReducer from "./alertsSlice";

// configureStore and passing an object with a reducer property,
// whose value is an object that contains the alerts reducer.
const store = configureStore({
  reducer: {
    alerts: alertsReducer,
  },
});

// store is exported for use in other parts of the application.
export default store;
