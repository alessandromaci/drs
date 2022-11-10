import React from "react";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Accessibility from "@material-ui/icons/Accessibility";
import { Button } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";

import { getProfile } from "../../variables/wallet";

//
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    "& > * + *": {
      marginTop: theme.spacing(1),
    },
  },
}));

//abi
import RateENS from "../../hardhat/deployments/goerli/RateENS.json";
import DRS from "../../hardhat/deployments/goerli/DRS.json";

function Dashboard() {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const ensAddress = "0xfe5deb7db9f5158f5ad3a2eb7354c10e3b45b0f4";
  const drsAddress = "0x7383B894719d73b139d22603C2aFfFCa34a53a76";
  const [value, setValue] = React.useState(2);
  const [rating, setRating] = React.useState(null);
  const [inputAddress, setInputAddress] = React.useState("");
  const [searchAddress, setSearchAddress] = React.useState("");
  const [showResult, setShowResult] = React.useState(false);

  const registerDomain = async () => {
    let account = getProfile();
    const rateEnsInstance = new web3.eth.Contract(RateENS.abi, ensAddress);

    try {
      const registerDomainTransactionParams = {
        from: account,
        to: ensAddress,
        data: rateEnsInstance.methods.registerNew(account).encodeABI(),
      };
      await web3.eth.sendTransaction(registerDomainTransactionParams);
      toast.success("Request sent!");
    } catch (err) {
      console.log("err: ", err);
      toast.error("Failed to register a domain");
    }
  };

  const rateENS = async () => {
    let account = getProfile();
    const rateEnsInstance = new web3.eth.Contract(RateENS.abi, ensAddress);

    try {
      const rateTransactionParams = {
        from: account,
        to: ensAddress,
        data: rateEnsInstance.methods
          .rate(String(inputAddress), value)
          .encodeABI(),
      };

      await web3.eth.sendTransaction(rateTransactionParams);
      toast.success("Request sent!");
    } catch (err) {
      console.log("err: ", err);
      toast.error("Failed to rate an ENS address");
    }
  };

  const getENSRating = async () => {
    const drsInstance = new web3.eth.Contract(DRS.abi, drsAddress);
    try {
      const rating = await drsInstance.methods.ensRating(searchAddress).call();
      if (rating) {
        setRating(rating);
        setShowResult(true);
      }
      console.log(rating.score);
    } catch (e) {
      console.error(e);
      toast.error("Failed to retrieve rating!");
    }
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Domains</p>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Button onClick={registerDomain} variant="outlined">
                  Register Here
                </Button>
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>ENS Address</p>
              <TextField
                id="standard-basic"
                variant="standard"
                value={inputAddress}
                onChange={(event) => {
                  setInputAddress(event.target.value);
                }}
              />
              <div className={classes.root}>
                <Rating
                  name="half-rating"
                  defaultValue={2}
                  precision={0.5}
                  value={value}
                  onChange={(event) => {
                    let updatedValue = event.target.value * 20;
                    setValue(updatedValue);
                  }}
                />
              </div>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Button onClick={rateENS} variant="outlined">
                  Rate
                </Button>
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>ENS Address</p>
              <TextField
                id="standard-basic"
                variant="standard"
                value={searchAddress}
                onChange={(event) => {
                  setSearchAddress(event.target.value);
                }}
              />
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Button onClick={getENSRating} variant="outlined">
                  Search
                </Button>
              </div>
              {showResult ? (
                <div>{`You have ${rating.count} record/s and your score is ${rating.score}/100`}</div>
              ) : (
                <div></div>
              )}
            </CardFooter>
          </Card>
        </GridItem>
        <ToastContainer />
      </GridContainer>
    </div>
  );
}

Dashboard.layout = Admin;

export default Dashboard;
