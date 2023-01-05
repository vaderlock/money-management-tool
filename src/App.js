import { Loader } from "@mantine/core";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Spinner from "./components/Spinner";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
function App() {
  // Use the useSelector hook to get the loading value from the Redux store
  const { loading } = useSelector((state) => state.alerts);
  return (
    //  The App component is the root component of the app
    <div className="App">
      {loading && (
        <div className="loader-parent">
          <Spinner />
        </div>
      )}
      {/* Use the `BrowserRouter` component to wrap the routes for the app */}
      <BrowserRouter>
        {/* Use the `Routes` component to define the different routes for the app */}
        <Routes>
          {/* Use the `Route` component to define the `/` route. This route should render the `Home` component. */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
