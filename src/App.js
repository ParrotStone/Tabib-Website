import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import HomePg from "./components/home-landing-page/index";
import NotFound from "./components/common/Notfound";
import UsrAuth from "./components/user-auth/index";
import Logout from "./components/common/Logout";
import ResetPassword from "./components/common/ResetPassword";
import Map from "./components/density-map/index";
import { getCurrentUser } from "./services/AuthService.js";

import PrivacyPolicy from "./components/common/PrivacyPolicy";
import Terms from "./components/common/Terms";

// Mount ToastContainer if none is mounted
toast.configure({
  style: { fontSize: "1.1rem" },
});

// Customize the colors of the form to the main colors of the app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#12a2f9",
      contrastText: "#ffffff",
    },
  },
});

// Initialize the app once the app is loaded into memory -> only once and so it doesn't consider/aware any updates to the state/UI/storage in case of an update or removal -> called only once!! which is bad
// Only call if the user is signed in, otherwise, you'd get an error because there is no alarms set(deleted by default) and there no user data saved whatsoever in the local storage
if (getCurrentUser()) {
  // initAlarmNotification();
}

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route path="/" exact component={HomePg} />
        <Redirect from="/home" to="/" />
        <Route path="/get-started" exact component={UsrAuth} />
        <Route path="/logout" exact component={Logout} />
        <Route path="/reset-password" exact component={ResetPassword} />
        <Route path="/coronamap" exact component={Map} />
        <Route path="/privacy-policy" exact component={PrivacyPolicy} />
        <Route path="/terms-of-use" exact component={Terms} />
        <Route path="/not-found" exact component={NotFound} />
        <Redirect to="/not-found" />
      </Switch>
    </ThemeProvider>
  );
};

export default App;
