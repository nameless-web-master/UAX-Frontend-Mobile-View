import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Web3 from 'web3';
import ABI from './BSCUSDTABI.json'
import Table from 'react-bootstrap/Table';
import Timer from './Timer';
import { QRCode } from 'react-qrcode-logo';

const noDataStyle = {
  textAlign: 'center',
  backgroundColor: 'transparent',
  borderBottom: "none",
  position: "relative"
};

const sectionStyle = {
  marginBottom: '20px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 'bold'
};

const inputContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#3e2f41',
  borderRadius: '5px',
  padding: '8px 16px',
  minHeight: '6.5vh'
};

const currencyStyle = {
  marginLeft: '8px',
  color: '#B0B0B0',
  display: 'flex',
  alignItems: 'center'
};

const amountInputStyle = {
  ...inputContainerStyle,
  justifyContent: 'space-between'
};

const tableStyle = {
  borderCollapse: 'collapse',
  width: '100%',
};

const cellStyle = {
  border: 'none',
  backgroundColor: 'transparent',
  padding: '8px',
  color: "#fff"
};
const rightAlignCellStyle = {
  ...cellStyle,
  textAlign: 'right',
  fontWeight: "900"
};

const Buy = () => {
  const [amount, setAmount] = useState(0);
  const [amount_for_tron, setamount_for_tron] = useState(0);
  const [amount_for_bsc, setamount_for_bsc] = useState(0);
  const [email, setemail] = useState('');
  const [token, settoken] = useState('');
  const [BalanceAndPower, setBalanceAndPower] = useState('');
  const [loader, setloader] = useState(true);
  const [coin_price, setcoin_price] = useState(0);
  const [buy_msg, setbuy_msg] = useState('');
  const [buy_msg_tron, setbuy_msg_tron] = useState('');
  const [buy_msg_bsc, setbuy_msg_bsc] = useState('');
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [wallet_address, setwallet_address] = useState('');
  const transactionsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(0);
  const [Wallet_transactions, setWallet_transactions] = useState([]);
  const [wallet_address_pg, setwallet_address_pg] = useState('');
  const [pg_body, setpg_body] = useState(false);
  const [timer_count, setTimer_count] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [reserved_power, setreserved_power] = React.useState(0);
  const [reserved_balance, setreserved_balance] = React.useState(0);
  const [buttonDetails, setButtonDetails] = useState({
    buy_button_usdt_trc20: false,
    buy_button_usdt_tronlink: false,
    sell_button: false,
  });

  const [buyWithUsdt, setBuyWithUsdt] = useState(false);
  const [usdtAmount, setUsdtAmount] = useState(0);
  const [usdtAmountTron, setusdtAmountTron] = useState(0);

  const handleUaxnChange = (e) => {
    if (!e.target.value) {
      setAmount('');
    } else {
      setAmount(e.target.value);
    }
  };

  const handleUsdtChange = (e) => {
    if (!e.target.value) {
      setUsdtAmount('');
    } else {
      setUsdtAmount(e.target.value);
    }
  };
  const handleUsdtChangeTron = (e) => {
    if (!e.target.value) {
      setusdtAmountTron('');
    } else {
      setusdtAmountTron(e.target.value);
    }
  };




  const handleAmountChange = (e) => {
    if (!e.target.value) {
      setAmount('');
    }
    else {
      setAmount(e.target.value);
    }
  };

  const handleAmountChangeTron = (e) => {
    if (!e.target.value) {
      setamount_for_tron('');
    }
    else {
      setamount_for_tron(e.target.value);
    }
  };

  const handleAmountChangeBsc = (e) => {
    if (!e.target.value) {
      setamount_for_bsc('');
    }
    else {
      setamount_for_bsc(e.target.value);
    }
  };


  useEffect(() => {
    const initialFunction = async () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      if (token && email) {
        setemail(email);
        settoken(token);

        try {
          const responseToken = await axios.post("https://services.uaxwallet.com/api/verifyToken", {
            token: token,
            email: email,
          });

          if (responseToken.data === "Token Expired") {
            localStorage.clear();
            window.location.href = "/login";
          } else {
            const config = {
              headers: { Authorization: `Bearer ${token}` },
            };

            // Perform API calls concurrently
            const [priceResponse, balanceAndPowerResponse, walletTransactionsResponse, getSummary, buttonDetails] = await Promise.all([
              axios.get("https://cmw.uax.network/get_current_price"),
              axios.post("https://services.uaxwallet.com/api/getUserBalanceAndPower", { email: email }, config),
              axios.post("https://services.uaxwallet.com/api/getUserBuySellTransactions", { email: email }, config),
              axios.post("https://services.uaxwallet.com/api/getNFTsAndOffersSummary", {
                email
              }, config),
              axios.post('https://services.uaxwallet.com/api/getBuySellButtonStatus', { email }, config)

            ]);
            setcoin_price(priceResponse.data.current_price);
            setBalanceAndPower(balanceAndPowerResponse.data);
            setreserved_power((parseFloat(getSummary.data.totalAskAmounts) * 212) + (parseFloat(getSummary.data.totalNFTsListedForSell) * 212))
            setreserved_balance((parseFloat(getSummary.data.totalBidAmount)))
            setWallet_transactions(
              walletTransactionsResponse.data.buy_txns.length > 0
                ? walletTransactionsResponse.data.buy_txns.reverse()
                : walletTransactionsResponse.data.buy_txns
            );
            setwallet_address(localStorage.getItem("wallet_address"));
            setButtonDetails(buttonDetails.data.data)
            setloader(false);
          }
        } catch (error) {
          console.error("Error during API calls:", error);
          // Handle error (e.g., show error message, retry, etc.)
        }
      } else {
        window.location.href = "/login";
      }
    };

    initialFunction();
  }, []);


  //   const getBalance = async () => {
  //     if (typeof window.ethereum !== 'undefined') {
  //       try {
  //         // Request account access
  //         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //         const account = accounts[0];
  //         const provider = new ethers.providers.Web3Provider(window.ethereum);
  //         // Get USDT balance
  //         const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // USDT contract address on Ethereum mainnet
  //         const usdtAbi = ['function balanceOf(address) view returns (uint)'];
  //         const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, provider);

  //         const usdtBalanceWei = await usdtContract.balanceOf(account);
  //         const usdtBalance = ethers.utils.formatUnits(usdtBalanceWei, 6); // USDT uses 6 decimals
  //         // console.log('USDT Balance:', usdtBalance);
  //         setmetamask_usdt_balance(usdtBalance)

  //       } catch (error) {
  //         setbuy_msg("Error fetching account balances")
  //         console.error('Error fetching account balances:', error);
  //       }
  //     } else {
  //       console.error('MetaMask is not installed');
  //     }
  //   };

  //   // Call the function to get balances
  //   getBalance();


  const handleBuyClickAutomated = async () => {
    if (parseFloat(amount) > 0) {
      if (wallet_address.length > 0) {
        setbuy_msg(<img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />)
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const payment_request = await axios.post("https://services.uaxwallet.com/api/initiatePayment", {
          email: email,
          amount: buyWithUsdt ?
            (isNaN(parseFloat(usdtAmount)) ? 0.00 : (usdtAmount / coin_price).toFixed(2))
            :
            (isNaN(parseFloat(amount)) ? 0.00 : (parseFloat(coin_price) * parseFloat(amount)).toFixed(2))
        }, config)
        if (!payment_request) {
          setbuy_msg("Request for initiating payment failed")
        }
        else {
          if (payment_request.data.status) {
            setwallet_address_pg(payment_request.data.available_wallet_address)
            setpg_body(true)
          }
          else if (payment_request.data.msg) {
            setbuy_msg(payment_request.data.msg)
            setTimer_count(payment_request.data.timestamp)
            startCountdown(new Date(payment_request.data.timestamp).getTime() + 5 * 60000);
          }
          else {
            setbuy_msg(payment_request.data)
          }
        }
      }
      else {
        setbuy_msg('Unable to get wallet address of UAXN')
      }
    }
    else {
      setbuy_msg('Invalid Amount')
    }
  };

  const startCountdown = (targetTime) => {
    const calculateTimeLeft = () => {
      const difference = targetTime - +new Date();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return timeLeft;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      if (Object.keys(newTimeLeft).length === 0) {
        clearInterval(timer);
      }
      setTimeLeft(newTimeLeft);
    }, 1000);
  };


  const handleBuyClick = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      window.ethereum.enable().then(accounts => {
        setAccount(accounts[0]);
      }).catch(error => {
        console.error('User denied account access');
      });
    } else {
      alert('MetaMask is not detected. Please install MetaMask.');
    }
    if (parseFloat(amount) > 0) {
      if (wallet_address.length > 0) {
        setbuy_msg(<img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />)
        if (typeof window.ethereum !== 'undefined') {
          // if(parseFloat(metamask_usdt_balance)>0){
          try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // USDT contract details
            const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
            const usdtAbi = [
              'function balanceOf(address) view returns (uint)',
              'function transfer(address to, uint amount) returns (boolean)'
            ];

            const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, signer);

            // Replace with the actual recipient address
            const recipientAddress = '0xCD987f4cC1F2485E3E3A62262ea03F36B531e91b';

            // Calculate transaction amount (in USDT)
            const usdtAmount = (parseFloat(amount) * parseFloat(coin_price)).toFixed(2);

            // Convert amount to 6 decimal places as USDT uses 6 decimals
            const usdtAmountWei = ethers.utils.parseUnits(usdtAmount, 6);

            // Create a transaction
            const tx = await usdtContract.transfer(recipientAddress, usdtAmountWei, {
              gasLimit: 61149,
            });
            // Wait for transaction to finish
            const txHash = tx.hash;
            //PENDING TRANSACTION ID
            // console.log('Transaction Hash:', txHash);
            const config = {
              headers: { Authorization: `Bearer ${token}` }
            };
            const stored_txn_hash = await axios.post("https://services.uaxwallet.com/api/pushTransaction", {
              email: email,
              txn_id: txHash,
              amount: usdtAmount,
              network: "ETH",
              coins: amount,
              uaxn_wallet_address: wallet_address
            }, config)

            const receipt = await tx.wait();
            //CONFIRMED TRANSACTION ID
            const transactionHash = receipt.transactionHash;

            // console.log(transactionHash)
            setbuy_msg('Transaction initiated. Please allow up to 10 minutes for confirmation')
          } catch (error) {
            console.error('Error sending transaction:', error);
            setbuy_msg('Error sending transaction')
          }
          // }
          // else{
          //     setbuy_msg("Insufficient USDT balance")
          // }
        } else {
          setbuy_msg('MetaMask is not installed')
          console.error('MetaMask is not installed');
        }
      }
      else {
        setbuy_msg('Unable to get wallet address of UAXN')
      }
    }
    else {
      setbuy_msg('Invalid Amount')
    }
  };

  // const handleBuyClick = async () => {
  //     if (parseFloat(amount) > 0) {
  //       setbuy_msg(<i className="fa fa-circle-o-notch fa-spin" style={{ fontSize: "30px" }}></i>);

  //       if (typeof window.ethereum !== 'undefined') {
  //         try {
  //           // Request account access
  //           await window.ethereum.request({ method: 'eth_requestAccounts' });

  //           const provider = new ethers.providers.Web3Provider(window.ethereum);
  //           const signer = provider.getSigner();

  //           // USDT contract details
  //           const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
  //           const usdtAbi = [
  //             'function balanceOf(address) view returns (uint)',
  //             'function transfer(address to, uint amount) returns (boolean)'
  //           ];

  //           const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, signer);

  //           // Replace with the actual recipient address
  //           const recipientAddress = '0xCD987f4cC1F2485E3E3A62262ea03F36B531e91b';
  //           const usdtAmount = (parseFloat(amount) * parseFloat(coin_price)).toFixed(2);
  //           const usdtAmountWei = ethers.utils.parseUnits(usdtAmount, 6);

  //           const gasEstimate = await usdtContract.estimateGas.transfer(recipientAddress, usdtAmountWei);

  //           // Create a transaction with the estimated gas limit
  //           const tx = await usdtContract.transfer(recipientAddress, usdtAmountWei, {
  //             gasLimit: gasEstimate,
  //           });
  //           const txHash = tx.hash;
  //           const receipt = await provider.waitForTransaction(txHash);
  //           if (receipt.status === 1) {
  //             setbuy_msg('Transaction successful');
  //           } else {
  //             setbuy_msg('Transaction failed');
  //           }
  //         } catch (error) {
  //           console.error('Error sending transaction:', error);

  //           if (error.code === ethers.errors.INSUFFICIENT_FUNDS) {
  //             setbuy_msg('Insufficient funds for gas');
  //           } else if (error.code === ethers.errors.NONCE_EXPIRED) {
  //             setbuy_msg('Nonce expired');
  //           } else if (error.message.includes('gas')) {
  //             setbuy_msg('Gas estimation failed. The transaction might fail. Please check the contract and try again.');
  //           } else {
  //             setbuy_msg('Error sending transaction');
  //           }
  //         }
  //       } else {
  //         setbuy_msg('MetaMask is not installed');
  //         // console.error('MetaMask is not installed');
  //       }
  //     } else {
  //       setbuy_msg('Invalid Amount');
  //     }
  //   };
  const CancelLastPayment = async () => {
    window.location.reload()
  }

  const handleBuyFromTron = async () => {
    try {
      setbuy_msg_tron(<img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />)

      const amountValue = buyWithUsdt ?
        isNaN(parseFloat(usdtAmountTron)) ? 0.00 : parseFloat(usdtAmountTron).toFixed(2)
        :
        ((parseFloat(amount_for_tron) * parseFloat(coin_price)).toFixed(2))

      if (isNaN(amountValue) || amountValue <= 0) {
        setbuy_msg_tron('Invalid Amount')
        return;
      }

      if (window.tronWeb && window.tronWeb.ready) {
        try {
          const tronWeb = window.tronWeb;
          const usdtContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
          const recipientAddress = 'TPoHE3N2NnYv2XtfPQqbhgWhFNirEXq7Rx';

          const contract = await tronWeb.contract().at(usdtContractAddress);
          const amountInSun = tronWeb.toSun(amountValue);
          const transaction = await contract.transfer(recipientAddress, amountInSun).send();
          // console.log("transaction",transaction)
          const config = {
            headers: { Authorization: `Bearer ${token}` }
          };
          const stored_txn_hash = await axios.post("https://services.uaxwallet.com/api/pushTransaction", {
            email: email,
            txn_id: transaction,
            amount: amountValue,
            network: "TRON",
            coins: amount_for_tron,
            uaxn_wallet_address: wallet_address
          }, config)
          setbuy_msg_tron('Transaction initiated. Please allow up to 10 minutes for confirmation')
        } catch (error) {
          // console.error('Error performing transaction', error);
          setbuy_msg_tron('Transaction failed. Please try again.')
        }
      } else {
        setbuy_msg_tron('TronLink is not detected. Please install TronLink.')
      }
    }
    catch (err) {
      console.log(err)
      setbuy_msg_tron("Error Performing Transaction")
    }
  };

  const handleBuyFromBsc = async () => {
    setbuy_msg_bsc(<i className="fa fa-circle-o-notch fa-spin" style={{ fontSize: "30px" }}></i>)
    const amountValue = parseFloat(amount_for_bsc);
    if (isNaN(amountValue) || amountValue <= 0) {
      setbuy_msg_bsc("Invalid Amount")
      return;
    }

    if (web3 && account) {
      try {
        const usdtContractAddress = '0x55d398326f99059ff775485246999027b3197955';
        const recipientAddress = '0x9da10773cC4E2eC45B8c324DD29a0F3e800F37DC';
        const usdtABI = ABI
        const usdtAmount = (parseFloat(amountValue) * parseFloat(coin_price)).toFixed(2);
        const contract = new web3.eth.Contract(usdtABI, usdtContractAddress);
        const amountInWei = web3.utils.toWei(usdtAmount.toString(), 'ether');

        await contract.methods.transfer(recipientAddress, amountInWei).send({ from: account });

        setbuy_msg_bsc('Transaction successful!')
      } catch (error) {
        setbuy_msg_bsc('Error performing transaction')
        // console.error('Error performing transaction', error);
      }
    } else {
      setbuy_msg_bsc('MetaMask is not detected or not connected.')
    }
  };

  const resetErrorsOrSuccessMsg = () => {
    setbuy_msg_bsc('')
    setbuy_msg_tron('')
    setbuy_msg('')
  }
  //   const displayedTransactions = Wallet_transactions.slice(currentPage * transactionsPerPage, (currentPage + 1) * transactionsPerPage);
  return (
    <>
      <div className='row'>
        <div className='col-lg-6 col-md-12 col-sm-12 mt-2'>
          <div className='dashboard_box_001____ px-4' style={{ height: "100%" }}>
            <div className='my-5'>
              <p className='' style={{ fontWeight: "900", fontSize: "20px" }}>Choose Network And Pay</p>
              <div className='custom_tabs_____'>
                <ul className="nav nav-tabs" id="myTab" role="tablist" style={{ border: "none", width: "100%" }}>
                  <li className="nav-item" role="presentation" style={{ width: "50%" }}>
                    <button onClick={resetErrorsOrSuccessMsg} className="nav-link active customized_button_for_nav_link_____" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">
                      {/* <img src={ERC} style={{width:"30px"}}/>  */}
                      <img src={"https://images.uaxdlts.com/uax-dashboard/images/trc.svg"} style={{ width: "50px" }} />
                      <br />
                      USDT (TRC20)
                    </button>
                  </li>

                  <li className="nav-item" role="presentation" style={{ width: "50%" }}>
                    <button className="nav-link customized_button_for_nav_link_____" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">
                      {/* <img src={TRC} style={{width:"30px"}}/>  */}
                      <img src={"https://images.uaxdlts.com/uax-dashboard/images/tronlink.svg"} style={{ width: "70px" }} />
                      <br />
                      Pay with TronLink
                    </button>
                  </li>
                  {/* <li className="nav-item" role="presentation" style={{width:"50%"}}>
                <button onClick={resetErrorsOrSuccessMsg} className="nav-link customized_button_for_nav_link_____" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">
                    <img src={Metamask} style={{width:"70px"}}/>
                    <br/>
                    Ethereum (ERC20)
                
                </button>
              </li> */}



                  {/* <li className="nav-item" role="presentation">
                <button className="nav-link customized_button_for_nav_link_____" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false" style={{fontSize:"13px"}}>
                    <img src={BEP} /> Binance (BEP20)<br/>
                    <img src={Metamask} style={{width:"20px",marginRight:"5px"}}/>Metamask
                </button>
              </li> */}
                </ul>
              </div>
              <div className="tab-content" id="myTabContent">

                {/* <div className="tab-pane fade " id="home" role="tabpanel" aria-labelledby="home-tab">
              <div className='mt-5'>
                <div>
                  <div style={sectionStyle}>
                    <label style={labelStyle}>Buy</label>
                    <div style={amountInputStyle}>
                      <span>UAXN</span>
                      <div style={currencyStyle}>
                          <span>Ethereum (ERC20)</span>
                      </div>
                    </div>
                    <small style={{ color: '#B0B0B0', fontWeight: "100" }}>Current balance: {parseFloat(BalanceAndPower.balance).toFixed(2)} UAXN</small>
                  </div>

                  <div className='mt-5' style={sectionStyle}>
                    <label style={labelStyle}>Amount <small style={{ float: "right", color: '#B0B0B0', fontWeight: "100" }}>1 USDT ~ {parseFloat(1/(parseFloat(coin_price))).toFixed(3)} UAXN</small></label>
                    <div style={amountInputStyle}>
                      <input
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        style={{ backgroundColor: 'transparent', border: 'none', color: 'white', flex: 1 }}
                      />
                      <div style={currencyStyle}>
                        <span>UAXN</span>
                      </div>
                    </div>
                    <small style={{ color: '#B0B0B0', fontWeight: "100" }}>{isNaN(parseFloat(amount))?0.00:(parseFloat(coin_price)*parseFloat(amount)).toFixed(2)} USDT</small>
                  </div>
                  <Button
                  onClick={handleBuyClick}
                    style={{ fontWeight: "900", width: "100%", minHeight: "6.5vh" }}
                    className="primary_btnn___ mt-4"
                    variant="primary"
                    type="submit"
                  >
                    Buy
                  </Button>
                  <center className='mt-3'>
                  {buy_msg && (
                    <div className="alert alert-success mt-3 text-center" role="alert">
                      {buy_msg}
                    </div>
                  )}
                  </center>
                </div>
              </div>
            </div> */}

                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                  <div className='mt-5'>
                    <div>
                      {pg_body ?
                        <>
                          <p className='' style={{ fontWeight: "900", fontSize: "20px" }}>Complete Payment</p>
                          <span style={{ color: "#b0b0b0" }}>You are requested to transfer exact amount entered excluding of the gas fees</span>


                          <div className='settings_box_0003____ my-4'>
                            <div className='row my-3 mx-3'>
                              <div className='col-lg-4 col-md-12 col-sm-12'>
                                <span>{isNaN(parseFloat(amount)) ? 0.00 : (parseFloat(coin_price) * parseFloat(amount)).toFixed(2)} USDT</span>
                              </div>
                              <div className='col-lg-8 col-md-12 col-sm-12'>
                                <span>Expiration Time</span>
                                <Timer />
                              </div>
                            </div>
                            <div className='row my-3 mx-3'>
                              <div className='col-lg-4 col-md-12 col-sm-12'>
                                <span>USDT(TRC20)</span>
                              </div>
                              <div className='col-lg-8 col-md-12 col-sm-12'>
                                <span style={{ wordBreak: "break-all" }}>{wallet_address_pg}</span>
                              </div>
                            </div>
                            <div
                              style={{
                                height: "auto",
                                margin: "0 auto",
                                maxWidth: 130,
                                width: "100%",
                                padding: 10,
                                // backgroundColor: "#fff",
                              }}
                            >
                              <QRCode
                                size={150}
                                value={wallet_address_pg}
                                logoImage="https://cloud.uax.network/static/media/uaxdlts.54db363e73bc62fa10bfa51a1cca4350.svg"
                                removeQrCodeBehindLogo={true}
                                qrStyle="dots"
                                logoOpacity="1"
                                logoWidth={40}
                                logoHeight={20}
                                logoPadding={10}
                                ecLevel="H"
                                eyeRadius={5}
                                eyeColor='#29c87b'
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
                          value={wallet_address_pg}
                          viewBox={`0 0 256 256`}
                          bgColor={"#fff"}
                          fgColor={"#000"}
                        /> */}
                            </div>
                            <center>
                              <Button
                                style={{ minWidth: "80%" }}
                                className="primary_btnn___ mt-3"
                                variant="primary"
                                type=""
                                onClick={CancelLastPayment}
                              >
                                Cancel
                              </Button>
                            </center>
                          </div>

                        </>
                        :
                        <>
                          <div style={sectionStyle}>
                            <label style={labelStyle}>Buy</label>
                            <div style={amountInputStyle}>
                              <span>UAXN</span>
                              <div style={currencyStyle}>
                                <span>USDT (TRC20)</span>
                              </div>
                            </div>
                            <div className='my-3'>
                              <label style={{ color: 'white', marginRight: '10px' }}>
                                <Button
                                  onClick={() => setBuyWithUsdt(false)}
                                  style={{ backgroundColor: buyWithUsdt ? "" : "#dd7aed" }}
                                  className="primary_btnn___"
                                  variant="primary"
                                >
                                  UAXN
                                </Button>
                                {/* UAXN */}
                              </label>
                              <label style={{ color: 'white' }}>
                                <Button
                                  onClick={() => setBuyWithUsdt(true)}
                                  style={{ backgroundColor: buyWithUsdt ? "#dd7aed" : "" }}
                                  className="primary_btnn___"
                                  variant="primary"
                                >
                                  USDT
                                </Button>
                              </label>
                            </div>
                            <div style={amountInputStyle}>
                              {buyWithUsdt ? (
                                <input
                                  type="number"
                                  value={usdtAmount || ""}
                                  placeholder="Enter USDT Amount"
                                  onChange={handleUsdtChange}
                                  style={{ backgroundColor: 'transparent', border: 'none', color: 'white', flex: 1 }}
                                />
                              ) : (
                                <input
                                  type="number"
                                  value={amount || ""}
                                  placeholder="Enter UAXN Amount"
                                  onChange={handleUaxnChange}
                                  style={{ backgroundColor: 'transparent', border: 'none', color: 'white', flex: 1 }}
                                />
                              )}
                              <div style={currencyStyle}>
                                <span>{buyWithUsdt ? "USDT" : "UAXN"}</span>
                              </div>
                            </div>
                            <small style={{ color: '#B0B0B0', fontWeight: "100" }}>
                              {buyWithUsdt
                                ? `${isNaN(parseFloat(usdtAmount)) ? 0.00 : (usdtAmount / coin_price).toFixed(3)} UAXN`
                                : `${isNaN(parseFloat(amount)) ? 0.00 : (amount * coin_price).toFixed(3)} USDT`}
                            </small>
                          </div>
                          {buttonDetails.buy_button_usdt_trc20 ? (
                            <Button
                              onClick={handleBuyClickAutomated}
                              style={{ fontWeight: "900", width: "100%", minHeight: "6.5vh" }}
                              className="primary_btnn___ mt-4"
                              variant="primary"
                              type="submit"
                            >
                              Proceed
                            </Button>
                          ) : (
                            <Button
                              style={{ fontWeight: "900", width: "100%", minHeight: "6.5vh" }}
                              className="primary_btnn___ mt-4"
                              variant="primary"
                              type="submit"
                              disabled
                            >
                              Proceed
                            </Button>
                          )}

                          <center className='mt-3'>
                            {buy_msg && (
                              <div className="alert alert-success mt-3 text-center" role="alert">
                                {buy_msg}
                                <>
                                  {timer_count && (
                                    <div>
                                      {timeLeft.minutes !== undefined && (
                                        <span>
                                          Pay after {" "}{timeLeft.minutes}:{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
                                        </span>
                                      )}
                                      {timeLeft.minutes === undefined && <span>Now you can make payment</span>}
                                    </div>
                                  )}
                                </>
                              </div>
                            )}
                          </center>
                        </>
                      }
                    </div>
                  </div>
                </div>

                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                  <div className='mt-5'>
                    <div>
                      <div style={sectionStyle}>
                        <label style={labelStyle}>Buy</label>
                        <div style={amountInputStyle}>
                          <span>UAXN</span>
                          <div style={currencyStyle}>
                            <span>Tron (TRC20)</span>
                          </div>
                        </div>
                        <small style={{ color: '#B0B0B0', fontWeight: "100" }}>Current balance: {(parseFloat(BalanceAndPower.balance) - parseFloat(reserved_balance)).toFixed(2)} UAXN</small>
                      </div>

                      {/* <div className='mt-5' style={sectionStyle}>
                  <label style={labelStyle}>Amount <small style={{ float: "right", color: '#B0B0B0', fontWeight: "100" }}>1 USDT ~ {parseFloat(1/(parseFloat(coin_price))).toFixed(3)} UAXN</small></label>
                    <div style={amountInputStyle}>
                      <input
                        type="text"
                          placeholder="Enter UAXN Amount"
                        onChange={handleAmountChangeTron}
                        style={{ backgroundColor: 'transparent', border: 'none', color: 'white', flex: 1 }}
                      />
                      <div style={currencyStyle}>
                          <span value="UAX">UAXN</span>
                      </div>
                    </div>
                    <small style={{ color: '#B0B0B0', fontWeight: "100" }}>{isNaN(parseFloat(amount_for_tron))?0.00:(parseFloat(coin_price)*parseFloat(amount_for_tron)).toFixed(2)} USDT</small>
                  </div> */}
                      <div className='mt-5' style={sectionStyle}>
                        <label style={labelStyle}>
                          Amount
                          <small style={{ float: "right", color: '#B0B0B0', fontWeight: "100" }}>
                            1 USDT ~ {parseFloat(1 / parseFloat(coin_price)).toFixed(3)} UAXN
                          </small>
                        </label>
                        <div className='my-3'>
                          <label style={{ color: 'white', marginRight: '10px' }}>
                            {/* <input 
        type="radio" 
        name="currency" 
        checked={!buyWithUsdt} 
        onChange={() => setBuyWithUsdt(false)} 
        style={{marginRight:"7px"}}
      /> */}
                            {/* UAXN */}
                            <Button
                              onClick={() => setBuyWithUsdt(false)}
                              style={{ backgroundColor: buyWithUsdt ? "" : "#dd7aed" }}
                              className="primary_btnn___"
                              variant="primary"
                            >
                              UAXN
                            </Button>
                          </label>
                          <label style={{ color: 'white' }}>
                            {/* <input 
        type="radio" 
        name="currency" 
        checked={buyWithUsdt} 
        onChange={() => setBuyWithUsdt(true)} 
        style={{marginRight:"7px"}}
      />
      USDT */}
                            <Button
                              onClick={() => setBuyWithUsdt(true)}
                              style={{ backgroundColor: buyWithUsdt ? "#dd7aed" : "" }}
                              className="primary_btnn___"
                              variant="primary"
                            >
                              USDT
                            </Button>
                          </label>
                        </div>
                        <div style={amountInputStyle}>
                          <input
                            type="text"
                            value={buyWithUsdt ? usdtAmountTron : amount_for_tron} // Dynamically bind the value
                            placeholder={`Enter ${buyWithUsdt ? "USDT" : "UAXN"} Amount`}
                            onChange={buyWithUsdt ? handleUsdtChangeTron : handleAmountChangeTron}
                            style={{ backgroundColor: 'transparent', border: 'none', color: 'white', flex: 1 }}
                          />
                          <div style={currencyStyle}>
                            <span>{buyWithUsdt ? "USDT" : "UAXN"}</span>
                          </div>
                        </div>
                        <small style={{ color: '#B0B0B0', fontWeight: "100" }}>
                          {buyWithUsdt
                            ? `${isNaN(parseFloat(usdtAmountTron)) ? 0.00 : (usdtAmountTron / coin_price).toFixed(3)} UAXN`
                            : `${isNaN(parseFloat(amount_for_tron)) ? 0.00 : (parseFloat(coin_price) * parseFloat(amount_for_tron)).toFixed(2)} USDT`}
                        </small>
                      </div>

                      {buttonDetails.buy_button_usdt_tronlink ?
                        <Button
                          style={{ fontWeight: "900", width: "100%", minHeight: "6.5vh" }}
                          className="primary_btnn___ mt-4"
                          variant="primary"
                          onClick={handleBuyFromTron}
                        // type="submit"
                        >
                          Buy
                        </Button>
                        :
                        <Button
                          style={{ fontWeight: "900", width: "100%", minHeight: "6.5vh" }}
                          className="primary_btnn___ mt-4"
                          variant="primary"
                          type="submit"
                          disabled
                        >
                          Buy
                        </Button>
                      }
                      <center className='mt-3'>
                        {buy_msg_tron && (
                          <div className="alert alert-success mt-3 text-center" role="alert">
                            {buy_msg_tron}
                          </div>
                        )}
                      </center>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                  {/* <div className='mt-5 text-center'>
                <img src={QR} alt="QR Code"/>
              </div> */}
                  <div className='mt-5'>
                    <div>
                      <div style={sectionStyle}>
                        <label style={labelStyle}>Buy</label>
                        <div style={amountInputStyle}>
                          <span>UAXN</span>
                          <div style={currencyStyle}>
                            <span>Binance (BEP20)</span>
                          </div>
                        </div>
                        <small style={{ color: '#B0B0B0', fontWeight: "100" }}>Current balance: {(parseFloat(BalanceAndPower.balance) - parseFloat(reserved_balance)).toFixed(2)} UAXN</small>
                      </div>

                      <div className='mt-5' style={sectionStyle}>
                        <label style={labelStyle}>Amount <small style={{ float: "right", color: '#B0B0B0', fontWeight: "100" }}>1 USDT ~ {parseFloat(1 / (parseFloat(coin_price))).toFixed(3)} UAXN</small></label>
                        <div style={amountInputStyle}>
                          <input
                            type="text"
                            value={amount_for_bsc}
                            onChange={handleAmountChangeBsc}
                            style={{ backgroundColor: 'transparent', border: 'none', color: 'white', flex: 1 }}
                          />
                          <div style={currencyStyle}>
                            <span value="UAX">UAXN</span>
                          </div>
                        </div>
                        <small style={{ color: '#B0B0B0', fontWeight: "100" }}>{isNaN(parseFloat(amount_for_bsc)) ? 0.00 : (parseFloat(coin_price) * parseFloat(amount_for_bsc)).toFixed(2)} USDT</small>
                      </div>
                      <Button
                        style={{ fontWeight: "900", width: "100%", minHeight: "6.5vh" }}
                        className="primary_btnn___ mt-4"
                        variant="primary"
                        onClick={handleBuyFromBsc}
                      >
                        Buy
                      </Button>
                      <center className='mt-3'>
                        <p>{buy_msg_bsc}</p>
                      </center>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-lg-6 col-md-12 col-sm-12 mt-2'>






          <div className='dashboard_box_001____ px-4' style={{ backgroundColor: "#222024" }}>
            <p className='mt-5' style={{ fontWeight: "900", fontSize: "20px" }}>Latest Transactions
              {/* <Link to="#">
                            <span style={{float:"right",fontSize:"15px",color:"#c006df"}}>
                                See all
                            </span>
                            </Link> */}
            </p>
            <br />
            <div style={{ height: "80vh", overflow: "scroll", width: '100vw' }}>
              <Table responsive style={tableStyle}>
                <tbody>
                  {Wallet_transactions.length > 0 ?
                    <>
                      {Wallet_transactions.map(index => {
                        if (index.network === 'ETH') {
                          return (
                            <tr key={index.timestamp}>
                              <td style={cellStyle} className='py-3'>
                                <div className='d-flex'>
                                  <img src={"https://images.uaxdlts.com/uax-dashboard/images/erc.svg"} style={{ width: "3rem" }} />
                                  <span style={{ fontWeight: "900", marginLeft: "8px" }}>USDT {index.status === 'Pending' ? <span style={{ color: "red" }}>Pending</span> : <span style={{ color: "green" }}>Approved</span>}
                                    <br />
                                    <a style={{ textDecoration: "none" }} href={`https://etherscan.io/tx/${index.txn_id}`} target="_blank">
                                      <small style={{ fontWeight: "100", color: "#f7f7f7" }}>
                                        Txid: {index.txn_id.slice(0, 8)}...{index.txn_id.slice(-8)}
                                      </small>
                                    </a>
                                  </span>
                                </div>
                              </td>
                              <td style={rightAlignCellStyle} className='py-3'>{parseFloat(index.amount).toFixed(2)} <br />
                                <small style={{ fontWeight: "100", color: "#f7f7f7" }}>{new Date(index.timestamp).toLocaleString()}</small>
                              </td>
                            </tr>
                          );
                        }
                        else {
                          return (
                            <tr key={index.timestamp}>
                              <td style={cellStyle} className='py-3'>
                                <div className='d-flex'>
                                  <img src={"https://images.uaxdlts.com/uax-dashboard/images/trc.svg"} style={{ width: "3rem" }} />
                                  <span style={{ fontWeight: "900", marginLeft: "8px" }}>USDT {index.status === 'Pending' ? <span style={{ color: "red" }}>Pending</span>
                                    :
                                    <>
                                      {index.status === 'Failed' ? <span style={{ color: "red" }}>Failed</span> : <span style={{ color: "green" }}>Approved</span>}
                                    </>
                                  }
                                    <br />
                                    {index.status === 'Pending' ?
                                      ''
                                      :
                                      <>
                                        {index.status === 'Failed' ?
                                          ''
                                          :
                                          <a style={{ textDecoration: "none" }} href={`https://tronscan.org/#/transaction/${index.txn_id}`} target="_blank">
                                            <small style={{ fontWeight: "100", color: "#f7f7f7" }}>
                                              Txid: {index.txn_id.slice(0, 8)}...{index.txn_id.slice(-8)}
                                            </small>
                                          </a>
                                        }
                                      </>
                                    }
                                  </span>
                                </div>
                              </td>
                              <td style={rightAlignCellStyle} className='py-3'>{parseFloat(index.amount).toFixed(2)} <br />
                                <small style={{ fontWeight: "100", color: "#f7f7f7" }}>{new Date(index.timestamp).toLocaleString()}</small>
                              </td>
                            </tr>
                          );
                        }
                      })}
                    </>
                    :
                    <tr>
                      <td colSpan="6" style={noDataStyle}>
                        <img src={"https://images.uaxdlts.com/uax-dashboard/images/NO_DATA.svg"} style={{ width: "6vw", position: "relative", top: "40%" }} />
                      </td>
                    </tr>
                  }

                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Buy;
