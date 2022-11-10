import React from "react";
import { useRouter } from "next/router";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

import styles from "assets/jss/nextjs-material-dashboard/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";

//wallet connect
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { setProfile } from "../variables/wallet";

let ps;

export default function Admin({ children, ...rest }) {
  // wallet connect
  const [walletConnected, setWalletConnected] = React.useState(false);
  const [account, setAccount] = React.useState();
  const [networkError, setNetworkError] = React.useState();

  const lookupEnsAddress = async (walletAddress) => {
    const provider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const checkForEnsDomain = await web3Provider.lookupAddress(walletAddress);
    return checkForEnsDomain;
  };

  const connectWallet = async () => {
    const provider = await web3Modal.connect();
    console.log(provider);
    const web3Provider = new ethers.providers.Web3Provider(provider);
    console.log(web3Provider);
    const signer = web3Provider.getSigner();
    console.log(signer);
    const address = await signer.getAddress();
    const checkForEns = await lookupEnsAddress(address);
    checkForEns !== null ? setAccount(checkForEns) : setAccount(address);
    setWalletConnected(true);
    setProfile(address);

    const network = await web3Provider.getNetwork();
    if (network.chainId !== 5) {
      setNetworkError(true);
    }
    console.log(network);
  };

  // // UseEffects

  React.useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  React.useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  });

  let web3Modal;
  if (typeof window !== "undefined") {
    web3Modal = new Web3Modal({
      network: "goerli",
      cacheProvider: true,
      providerOptions: {},
    });
  }

  // used for checking current route
  const router = useRouter();
  // styles
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState("white");
  const [fixedClasses, setFixedClasses] = React.useState("dropdown show");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleImageClick = (image) => {
    setImage(image);
  };
  const handleColorClick = (color) => {
    setColor(color);
  };
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return router.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);
  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"DRS"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        {!walletConnected ? (
          <div>
            <button onClick={connectWallet}>"Connect Wallet"</button>
          </div>
        ) : (
          <div>
            <div>
              <p>Address: {account}</p>
            </div>
          </div>
        )}
        {/* <Navbar
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        /> */}
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>{children}</div>
          </div>
        ) : (
          <div className={classes.map}>{children}</div>
        )}
        {getRoute() ? <Footer /> : null}
      </div>
    </div>
  );
}
