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
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

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

function Dashboard() {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const ensAddress = "0xfe5deb7db9f5158f5ad3a2eb7354c10e3b45b0f4";
  const [value, setValue] = React.useState(2);
  const [inputAddress, setInputAddress] = React.useState("");

  const registerDomain = async () => {
    let account = getProfile();
    const rateEnsInstance = new web3.eth.Contract(RateENS.abi, ensAddress);

    const registerDomainTransactionParams = {
      from: account,
      to: ensAddress,
      data: rateEnsInstance.methods.registerNew(account).encodeABI(),
    };

    try {
      await web3.eth.sendTransaction(registerDomainTransactionParams);
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const rateENS = async () => {
    let account = getProfile();
    const rateEnsInstance = new web3.eth.Contract(RateENS.abi, ensAddress);

    const rateTransactionParams = {
      from: account,
      to: ensAddress,
      data: rateEnsInstance.methods.rate(inputAddress, value).encodeABI(),
    };

    try {
      await web3.eth.sendTransaction(rateTransactionParams);
    } catch (err) {
      console.log("err: ", err);
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
              <h3 className={classes.cardTitle}>35</h3>
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
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="standard-basic"
                  label="0x7a..."
                  variant="standard"
                  value={inputAddress}
                  onChange={(event, newValue) => {
                    setInputAddress(newValue);
                  }}
                />
              </Box>
              <div className={classes.root}>
                <Rating
                  name="half-rating"
                  defaultValue={2}
                  precision={0.5}
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                    console.log(newValue);
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
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>Last Ratings</h4>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["Timestamp", "Address", "TxHash", "Rate"]}
                tableData={[
                  ["1", "Dakota Rice", "$36,738", "Niger"],
                  ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Ranking Stats</h4>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["ID", "Name", "Salary", "Country"]}
                tableData={[
                  ["1", "Dakota Rice", "$36,738", "Niger"],
                  ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                  ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                  ["4", "Philip Chaney", "$38,735", "Korea, South"],
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

Dashboard.layout = Admin;

export default Dashboard;
