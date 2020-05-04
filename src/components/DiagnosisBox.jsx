import React from "react";
import Swal from "sweetalert2";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import CheckCircleOutlinedIcon from "@material-ui/icons/CheckCircleOutlined";
import MessageBox from "./common/MessageBox";
import ImgUpload from "../images/img-upload.png";
import MaterialSpinner from "./common/MaterialSpinner";
import http from "../services/HttpService";
import {
  apiImgPred,
  apiStartBot,
  apiSearchBot,
  apiAppSelSymptom,
  apiGetSymptom,
  apiConfirmSubmitAns,
} from "../config.json";
import * as utils from "../utils.js";
import { getCurrentUser } from "../services/AuthService";

class DiagnosisBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchInput: "",
      usrMsg: `Hi ${utils.capitalizeFirstLetter(
        getCurrentUser().first_name
      )}, I'm Tabib bot, What do you wanna do?`,
      isSearchBoxShown: false,
      sympList: [],
      isFetching: false,
      selectedSymptoms: [],
      offerChoice: false,
      result: undefined,
    };
  }

  // TODO: Remember also to check the packages installed and remove the ones un-necessary especially to (sweetalert thingie) and any un-needed ones in general, also separate the devDependencies from the required ones

  // The asynchronous part is to wait for the user until it uploads an image -- replace the ugly input field with a button(custom one, figure out how to make one -- later of course) + Resolve the padding thing that happen to the logo when the damn loading popup appear/show-up + See what the damn /upload/android doesn't wanna accept the base64 string(returns a 415 unsupported media error) =>> (with content-type already set to => applicatio/json; charset=UTF-8)
  handleSkinClick = async () => {
    const { value: file } = await Swal.fire({
      title: "Select image",
      input: "file",
      width: 800,
      scrollbarPadding: false,
      imageUrl: ImgUpload,
      imageWidth: 250,
      imageHeight: 250,
      position: "center",
      imageAlt: "Upload Image",
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload your image",
      },
    });

    // This part is pretty much useless, but for now, it's okay for it to stay here :)
    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (e) => {
        Swal.fire({
          title: "Confirm Upload?",
          scrollbarPadding: false,
          imageUrl: e.target.result,
          imageAlt: "The uploaded picture",
          onAfterClose: () => {
            Swal.showLoading();
          },
        }).then((result) => {
          if (result) {
            reader.readAsDataURL(file);
            reader.onload = async () => {
              const formData = new FormData();
              formData.append("file", file);
              // Do here the AJAX call to the back-end for image diagnosis
              const headers = {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                "Content-Type": "multipart/form-data",
              };

              const {
                data: { ans },
              } = await http.post(apiImgPred, formData, { headers });

              let predResult = ans.split("is")[1];

              Swal.fire({
                scrollbarPadding: false,
                icon: "info",
                title: "Your results!",
                text: `It is probably ${predResult} skin disease`,
              });
            };
          }
        });
      };
    }
  };

  handleBotClick = () => {
    this.setState({
      usrMsg: "What are you complaining about?",
      isSearchBoxShown: true,
    });
  };

  handleChange = async ({ target }) => {
    // Keep the UI state in sync
    const { value } = target;
    this.setState({ usrMsg: "", searchInput: value, isFetching: true });

    if (!value.length) {
      this.setState({ isFetching: false });
      return;
    }

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access-token")}`,
    };

    try {
      await http.get(apiStartBot, { headers });
      const { data } = await http.get(`${apiSearchBot}${value}`, {
        headers,
      });

      const { result } = data;
      // In case there is no matching
      if (!result) {
        this.setState({ sympList: [], isFetching: false });
        return;
      }

      // Sorting, removing the separators, and picking only the first 15 symptom
      const symptomsList = utils
        .sortStrArr(result)
        .map((symptom) => symptom.split("_").join(" "))
        .slice(0, 15);

      this.setState({ sympList: symptomsList, isFetching: false });
    } catch (ex) {
      utils.reportUserErrors(ex);
    }
  };

  // Spinners + The part about the damn start http request every time starting again(what solution you could do here??) + the spaces thingie in the search bar

  handleSymptomClick = ({ target }) => {
    const symptomValue = target.textContent;
    const selectedSymp = [...this.state.selectedSymptoms];
    selectedSymp.push(symptomValue);
    this.setState({
      searchInput: "",
      usrMsg: "Do you want to add another symptom?",
      isSearchBoxShown: false,
      sympList: [],
      selectedSymptoms: selectedSymp,
      offerChoice: true,
    });
  };

  handleChoice = async ({ target }) => {
    const { selectedSymptoms, result } = this.state;
    const choice = target.textContent.toLowerCase();
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access-token")}`,
    };

    if (choice === "yes") {
      if (selectedSymptoms.length) {
        this.setState({
          usrMsg: "What are you complaining about?",
          isSearchBoxShown: true,
          offerChoice: false,
        });

        return;
      }

      try {
        await http.post(apiConfirmSubmitAns, { ans: "y" }, { headers });

        const { data } = await http.get(apiGetSymptom, { headers });
        if (data.result) {
          const symptom = data["result"].split("_").join(" ");
          this.setState({
            usrMsg: `Do you have the following symptom: ${symptom}?`,
            isFetching: false,
            offerChoice: true,
          });
          return;
        } else {
          // <CheckCircleOutlinedIcon className={`${}`} />
          const predictionResult = data["predict"].includes("could not")
            ? `Oops! we couldn't find a disease based on your input, could you try again?`
            : `You are likely to have the following disease: ${data["predict"]}`;
          this.setState({
            usrMsg: predictionResult,
            isFetching: false,
            offerChoice: false,
          });
          return;
        }
      } catch (ex) {
        utils.reportUserErrors(ex);
      }
    }

    if (choice === "no") {
      if (!selectedSymptoms.length) {
        try {
          await http.post(apiConfirmSubmitAns, { ans: "n" }, { headers });
        } catch (ex) {
          utils.reportUserErrors(ex);
        }
      }

      this.setState({ isFetching: true, offerChoice: false });

      try {
        // No need to start the session again - ASK AZ
        // await http.get(apiStartBot, { headers });
        // Send the list of symptoms one-by-one(Network costly operation ahead!)
        for (let i = 0; i < selectedSymptoms.length; i++) {
          let symptom = selectedSymptoms[i].split(" ").join("_");
          await http.post(
            apiAppSelSymptom,
            { ans: symptom },
            {
              headers,
            }
          );
        }

        const { data } = await http.get(apiGetSymptom, { headers });
        if (data.result) {
          const symptom = data["result"].split("_").join(" ");
          this.setState({
            usrMsg: `Do you have the following symptom: ${symptom}?`,
            isFetching: false,
            selectedSymptoms: [],
            offerChoice: true,
          });
          return;
        } else {
          const predictionResult = data["predict"].includes("could not")
            ? `Oops! we couldn't find a disease based on your input, could you try again?`
            : `You are likely to have the following disease: ${data["predict"]}`;
          this.setState({
            usrMsg: predictionResult,
            isSearchBoxShown: false,
            isFetching: false,
            selectedSymptoms: [],
            offerChoice: false,
          });
          return;
        }
      } catch (ex) {
        utils.reportUserErrors(ex);
      }

      this.setState({
        isFetching: false,
        offerChoice: false,
      });
    }
  };

  render() {
    const {
      searchInput,
      usrMsg,
      isSearchBoxShown,
      sympList,
      isFetching,
      offerChoice,
    } = this.state;

    return (
      <React.Fragment>
        <div className="diagnosis-box">
          <div
            className={`text-right mt-4 mx-4 ${
              isFetching ? "d-block" : "d-none"
            }`}
          >
            <MaterialSpinner thickness={3} />
          </div>
          <MessageBox message={usrMsg} />
          <div className="conatiner mt-4 mx-2">
            {!isFetching &&
              sympList.map((symptom, index) => (
                <button
                  key={index}
                  className="btn btn-outline-primary pill-border d-inline-block mx-1 mb-2"
                  onClick={this.handleSymptomClick}
                >
                  {symptom}
                </button>
              ))}
            {!sympList.length && !usrMsg && !isFetching && (
              <h1 className="text-primary">Not Matching Symptom</h1>
            )}
          </div>
          {!isSearchBoxShown && !offerChoice && (
            <div className="btn-action">
              <button
                className="btn btn-outline-primary pill-border d-block mb-3"
                onClick={this.handleBotClick}
              >
                Speak to Tabib Bot
              </button>
              <button
                className="btn btn-outline-primary pill-border d-block"
                onClick={this.handleSkinClick}
              >
                Skin Detection
              </button>
            </div>
          )}
          {offerChoice && (
            <div className="btn-action">
              <button
                className="btn btn-outline-primary pill-border d-block mb-3"
                onClick={this.handleChoice}
              >
                Yes
              </button>
              <button
                className="btn btn-outline-primary pill-border d-block"
                onClick={this.handleChoice}
              >
                No
              </button>
            </div>
          )}
          {isSearchBoxShown && (
            <div className="conatiner-fluid search-container">
              <TextField
                id="searchbot-input"
                label="Search Symptoms"
                fullWidth
                autoFocus
                value={searchInput}
                onChange={this.handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default DiagnosisBox;