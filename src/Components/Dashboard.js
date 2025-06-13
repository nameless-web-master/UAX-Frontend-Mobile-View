import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import axios from "axios";
import copy from "copy-to-clipboard";
import { QRCode } from 'react-qrcode-logo';
import Buy from "./Buy";
import Sell from "./Sell";
import Carousel from 'react-bootstrap/Carousel';
import PowerSettingsNewIcon from '@mui/icons-material/Bolt';
import Reward from '@mui/icons-material/EmojiEvents';
import Modal from 'react-bootstrap/Modal';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Footer from './Footer'
import { Html5Qrcode } from "html5-qrcode";
import Txlist from "./Txlist";
import { UserInfor } from './UserInfor';
import StakingInfor from "./StakeingInfor";

import Circle from '../media/circle.png';

const inputContainerStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#3e2f41",
  borderRadius: "5px",
  padding: "8px 16px",
  minHeight: "6.5vh",
};

const currencyStyle = {
  marginLeft: "8px",
  color: "#B0B0B0",
  display: "flex",
  alignItems: "center",
};

const amountInputStyle = {
  ...inputContainerStyle,
  justifyContent: "space-between",
};

const tableStyle = {
  borderCollapse: "collapse",
  width: "100%",
};

const cellStyle = {
  border: "none",
  backgroundColor: "transparent",
  padding: "8px",
  color: "#fff",
};
const rightAlignCellStyle = {
  ...cellStyle,
  textAlign: "right",
  fontWeight: "900",
};
const Dashboard = () => {
  const [wallet_address, setwallet_address] = useState("");
  const [email, setemail] = useState("");
  const [token, settoken] = useState("");
  const [copied, setcopied] = useState(false);
  const [loader, setloader] = useState(true);
  const [BalanceAndPower, setBalanceAndPower] = useState("");
  const [coin_price, setcoin_price] = useState(0);
  const [Wallet_transactions, setWallet_transactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const transactionsPerPage = 7;
  const [AmountToTransfer, setAmountToTransfer] = useState('');
  const [WalletToTransfer, setWalletToTransfer] = useState("");
  const [MsgForSend, setMsgForSend] = useState("");
  const [power_per_txn, setpower_per_txn] = useState("");
  const [activeTab, setActiveTab] = useState("pills-home");
  const [login_details, setlogin_details] = useState('');
  const [reserved_power, setreserved_power] = React.useState(0);
  const [reserved_balance, setreserved_balance] = React.useState(0);
  const [clickedSend, setclickedSend] = useState(false);

  const [stakedAmtState, setStakedAmtState] = useState('');
  const [stakedDevices, setstakedDevices] = useState(0);
  const [generatedPower, setGeneratedPower] = useState(0);
  const [earnedAmtState, setEarnedAmtState] = useState(0);
  const [otpmodal, setotpmodal] = useState(false);
  const [MsgForClaim, setMsgForClaim] = useState("");
  const [checkAirdrop, setcheckAirdrop] = useState(false);
  const [claimAirdropBtn, setclaimAirdropBtn] = useState(false);


  const calculateTimeLeft = () => {
    const targetDate = new Date("2025-07-22T00:00:00");

    const difference = +targetDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = null;
    }

    return timeLeft;
  };
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());


  const handleClose = () => {
    setotpmodal(false);
  };

  const copyAddress = () => {
    copy(wallet_address);
    setcopied(true);
    setTimeout(() => {
      setcopied(false);
    }, 2000);
  };

  const initialFunction = async () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const walletAddress = localStorage.getItem('wallet_address');

    if (!token || !email) {
      window.location.href = "/login";
      return;
    }

    setemail(email);
    settoken(token);

    try {
      const responseToken = await axios.post(
        "https://services.uaxwallet.com/api/verifyToken",
        { token, email }
      );

      if (responseToken.data === "Token Expired") {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [price, balanceAndPower, walletTransactions, powerConsumption, getSummary, airdropStatus, combined_wallet_response] = await Promise.all([
        axios.get("https://cmw.uax.network/get_current_price"),
        axios.post("https://services.uaxwallet.com/api/getUserBalanceAndPower", { email }, config),
        axios.post("https://services.uaxwallet.com/api/getUserWalletTransactions", { email }, config),
        axios.get("https://cmw.uax.network/estimate_bandwidth"),
        axios.post("https://services.uaxwallet.com/api/getNFTsAndOffersSummary", {
          email
        }, config),
        axios.post("https://services.uaxwallet.com/api/checkAirdropClaim", {
          email
        }, config),
        axios.post("https://webservices.uaxwallet.com/get_combined_wallet_info", { wallet_address: walletAddress }),
      ]);
      setcoin_price(price.data.current_price);
      setpower_per_txn(powerConsumption.data);
      setcheckAirdrop(airdropStatus.data.claimStatus)
      // console.log(airdropStatus.data)
      if (airdropStatus.data.claimStatus == false) {
        setotpmodal(true)
      }

      setreserved_power((parseFloat(getSummary.data.totalAskAmounts) * 212) + (parseFloat(getSummary.data.totalNFTsListedForSell) * 212))
      setreserved_balance((parseFloat(getSummary.data.totalBidAmount)))

      if (walletAddress) {
        setwallet_address(walletAddress);
        setBalanceAndPower(balanceAndPower.data);
        setStakedAmtState(isNaN(combined_wallet_response.data.stakedAmount) ? 0 : combined_wallet_response.data.stakedAmount);
        setstakedDevices(isNaN(combined_wallet_response.data.totalDevices) ? 0 : combined_wallet_response.data.totalDevices);
        setGeneratedPower(isNaN(combined_wallet_response.data.generatedPower) ? 0 : combined_wallet_response.data.generatedPower);
        setEarnedAmtState(isNaN(combined_wallet_response.data.earningsFromStake) ? 0 : combined_wallet_response.data.earningsFromStake);


        if (walletTransactions) {
          if (walletTransactions.data.error) {
            const transactions = []
            setWallet_transactions(transactions);
          }
          else {
            const transactions = walletTransactions.data.length > 7
              ? walletTransactions.data.reverse().slice(-7).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              : walletTransactions.data;
            setWallet_transactions(transactions);
            // console.log(walletTransactions.data)
          }
        }
        else {
          const transactions = walletTransactions.data.length > 7
            ? walletTransactions.data.slice(-7).reverse()
            : walletTransactions.data;
          setWallet_transactions(transactions);
        }
      }

      setloader(false);
    } catch (error) {
      console.error("Error during API calls:", error);
      // window.location.href = "/login";
    }
  };

  useEffect(() => {
    const getLoginDetails = async () => {
      const details = await axios.get("https://ipapi.co/json/")
      setlogin_details(details.data)
    }
    getLoginDetails()
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
    initialFunction();
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);




  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem("activeTab", tabId);
  };

  const transfer = async () => {
    setMsgForSend(
      <img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />
    );
    setclickedSend(true)
    if (parseFloat(AmountToTransfer) > 0) {
      if (WalletToTransfer.length > 0) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const getBrowserAndOS = () => {
          const userAgent = window.navigator.userAgent;
          let browserName = 'Unknown Browser';
          let osName = 'Unknown OS';

          if (userAgent.indexOf('Firefox') > -1) {
            browserName = 'Mozilla Firefox';
          } else if (userAgent.indexOf('SamsungBrowser') > -1) {
            browserName = 'Samsung Internet';
          } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
            browserName = 'Opera';
          } else if (userAgent.indexOf('Trident') > -1) {
            browserName = 'Microsoft Internet Explorer';
          } else if (userAgent.indexOf('Edge') > -1) {
            browserName = 'Microsoft Edge';
          } else if (userAgent.indexOf('Chrome') > -1) {
            browserName = 'Google Chrome';
          } else if (userAgent.indexOf('Safari') > -1) {
            browserName = 'Apple Safari';
          }

          if (userAgent.indexOf('Windows NT 10.0') > -1) {
            osName = 'Windows 10';
          } else if (userAgent.indexOf('Windows NT 6.3') > -1) {
            osName = 'Windows 8.1';
          } else if (userAgent.indexOf('Windows NT 6.2') > -1) {
            osName = 'Windows 8';
          } else if (userAgent.indexOf('Windows NT 6.1') > -1) {
            osName = 'Windows 7';
          } else if (userAgent.indexOf('Windows NT 6.0') > -1) {
            osName = 'Windows Vista';
          } else if (userAgent.indexOf('Windows NT 5.1') > -1) {
            osName = 'Windows XP';
          } else if (userAgent.indexOf('Mac OS X') > -1) {
            osName = 'Mac OS X';
          } else if (userAgent.indexOf('Android') > -1) {
            osName = 'Android';
          } else if (userAgent.indexOf('Linux') > -1) {
            osName = 'Linux';
          } else if (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
            osName = 'iOS';
          }

          return { browserName, osName };
        };

        const { browserName, osName } = await getBrowserAndOS();
        const sent = await axios.post(
          "https://services.uaxwallet.com/api/createUserTransaction",
          {
            email: email,
            amount: AmountToTransfer,
            recipient: WalletToTransfer,
            ip: login_details ? login_details.ip : 'Not Detected',
            country_code: login_details ? login_details.country_code : 'Not Detected',
            browser: browserName,
            os: osName,
            timestamp: new Date().toLocaleString()
          },
          config
        );
        if (sent.data.note) {
          setMsgForSend(sent.data.note);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setMsgForSend(sent.data);
          setclickedSend(false)
        }
      } else {
        setMsgForSend("Invalid recipient wallet address");
        setclickedSend(false)
      }
    } else {
      setMsgForSend("Invalid Amount");
      setclickedSend(false)
    }
  };

  const resetErrorsOrSuccessMsg = () => {
    setMsgForSend("");
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleScan = () => {
    const readerId = "reader";
    const html5QrCode = new Html5Qrcode(readerId);
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      setWalletToTransfer(decodedText);
      html5QrCode.stop().then(() => {
        document.getElementById(readerId).innerHTML = "";
      });
    };

    const config = { fps: 10, qrbox: 250 };

    Html5Qrcode.getCameras()
      .then((devices) => {
        // Look for back camera
        const backCamera = devices.find((device) =>
          device.label.toLowerCase().includes("back")
        );

        const cameraId = backCamera ? backCamera.id : devices[0].id;

        html5QrCode.start({ deviceId: { exact: cameraId } }, config, qrCodeSuccessCallback)
          .catch((err) => console.error("Camera start error", err));
      })
      .catch((err) => console.error("Camera access error", err));
  };



  const claimAirdrop = async () => {
    setclaimAirdropBtn(true)
    setMsgForClaim(
      <img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />
    );
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    var response = await axios.post("https://services.uaxwallet.com/api/claimAirdrop", { email: email }, config)
    // console.log(response.data)
    setMsgForClaim(response.data.message)
    if (response.data.message === "Airdrop claimed successfully") {
      // setMsgForClaim("")
      setTimeout(() => {
        window.location.reload();
      }, 3000)
    }
  }

  return (
    <>
      <UserInfor />
      <div className="container">
        <div className="dashboard_box_001____ px-5 py-4 dashboard_box_001_____for_reducing_padding_in_mobile desk_view">
          <div className="row">
            <div className="col-md-6 mt-2">
              <p className="mb-0">Portfolio Balance</p>
              <span
                style={{
                  color: "#0ce456",
                  fontSize: "25px",
                  fontWeight: "900",
                }}
              >
                {parseFloat(coin_price) > 0 ? (
                  <>
                    ${" "}
                    {(() => {
                      const amount =
                        parseFloat(coin_price) *
                        (parseFloat(BalanceAndPower.balance) - parseFloat(reserved_balance));
                      return Number.isInteger(amount)
                        ? amount
                        : amount.toFixed(3).replace(/\.?0+$/, "");
                    })()}

                    <p className="mb-0" style={{ fontSize: "14px", color: "#c006df" }}>
                      {(() => {
                        const amount =
                          parseFloat(BalanceAndPower.balance) - parseFloat(reserved_balance);
                        return Number.isInteger(amount)
                          ? amount
                          : amount.toFixed(3).replace(/\.?0+$/, "");
                      })()}{" "}
                      UAXN
                    </p>
                  </>
                ) : (
                  <img
                    src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"}
                    style={{ width: "3vw" }}
                  />
                )}

              </span>
            </div>
            <div className="col-md-6 mt-2 desk_view">
              <ul
                className="nav nav-pills mb-3 mt-2"
                id="pills-tab"
                role="tablist"
              >
                <li
                  className="nav-item"
                  role="presentation"
                  style={{ display: "none" }}
                >
                  <button
                    className={`nav-link tabs_button____ mt-2 ${activeTab === "pills-home" ? "active" : ""
                      }`}
                    id="pills-home-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-home"
                    type="button"
                    role="tab"
                    aria-controls="pills-home"
                    aria-selected={activeTab === "pills-home"}
                    onClick={() => handleTabClick("pills-home")}
                  >
                    <img src={"https://images.uaxdlts.com/uax-dashboard/images/bitcoin-icons_send-filled.svg"} style={{ width: "24px" }} /> Default
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    onClick={() => {
                      resetErrorsOrSuccessMsg();
                      handleTabClick("pills-send");
                    }}
                    className={`nav-link tabs_button____ mt-2 ${activeTab === "pills-send" ? "active" : ""
                      }`}
                    id="pills-send-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-send"
                    type="button"
                    role="tab"
                    aria-controls="pills-send"
                    aria-selected={activeTab === "pills-send"}
                  >
                    <img src={"https://images.uaxdlts.com/uax-dashboard/images/bitcoin-icons_send-filled.svg"} style={{ width: "24px" }} /> Send
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    onClick={() => {
                      resetErrorsOrSuccessMsg();
                      handleTabClick("pills-profile");
                    }}
                    className={`nav-link tabs_button____ mt-2 ${activeTab === "pills-profile" ? "active" : ""
                      }`}
                    id="pills-profile-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-profile"
                    type="button"
                    role="tab"
                    aria-controls="pills-profile"
                    aria-selected={activeTab === "pills-profile"}
                  >
                    <img src={"https://images.uaxdlts.com/uax-dashboard/images/bitcoin-icons_receive-filled.svg"} style={{ width: "24px" }} />{" "}
                    Receive
                  </button>
                </li>
                <li className="nav-item sidebar_class_001____" role="presentation">
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mobile_view">
          <div
            className="col-12 mt-2 d-flex justify-content-center position-relative mobile_view mobile_view_flex"
          >
            <img src={Circle} />
            <div
              className="col-12 mt-2 position-absolute top-50"
              style={{
                left: 0,
                transform: 'translate(0,-50%)'
              }}
            >
              <p className="mb-0 text-center">Portfolio Balance</p>
              <span
                style={{
                  color: "#0ce456",
                  fontSize: "25px",
                  fontWeight: "900",
                }}
              >
                {parseFloat(coin_price) > 0 ? (
                  <>
                    <p className="text-center mb-2" style={{
                      fontWeight: '600'
                    }}>
                      ${" "}
                      {(() => {
                        const amount =
                          parseFloat(coin_price) *
                          (parseFloat(BalanceAndPower.balance) - parseFloat(reserved_balance));
                        return Number.isInteger(amount)
                          ? amount
                          : amount.toFixed(3).replace(/\.?0+$/, "");
                      })()}
                    </p>

                    <p className="mb-0 text-center" style={{ fontSize: "14px", color: "#c006df" }}>
                      {(() => {
                        const amount =
                          parseFloat(BalanceAndPower.balance) - parseFloat(reserved_balance);
                        return Number.isInteger(amount)
                          ? amount
                          : amount.toFixed(3).replace(/\.?0+$/, "");
                      })()}{" "}
                      UAXN
                    </p>
                  </>
                ) : (
                  <img
                    src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"}
                    style={{ width: "3vw" }}
                  />
                )}

              </span>
            </div>
          </div>
          <div>
            <ul
              className="nav nav-pills mb-3 mt-2 d-flex justify-content-center"
              id="pills-tab"
              role="tablist"
            >
              <li
                className="nav-item"
                role="presentation"
                style={{ display: "none" }}
              >
                <button
                  className={`nav-link tabs_button____ mt-2 ${activeTab === "pills-home" ? "active" : ""
                    }`}
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected={activeTab === "pills-home"}
                  onClick={() => handleTabClick("pills-home")}
                >
                  <img src={"https://images.uaxdlts.com/uax-dashboard/images/bitcoin-icons_send-filled.svg"} style={{ width: "24px" }} /> Default
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  onClick={() => {
                    resetErrorsOrSuccessMsg();
                    handleTabClick("pills-send");
                  }}
                  className={`nav-link tabs_button____ mt-2 ${activeTab === "pills-send" ? "active" : ""
                    }`}
                  id="pills-send-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-send"
                  type="button"
                  role="tab"
                  aria-controls="pills-send"
                  aria-selected={activeTab === "pills-send"}
                >
                  <img src={"https://images.uaxdlts.com/uax-dashboard/images/bitcoin-icons_send-filled.svg"} style={{ width: "24px" }} /> Send
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  onClick={() => {
                    resetErrorsOrSuccessMsg();
                    handleTabClick("pills-profile");
                  }}
                  className={`nav-link tabs_button____ mt-2 ${activeTab === "pills-profile" ? "active" : ""
                    }`}
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected={activeTab === "pills-profile"}
                >
                  <img src={"https://images.uaxdlts.com/uax-dashboard/images/bitcoin-icons_receive-filled.svg"} style={{ width: "24px" }} />{" "}
                  Receive
                </button>
              </li>
              <li className="nav-item sidebar_class_001____" role="presentation">
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-3 mt-sm-5">
          <div className="tab-content" id="pills-tabContent">
            <div
              className={`tab-pane fade ${activeTab === "pills-home" ? "show active" : ""
                }`}
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >

              {/* <div className="container dashboard_box_001____ for__mobile__view p-4"> */}
              <Carousel data-bs-theme="light" className="for__mobile__view for_carousel_arrow">
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={"https://images.uaxdlts.com/uax-dashboard/images/AIRDROP.png"}
                    alt="First slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={"https://images.uaxdlts.com/uax-dashboard/images/DFS.png"}
                    alt="Second slide"
                  />
                </Carousel.Item>
              </Carousel>
              {/* </div> */}


              <div className="container dashboard_box_001____ mobile__view__none ">
                <div className="row mt-md-5 mx-md-5 mt-md-3 m-sm-0">
                  <div className="col-lg-6 col-md-12 col-sm-12 dashboard_class_002____">
                    <img src={"https://images.uaxdlts.com/uax-dashboard/images/staking.svg"} className="w-100" />
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12 my-3 dashboard_class_003____">
                    <div className="parent" style={{ height: "100%" }}>
                      <div className="child" style={{ position: "relative", width: "100%" }}>
                        <Carousel data-bs-theme="light">
                          <Carousel.Item>
                            <img
                              className="d-block w-100"
                              src={"https://images.uaxdlts.com/uax-dashboard/images/BANNER1.png"}
                              alt="First slide"
                            />
                          </Carousel.Item>
                          <Carousel.Item>
                            <img
                              className="d-block w-100"
                              src={"https://images.uaxdlts.com/uax-dashboard/images/BANNER2.png"}
                              alt="Second slide"
                            />
                          </Carousel.Item>
                          <Carousel.Item>
                            <img
                              className="d-block w-100"
                              src={"https://images.uaxdlts.com/uax-dashboard/images/BANNER3.png"}
                              alt="Third slide"
                            />
                          </Carousel.Item>
                        </Carousel>
                      </div>
                    </div>

                    {/* <div className="parent" style={{ height: "100%" }}>
                        <div className="child" style={{ position: "relative" }}>
                          <h3 style={{ fontFamily: "Zen Dots" }}>
                            UAX is a groundbreaking primary blockchain asset hub
                          </h3>
                          <a href="#" target="_blank">
                            <Button
                              // id="pills-contact-tab"
                              // data-bs-toggle="pill"
                              // data-bs-target="#pills-contact"
                              // role="tab"
                              // aria-controls="pills-contact"
                              // aria-selected="false"
                              style={{ fontWeight: "900" }}
                              className="primary_btnn___ mt-3"
                              // variant="primary"
                              type="button"
                            >
                              Explorer
                            </Button>
                          </a>
                        </div>
                      </div> */}
                  </div>
                </div>
              </div>
              <div className="desk_view">
                <div className="mt-3 mt-sm-5">
                  <h5>Staking Information</h5>
                </div>
                <div className='dashboard_box_001____ p-4 mb-4 '>
                  <StakingInfor />
                </div>
              </div>

              <div className="mobile_view mt-4">
                <p className='mb-1' style={{ fontWeight: '600', fontSize: 16 }}>
                  Recently Transactions
                </p>
                <Txlist />
              </div>

            </div>
            <div
              className={`tab-pane fade ${activeTab === "pills-send" ? "show active" : ""
                }`}
              id="pills-send"
              role="tabpanel"
              aria-labelledby="pills-send-tab"
            >
              <div className="row">
                <div className="col-lg-6 col-md-12 mt-2">
                  <center className="mb-4">
                    <p
                      className="mt-5"
                      style={{ fontWeight: "600", fontSize: "20px" }}
                    >
                      Send UAXN
                    </p>
                    <span style={{ color: "#a8a8a8" }}>
                      Enter the recipient's UAXN account address for
                      transfer
                    </span>
                  </center>
                  <div
                    className="dashboard_box_001____ px-4 pb-5"
                    style={{ backgroundColor: "#222024" }}
                  >
                    <div className="text-left px-2">
                      <p
                        className="mt-5"
                        style={{ fontWeight: "600", fontSize: "" }}
                      >
                        Amount to send
                      </p>
                      <div style={{ position: 'relative', width: '100%' }}>
                        <input
                          id="searchQueryInput"
                          value={AmountToTransfer}
                          onChange={(e) =>
                            setAmountToTransfer(
                              parseFloat(e.target.value) > 0
                                ? e.target.value
                                : ''
                            )
                          }
                          style={{ backgroundColor: "#403242" }}
                          type="number"
                          name="searchQueryInput"
                          placeholder="Enter Amount"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setAmountToTransfer(
                              (
                                parseFloat(BalanceAndPower.balance) -
                                parseFloat(reserved_balance)
                              ).toFixed(3)
                            )
                          }
                          className="text-white text-sm primary_btnn___"
                          style={{
                            position: "absolute",
                            right: "2px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "",
                            padding: "4px 10px",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Max
                        </button>
                      </div>
                      <small style={{ fontSize: "14px", color: "#a8a8a8" }}>
                        Available Balance :{" "}
                        {(parseFloat(BalanceAndPower.balance) - parseFloat(reserved_balance)).toFixed(3)} UAXN
                      </small>
                      <p
                        className="mt-4"
                        style={{ fontWeight: "600", fontSize: "" }}
                      >
                        To address
                      </p>
                      <div className="" style={{ position: "relative", width: "100%" }}>
                        <input
                          id="searchQueryInput"
                          value={WalletToTransfer}
                          onChange={(e) => setWalletToTransfer(e.target.value)}
                          style={{ backgroundColor: "#403242" }}
                          type="text"
                          name="searchQueryInput"
                          placeholder="Wallet Address"
                        />
                        <button
                          type="button"
                          onClick={handleScan}
                          className="text-white text-sm primary_btnn___"
                          style={{
                            position: "absolute",
                            right: "2px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "",
                            padding: "4px 10px",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Scan
                        </button>
                      </div>
                      <small style={{ fontSize: "14px", color: "#fff", fontWeight: "800" }}>
                        {power_per_txn}
                        {" "}<span style={{ color: "#fff", fontWeight: "400" }}>
                          <OverlayTrigger
                            placement="right"
                            overlay={
                              <Tooltip id={`tooltip-right`} className="custom-tooltip">
                                Cost per unit of gas for the transaction, in UAXN and BANDWIDTH.
                              </Tooltip>
                            }
                          >
                            <i className="fa fa-question-circle"></i>
                          </OverlayTrigger>
                        </span>
                      </small>
                      {/* <div id="reader" style={{ marginTop: "20px" }}></div> */}
                      <Button
                        style={{
                          fontWeight: "900",
                          width: "100%",
                          minHeight: "6.1vh",
                        }}
                        className="primary_btnn___ mt-5"
                        variant="primary"
                        onClick={transfer}
                        disabled={clickedSend}
                      >
                        Send
                      </Button>
                      {MsgForSend && (
                        <div
                          className="alert alert-success mt-3 text-center"
                          role="alert"
                        >
                          {MsgForSend}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 mt-2 p-4">
                  <p className='mb-1' style={{ fontWeight: '600', fontSize: 16 }}>
                    Latest Transactions
                  </p>
                  <Txlist />
                </div>
              </div>
            </div>
            <div
              className={`tab-pane fade ${activeTab === "pills-profile" ? "show active" : ""
                }`}
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              <div className="row">
                <div className="col-lg-6 col-md-12 mt-2">
                  <div
                    className="p-3 dashboard_box_001____ text-center"
                    style={{ backgroundColor: "#222024" }}
                  >
                    <div
                      className="mt-5 mx-3 small_view"
                      style={{
                        backgroundColor: '#19101C',
                        border: '1px solid #383A46',
                        borderRadius: 80,
                        padding: 4
                      }}
                    >
                      <div
                        className="py-3"
                        style={{
                          backgroundColor: '#413545',
                          borderRadius: 80
                        }}
                      >
                        <h2
                          className="m-0"
                          style={{
                            fontSize: 16,
                            color: '#FFFFFF99'
                          }}
                        >
                          Balance:
                          <span
                            className="mx-1"
                            style={{
                              color: '#0DF469'
                            }}
                            s>
                            {BalanceAndPower
                              ? (parseFloat(BalanceAndPower.balance) - parseFloat(reserved_balance)).toFixed(3)
                              : 0.0}{" "}
                            UAXN
                          </span>
                        </h2>
                      </div>
                    </div>
                    <div
                      className="desk_view"
                    >
                      <p
                        className="mt-5"
                        style={{ fontWeight: "900", fontSize: "20px" }}
                      >
                        Receive UAXN
                      </p>
                      <span style={{ color: "#a8a8a8" }}>
                        Share your UAXN Account Address or QR Code to receive
                        UAXN Coin
                      </span>
                      <br />
                      <br />
                      <br />
                      <div
                      className="d-flex flex-column align-items-center"
                        style={{
                          height: "auto",
                          margin: "0 auto",
                          maxWidth: 150,
                          width: "100%",
                          padding: 10,
                          // backgroundColor: "#fff",
                        }}
                      >
                        <QRCode
                          size={160}
                          value={wallet_address}
                          logoImage="https://cloud.uax.network/static/media/uaxdlts.54db363e73bc62fa10bfa51a1cca4350.svg"
                          removeQrCodeBehindLogo={true}
                          qrStyle="dots"
                          logoOpacity="1"
                          logoWidth={40}
                          logoHeight={20}
                          logoPadding={10}
                          ecLevel="H"
                          eyeRadius={5}
                          eyeColor='#c006df'
                          viewBox="0 0 256 256"
                          bgColor="#000"
                          fgColor="#fff"
                        />
                        {/* <QRCode
                          size={256}
                          style={{
                            height: "auto",
                            maxWidth: "100%",
                            width: "100%",
                          }}
                          value={wallet_address}
                          viewBox={`0 0 256 256`}
                          bgColor={"#fff"}
                          fgColor={"#000"}
                        /> */}
                      </div>
                    </div>
                    <div
                      className="mobile_view border border-2 border-dark my-4 py-4"
                    >
                      <QRCode
                        size={180}
                        value={wallet_address}
                        logoImage="https://cloud.uax.network/static/media/uaxdlts.54db363e73bc62fa10bfa51a1cca4350.svg"
                        removeQrCodeBehindLogo={true}
                        qrStyle="squares"
                        logoOpacity="2"
                        ecLevel="H"
                        eyeRadius={5}
                        eyeColor='#000'
                        // viewBox="0 0 256 256"
                        bgColor="#fff"
                        fgColor="#000"
                        style={{
                          marginTop: 6
                        }}
                      />
                      <div
                        className="mt-3 d-flex flex-row justify-content-between align-items-center px-5"
                        style={{
                          color: '#9493AC',
                          fontSize: 14
                        }}
                      >
                        <p
                          className="m-0"
                        >
                          {wallet_address}
                        </p>
                        <i
                          className="fa fa-clone"
                          onClick={copyAddress}
                          style={{ cursor: "pointer" }}
                        ></i>
                      </div>
                      {copied ? (
                        <span style={{ color: "green" }}>
                          Copied to clipboard!
                        </span>
                      ) : (
                        ""
                      )}

                      <hr className="m-4" />
                      <Button
                        style={{
                          fontWeight: "500",
                          backgroundColor: 'transparent',
                          borderColor: '#9493AC'
                        }}
                        variant="primary"
                        type="submit"
                      >
                        <i className="fa fa-upload text-white mx-2"></i>
                        Share
                      </Button>
                    </div>
                    <div className="my-3 desk_view">
                      <div
                        className="dashboard_box_001____ py-3"
                        style={{ height: "100%" }}
                      >
                        <p>Balance</p>
                        <span
                          style={{
                            color: "#39d62c",
                            fontSize: "20px",
                            fontWeight: "800",
                          }}
                        >
                          {BalanceAndPower
                            ? (parseFloat(BalanceAndPower.balance) - parseFloat(reserved_balance)).toFixed(3)
                            : 0.0}{" "}
                          UAXN
                        </span>
                        <br />
                        <hr style={{ borderTop: "0.1px solid grey" }} />
                        <p>Address</p>
                        <div className="mb-3">
                          <span
                            className="px-4 py-2"
                            style={{
                              backgroundColor: "#403242",
                              wordBreak: "break-word",
                              borderRadius: "5px",
                            }}
                          >
                            {wallet_address}{" "}
                            <i
                              style={{ cursor: "pointer" }}
                              onClick={copyAddress}
                              className="fa fa-clipboard"
                              aria-hidden="true"
                            ></i>
                          </span>
                          <br />
                          <br />
                          {copied ? (
                            <span style={{ color: "green" }}>
                              Copied to clipboard!
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      {/* <Button
                        style={{ fontWeight: "900", width: "100%" }}
                        className="primary_btnn___ mt-3"
                        variant="primary"
                        type="submit"
                      >
                        Receive
                      </Button> */}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 mt-2 p-md-2 p-4">
                  <p className='mb-1' style={{ fontWeight: '600', fontSize: 16 }}>
                    Latest Transactions
                  </p>
                  <Txlist />
                </div>
              </div>
            </div>
            <div
              className={`tab-pane fade ${activeTab === "pills-contact" ? "show active" : ""
                }`}
              id="pills-contact"
              role="tabpanel"
              aria-labelledby="pills-contact-tab"
            >
              <Buy />
            </div>
            <div
              className={`tab-pane fade ${activeTab === "pills-sell" ? "show active" : ""
                }`}
              id="pills-sell"
              role="tabpanel"
              aria-labelledby="pills-sell-tab"
            >
              <Sell />
            </div>
          </div>
        </div>
      </div >
      {/* )} */}

      <Modal size="lg" aria-labelledby="contained-modal-title-vcenter"
        centered show={otpmodal} onHide={handleClose}>
        <Modal.Body className="modal_body_for_bg" style={{ padding: '5%', border: 'none', color: '#fff', backgroundSize: "cover" }}>
          <Modal.Header closeButton style={{ borderBottom: "none" }}>
          </Modal.Header>
          <center>
            {/* <img src={"https://images.uaxdlts.com/uax-dashboard/images/I21.png"} style={{ height: '15vh' }} alt="I21" /> */}
            <p style={{ fontWeight: '700', fontSize: '20px', marginTop: '15px' }}>Claim Your Airdrop Worth of $100 UAXN</p>
            <div className="d-flex justify-content-center" style={{ fontSize: "25px" }}>
              <div className="mx-2 text-center">
                <span style={{ backgroundColor: "#c006df", padding: "5px", borderRadius: "5px", fontSize: "50px" }}>
                  {timeLeft.days.toString().padStart(2, '0')}
                </span>
                <br />
                <span style={{ fontSize: "11px" }}>DAYS</span>
              </div>
              <div className="mx-2 text-center">
                <span style={{ backgroundColor: "#c006df", padding: "5px", borderRadius: "5px", fontSize: "50px" }}>
                  {timeLeft.hours.toString().padStart(2, '0')}
                </span>
                <br />
                <span style={{ fontSize: "11px" }}>HOURS</span>
              </div>
              <div className="mx-2 text-center">
                <span style={{ backgroundColor: "#c006df", padding: "5px", borderRadius: "5px", fontSize: "50px" }}>
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </span>
                <br />
                <span style={{ fontSize: "11px" }}>MINUTES</span>
              </div>
              <div className="mx-2 text-center">
                <span style={{ backgroundColor: "#c006df", padding: "5px", borderRadius: "5px", fontSize: "50px" }}>
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </span>
                <br />
                <span style={{ fontSize: "11px" }}>SECONDS</span>
              </div>
            </div>

            <br />
            {claimAirdropBtn ?
              <button
                //  onClick={claimAirdrop}
                style={{
                  color: 'white',
                  backgroundColor: 'grey',
                  border: 'none',
                  minHeight: '5.5vh',
                  minWidth: '9rem',
                  borderRadius: '.25rem',
                  fontWeight: '600',
                  marginTop: '10px',
                }}
                disabled
              >
                Claim Now
              </button>
              :
              <button
                onClick={claimAirdrop}
                style={{
                  color: 'white',
                  backgroundColor: '#c006de',
                  border: 'none',
                  minHeight: '5.5vh',
                  minWidth: '9rem',
                  borderRadius: '.25rem',
                  fontWeight: '600',
                  marginTop: '10px',
                }}
              >
                Claim Now
              </button>
            }
            <br />
            <p style={{ fontWeight: '700', fontSize: '20px', marginTop: '15px' }}>{MsgForClaim}</p>
          </center>
        </Modal.Body>
      </Modal >
      <Footer />
    </>
  );
};

export default Dashboard;
