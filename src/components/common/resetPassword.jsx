import React from "react";
import Background from "../common/background";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import EmailIcon from "@material-ui/icons/Email";
import InputAdornment from "@material-ui/core/InputAdornment";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import Collapse from "@material-ui/core/Collapse";

import http from "../../services/httpService";
import { apiPasswordReset } from "../../config.json";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      isEmailSent: false,
    };
  }

  handleSubmit = async () => {
    // Call the back end and re-direct towards the login(to log in w/ the new password)
    const { email } = this.state;
    const { data } = await http.post(apiPasswordReset, { email });
    console.log(data);
    this.setState({ isEmailSent: true });
  };

  // Handle fields change
  handleChange = (event) => {
    event.persist();
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, isEmailSent } = this.state;

    // Customize the colors of the form
    const theme = createMuiTheme({
      palette: {
        primary: {
          main: "#12a2f9",
        },
      },
    });

    return (
      <React.Fragment>
        <Background />
        <ThemeProvider theme={theme}>
          <div className="box">
            <ArrowBackIcon
              color="primary"
              style={{
                cursor: "pointer",
                fontSize: "35px",
                marginTop: "10px",
              }}
              onClick={this.props.history.goBack}
            />
            <div
              className="container-fluid d-flex flex-column justify-content-center align-items-center"
              style={{ height: "85%" }}
            >
              <Collapse in={isEmailSent}>
                <div
                  className={`${
                    isEmailSent ? "alert alert-primary" : "d-none"
                  }`}
                  role="alert"
                  style={{ fontSize: ".9rem" }}
                >
                  <div className="row">
                    <InfoOutlinedIcon
                      className="col align-self-center"
                      style={{ fontSize: "50px" }}
                    />
                    <p className="col-10">
                      A link has been sent to your Email account with
                      instructions to reset your password, please check your
                      inbox, or spam folder
                    </p>
                  </div>
                </div>
              </Collapse>
              <ValidatorForm
                instantValidate
                onSubmit={this.handleSubmit}
                className="w-100"
              >
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item className="w-100">
                    <TextValidator
                      id="email"
                      label="Email"
                      name="email"
                      fullWidth
                      onChange={this.handleChange}
                      value={email}
                      type="email"
                      validators={["required", "isEmail"]}
                      errorMessages={[
                        "This field is required",
                        "Please enter a valid email",
                      ]}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
                <button
                  className="btn custom-submit-btn d-block mt-5 mx-auto"
                  type="submit"
                >
                  Reset Password
                </button>
              </ValidatorForm>
            </div>
          </div>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default ResetPassword;
