import React from "react";
import "date-fns";
// import { makeStyles } from "@material-ui/core/styles";
// import Input from "@material-ui/core/Input";
// import InputLabel from "@material-ui/core/InputLabel";
// import InputAdornment from "@material-ui/core/InputAdornment";
// import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import AccountCircle from "@material-ui/icons/AccountCircle";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import PhoneIcon from "@material-ui/icons/Phone";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

class PersonalInfoForm extends React.Component {
  render() {
    const { name, gender, birthdate, phoneNum } = this.props.values;
    return (
      <React.Fragment>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div className="container-fluid d-flex flex-column align-items-center mt-4">
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <AccountCircle color="primary" />
              </Grid>
              <Grid item style={{ width: "400px" }}>
                <TextField
                  id="name"
                  label="Name"
                  name="name"
                  fullWidth
                  onChange={this.props.handleChange}
                  defaultValue={name}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={1}
              direction="row"
              alignItems="center"
              className="mt-4"
              style={{ width: "390px" }}
            >
              <RadioGroup
                aria-label="gender"
                name="gender"
                value={gender}
                onChange={this.props.handleChange}
                className="d-flex flex-row justify-content-between w-100 ml-4"
              >
                <FormControlLabel
                  value="male"
                  control={<Radio color="primary" />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio color="primary" />}
                  label="Female"
                />
              </RadioGroup>
            </Grid>
            <Grid
              container
              spacing={1}
              direction="column"
              style={{ width: "420px" }}
            >
              <Grid item>
                <KeyboardDatePicker
                  className="mt-4 ml-2"
                  format="MM/dd/yyyy"
                  margin="normal"
                  fullWidth={true}
                  id="date-picker-dialog"
                  label="Birthdate"
                  name="birthdate"
                  value={birthdate}
                  onChange={this.props.handleChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date"
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} alignItems="flex-end" className="mt-3">
              <Grid item>
                <PhoneIcon color="primary" />
              </Grid>
              <Grid item style={{ width: "400px" }}>
                <TextField
                  id="phoneNum"
                  label="Phone Number"
                  name="phoneNum"
                  value={phoneNum}
                  onChange={this.props.handleChange}
                  type="tel"
                  fullWidth
                />
              </Grid>
            </Grid>
            <button
              className="btn signup-btn d-block mt-4 mx-auto"
              onClick={() => this.props.nextStep()}
            >
              Sign up
            </button>
          </div>
        </MuiPickersUtilsProvider>
      </React.Fragment>
    );
  }
}

export default PersonalInfoForm;
