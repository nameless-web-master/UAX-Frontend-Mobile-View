import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Link } from "react-router-dom";

const noDataStyle = {
  textAlign: 'center',
  backgroundColor: 'transparent',
  borderBottom: "none",
  position: "relative"
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

const Buy = () => {
  const [amount, setAmount] = useState(0);
  const [email, setemail] = useState('');
  const [token, settoken] = useState('');
  const [BalanceAndPower, setBalanceAndPower] = useState('');
  const [loader, setloader] = useState(true);
  const [coin_price, setcoin_price] = useState(0);
  const [sell_msg, setsell_msg] = useState('');
  const [coin_net, set_coin_net] = useState('USDT-TRC');
  const [wallet_address, setwallet_address] = useState('');
  const [Wallet_transactions, setWallet_transactions] = useState([]);
  const [buttonDetails, setButtonDetails] = useState({
    buy_button_usdt_trc20: false,
    buy_button_usdt_tronlink: false,
    sell_button: false,
  });

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

  const handleAmountChange = (e) => {
    if (!e.target.value) {
      setAmount('');
    }
    else {
      setAmount(e.target.value);
    }
  };

  useEffect(() => {
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
        const responseToken = await axios.post('https://services.uaxwallet.com/api/verifyToken', {
          token,
          email
        });

        if (responseToken.data === "Token Expired") {
          localStorage.clear();
          window.location.href = '/login';
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const [price, balanceAndPower, walletTransactions, buttonDetails] = await Promise.all([
          axios.get("https://cmw.uax.network/get_current_price"),
          axios.post("https://services.uaxwallet.com/api/getUserBalanceAndPower", { email }, config),
          axios.post("https://services.uaxwallet.com/api/getUserBuySellTransactions", { email }, config),
          axios.post('https://services.uaxwallet.com/api/getBuySellButtonStatus', { email }, config)
        ]);

        setcoin_price(price.data.current_price);
        setBalanceAndPower(balanceAndPower.data);
        setwallet_address(walletAddress);
        setWallet_transactions(walletTransactions.data.sell_txns.length > 0 ? walletTransactions.data.sell_txns.reverse() : walletTransactions.data.sell_txns);
        setButtonDetails(buttonDetails.data.data)
        setloader(false);
      } catch (error) {
        console.error("Error during API calls:", error);
        window.location.href = "/login";
      }
    };

    initialFunction();
  }, []);


  const selectedCoinNet = async (e) => {
    set_coin_net(e.target.value)
  }

  const fetchWalletAddress = async () => {
    if (window.tronWeb && window.tronWeb.ready) {
      try {
        const address = window.tronWeb.defaultAddress.base58;
        return address;
        // console.log(address)
      } catch (error) {
        return 'Error fetching wallet address';
      }
    } else {
      return 'TronLink is not installed or not connected.';
    }
  }

  const handleClickSell = async () => {
    setsell_msg(<img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />)
    if (typeof window.ethereum !== 'undefined') {
      try {
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue) || amountValue <= 0) {
          setsell_msg("Invalid Amount")
          return;
        }
        // if(coin_net==='USDT-ERC'){
        //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        //     const account = accounts[0];
        //     // console.log(account)
        //     setsell_msg(account)
        // }
        else if (coin_net === 'USDT-TRC') {
          const account = await fetchWalletAddress();
          const config = {
            headers: { Authorization: `Bearer ${token}` }
          };
          const response = await axios.post("https://services.uaxwallet.com/api/pushSellTransaction", {
            recipientAddress: account,
            email: email,
            amount: isNaN(parseFloat(amount)) ? 0.00 : (parseFloat(coin_price) * parseFloat(amount)).toFixed(2),
            coins: amount,
            uaxn_wallet_address: wallet_address
          }, config)
          if (!response) {
            setsell_msg("Something went wrong, please try again later")
          }
          else {
            setsell_msg(response.data)
          }
          // setsell_msg(add)
        }
        // else{
        //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        //     const account = accounts[0];
        //     console.log(account)
        //     const config = {
        //         headers: { Authorization: `Bearer ${token}` }
        //       };
        //     const response = await axios.post("https://services.uaxwallet.com/api/pushSellTransaction",{
        //         recipientAddress:account,
        //         email:email,
        //         amount:isNaN(parseFloat(amount))?0.00:(parseFloat(coin_price)*parseFloat(amount)).toFixed(2),
        //         coins:amount,
        //         uaxn_wallet_address:wallet_address
        //     },config)
        //     if(!response){
        //         setsell_msg("Something went wrong, please try again later")
        //     }
        //     else{
        //         setsell_msg(response.data)
        //     }
        //     // setsell_msg(account)
        // }
      }
      catch (err) {
        setsell_msg("Error fetching account details")
      }
    }
    else {
      setsell_msg('MetaMask is not installed');
    }
  }


  return (
    <>
      <div className='row'>
        <div className='col-lg-6 col-md-12 col-sm-12 mt-2'>
          <div className='dashboard_box_001____ px-4'>
            <div className='my-5'>
              <p className='' style={{ fontWeight: "700", fontSize: "20px" }}>Swap</p>
              <span>Enter the number of UAX tokens that you want to swap, then click "Swap"</span>
              <div className='mt-5'>

                <div className="">
                  <div className="section">
                    <label className="label">Select Asset</label>
                    <div className="inputContainer ">
                      {/* <select className="currencySelect"> */}
                      <span value="UAX">UAXN</span>
                      {/* </select> */}
                    </div>
                    <label className="label">Amount</label>
                    <div className="inputContainer">
                      <input className="input" type="text" onChange={handleAmountChange} placeholder='Enter Amount' />
                      {/* <span className="maxButton">MAX</span> */}
                    </div>
                  </div>

                  <div className="swapIconContainer">
                    <span className="swapIcon">
                      <img src={"https://images.uaxdlts.com/uax-dashboard/images/swap (2).svg"} />
                    </span>
                  </div>

                  <div className="section">
                    <label className="label">Select Assets</label>
                    <div className="inputContainer">
                      <select className="currencySelect" onChange={selectedCoinNet} style={{ width: "100%" }}>
                        <option value="USDT-TRC">USDT (TRC20)</option>
                        {/* <option value="USDT-TRC">USDT (TRC20)</option>
                                    <option value="USDT-BEP">USDT (BEP20)</option> */}
                      </select>
                    </div>
                    <label className="label">Amount</label>
                    <div className="inputContainer">
                      <input className="input" type="text" value={isNaN(parseFloat(amount)) ? 0.00 : (parseFloat(coin_price) * parseFloat(amount)).toFixed(2)} readOnly />
                      {/* <span className="maxButton">MAX</span> */}
                    </div>
                    <div className="flex" style={{ textAlign: "right" }}>
                      <small style={{ fontSize: "13px", color: "red" }}>Min : 10 USDT Max : 25000 USDT</small>
                    </div>
                  </div>

                  <div className="conversionRate mt-4">
                    <small>Conversion Rate</small>
                    <small>1 USDT ~ {parseFloat(1 / (parseFloat(coin_price))).toFixed(3)} UAX</small>
                  </div>
                  <br /><br />
                  {buttonDetails.sell_button ?
                    <div className='sell_button_class____'>
                      <Button
                        style={{ fontWeight: "900", width: "100%", minHeight: "" }}
                        className="primary_btnn___ mt-4"
                        variant="primary"
                        // type="submit"
                        onClick={handleClickSell}
                      >
                        Swap
                      </Button>
                      {sell_msg && (
                        <div className="alert alert-success mt-3 text-center" role="alert" style={{ wordBreak: "break-all" }}>
                          {sell_msg}
                        </div>
                      )}
                    </div>
                    :
                    <div className='sell_button_class____'>
                      <Button
                        style={{ fontWeight: "900", width: "100%", minHeight: "" }}
                        className="primary_btnn___ mt-4"
                        variant="primary"
                        disabled
                      >
                        Swap
                      </Button>
                    </div>
                  }
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className='col-lg-6 col-md-12 col-sm-12 mt-2'>
          <div className='dashboard_box_001____ px-4' style={{ backgroundColor: "#222024", height: "100%", overflow: "scroll" }}>
            <p className='mt-5' style={{ fontWeight: "700", fontSize: "20px" }}>Latest Transactions
              <Link to="#">
                {/* <span style={{float:"right",fontSize:"15px",color:"#c006df"}}>
                                See all
                            </span> */}
              </Link>
            </p>
            <br />
            <div style={{ height: "80vh", overflow: "scroll", width: '1' }}>
              <Table responsive style={tableStyle}>
                <tbody>
                  {Wallet_transactions.length > 0 ?
                    <>
                      {Wallet_transactions.map(index => {
                        // if (index.network === 'ETH') {
                        //   return (
                        //     <tr key={index.timestamp}>
                        //       <td style={cellStyle} className='py-3'>
                        //         <div className='d-flex'>
                        //             <img src={ERC} style={{width:"3rem"}}/>
                        //         <span style={{ fontWeight: "900", marginLeft: "8px" }}>USDT {index.status==='Pending'?<span style={{color:"red"}}>Pending</span>:<span style={{color:"green"}}>Approved</span>}
                        //         <br/>
                        //         <a style={{textDecoration:"none"}} href={`https://tronscan.org/#/transaction/${index.trx_txn_id}`} target="_blank">
                        //             <small style={{fontWeight: "100", color: "#969696" }}>
                        //             {index.trx_txn_id.slice(0,8)}...{index.trx_txn_id.slice(-8)}
                        //             </small>
                        //         </a>
                        //         </span>
                        //         </div>
                        //       </td>
                        //       <td style={rightAlignCellStyle} className='py-3'>{parseFloat(index.amount).toFixed(2)} <br />
                        //         <small style={{ fontWeight: "100", color: "#969696" }}>{new Date(index.timestamp).toLocaleString()}</small>
                        //       </td>
                        //     </tr>
                        //   );
                        // } 
                        // else{
                        return (
                          <tr key={index.timestamp}>
                            <td style={cellStyle} className='py-3'>
                              <div className='d-flex'>
                                <img src={"https://images.uaxdlts.com/uax-dashboard/images/trc.svg"} style={{ width: "3rem" }} />
                                <span style={{ fontWeight: "900", marginLeft: "8px" }}>USDT {index.status === 'Pending' ? <span style={{ color: "red" }}>Pending</span> : <span style={{ color: "green" }}>Approved</span>}
                                  <br />
                                  <a style={{ textDecoration: "none" }} href={`https://tronscan.org/#/transaction/${index.trx_txn_id}`} target="_blank">
                                    <small style={{ fontWeight: "100", color: "#969696" }}>
                                      {index.trx_txn_id.slice(0, 8)}...{index.trx_txn_id.slice(-8)}
                                    </small>
                                  </a>
                                </span>
                              </div>
                            </td>
                            <td style={rightAlignCellStyle} className='py-3'>{parseFloat(index.amount).toFixed(2)} <br />
                              <small style={{ fontWeight: "100", color: "#969696" }}>{new Date(index.timestamp).toLocaleString()}</small>
                            </td>
                          </tr>
                        );
                        // }
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
