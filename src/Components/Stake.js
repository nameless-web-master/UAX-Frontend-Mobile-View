import React, { useState, useEffect, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import PowerSettingsNewIcon from '@mui/icons-material/Bolt';
import Reward from '@mui/icons-material/EmojiEvents';
import { Modal, Form } from "react-bootstrap"; // Add Modal, Form import if not already
import Table from 'react-bootstrap/Table';
import ReactPaginate from 'react-paginate';

const noDataStyle = {
    textAlign: 'center',
    height: '55vh',
    backgroundColor: '#000',
    borderBottom:"none",
    position:"relative"
  };
  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
  };
  
  const cellStyle = {
    border: 'none',
    backgroundColor: 'transparent',
    padding: '20px',
    color: '#fff',
  };


const Stake = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [balanceAndPower, setBalanceAndPower] = useState('');
    const [loader, setLoader] = useState(true);
    const [walletAddress, setWalletAddress] = useState('');
    // const [amount, setAmount] = useState(0);
    // const [powerEquivalentToOneCoin, setPowerEquivalentToOneCoin] = useState(0);
    const [powerPerTxn, setPowerPerTxn] = useState('');
    const [msg, setMsg] = useState('');
    const [stakedAmtState, setStakedAmtState] = useState('');
    const [stakedDevices, setstakedDevices] = useState(0);
    const [earnedAmtState, setEarnedAmtState] = useState(0);
    const [generatedPower, setGeneratedPower] = useState(0);
    const [reserved_power, setreserved_power] = React.useState(0);
    const [reserved_balance, setreserved_balance] = React.useState(0);

    const [showValidatorKey, setshowValidatorKey] = useState('');
    const [validator_loader, setvalidator_loader] = useState(true);
    const [software_unique_key, setsoftware_unique_key] = useState('');
    const [registered_uuid, setregistered_uuid] = useState('');
    const [stake_amount, setstake_amount] = useState(0);
    const [coinPrice, setCoinPrice] = useState(0);
    const [stakeHistory, setstakeHistory] = useState([]);
      const [otpmodal, setotpmodal] = useState(false);



    const [entered_machine_id, setentered_machine_id] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [msgs, setMsgs] = useState('');

    const transactionsPerPage = 10;
      const [currentPage, setCurrentPage] = useState(0);
      const [displayTransactions, setdisplayTransactions] = useState([]);

    
    const openModal = () => setShowModal(true);
    const closeModal = () => {
        setShowModal(false);
        setMsgs("")
    }
    const handleClose = () => {
        setotpmodal(false);
      };
    
    // console.log("software_unique_key",software_unique_key)

    const fetchMachineID = async (validatorKey) => {
        try {
          const response = await axios.post(`https://webservices.uaxwallet.com/get_my_machine_id`,{validator_key:validatorKey});
          return response.data.message;
        } catch (error) {
          console.error('Error fetching machine ID:', error);
          return 'Error';
        }
    };

    const fetchallValidatorKeys = async() =>{
        var token = localStorage.getItem("token")
        var email = localStorage.getItem("email")
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const fetch_validator_key = await axios.post("https://services.uaxwallet.com/api/fetch_validator_key",{
          email:email
        },config)
        // console.log(fetch_validator_key.data)
        if(fetch_validator_key.data.success){
          var keys = []
          if(fetch_validator_key.data.validator_keys.length>0){
            // for(let i=0;i<fetch_validator_key.data.validator_keys.length;i++){
            //   const machine_id = await fetchMachineID(fetch_validator_key.data.validator_keys[i])
              // console.log(fetch_validator_key.data.validator_keys[i])
            //   keys.push({machine_id:machine_id,validator_key:fetch_validator_key.data.validator_keys[i]})
              setshowValidatorKey(fetch_validator_key.data.validator_keys)
              setsoftware_unique_key(fetch_validator_key.data.validator_keys)
            //   if(i==fetch_validator_key.data.validator_keys.length){
                setvalidator_loader(false)
            //   }
            // }
          }
          setvalidator_loader(false)
        }
        else{
          setshowValidatorKey('')
          setvalidator_loader(false)
        }
    }

    const StakeNow = async () => {
        setotpmodal(false)
        setMsg(<img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />);
        if (parseFloat(stake_amount) >= (10/parseFloat(coinPrice)).toFixed(2)) {
            if(software_unique_key.length>0){
                if(registered_uuid.length>0){
                    if(walletAddress.length>0){
                        try {
                            const config = { headers: { Authorization: `Bearer ${token}` } };
                            const stakeResp = await axios.post("https://services.uaxwallet.com/api/stakeNow", {
                                software_unique_key: software_unique_key,
                                address:walletAddress,
                                registered_uuid:registered_uuid,
                                stake_amount:stake_amount,
                                email
                            }, config);
                            setMsg(stakeResp.data.message)
                        } catch (error) {
                            setMsg("An error occurred, please try again later");
                        }
                    }
                    else{
                        setMsg("Unable to fetch wallet address");
                    }
                }
                else{
                    setMsg("Invalid machine ID");
                }
            }
            else{
                setMsg("Invalid validator key");
            }
        } else {
            setMsg(`Stake amount must be greater than or equal to ${(10/parseFloat(coinPrice)).toFixed(2)} UAXN`);
        }
    };

    const handleUnstake = async () => {
        if (entered_machine_id.length > 0) {
          setMsgs(<img src="https://images.uaxdlts.com/uax-dashboard/images/loader3.gif" style={{ width: "3vw" }} />);
          try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const stakeResp = await axios.post("https://services.uaxwallet.com/api/UnStakeNow", {
              registered_uuid: entered_machine_id,
              email
            }, config);
            setMsgs(stakeResp.data.message);
            setTimeout(()=>{
                closeModal(); 
            },3000)
            // closeModal(); 
          } catch (error) {
            setMsgs("An error occurred, please try again later");
          }
        }
        else{
            setMsgs("Please enter a valid machine ID")
        }
      };

    const fetchData = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const email = localStorage.getItem("email");
            if (token && email) {
                setEmail(email);
                setToken(token);
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const [
                    verifyTokenResponse,
                    priceResponse,
                    balanceAndPowerResponse,
                    walletResponse,
                    powerConsumptionResponse,
                    combined_wallet_response,
                    getSummary,
                ] = await Promise.all([
                    axios.post('https://services.uaxwallet.com/api/verifyToken', { token, email }),
                    axios.get("https://cmw.uax.network/get_current_price"),
                    axios.post("https://services.uaxwallet.com/api/getUserBalanceAndPower", { email }, config),
                    axios.post('https://services.uaxwallet.com/api/getUserWallet', { email }, config),
                    axios.get("https://cmw.uax.network/estimate_bandwidth"),
                    axios.post("https://webservices.uaxwallet.com/get_combined_wallet_info", { wallet_address: walletAddress }),
                    axios.post("https://services.uaxwallet.com/api/getNFTsAndOffersSummary",{
                        email
                      },config)
                ]);
                // console.log("walletAddress",walletAddress)

                // console.log(combined_wallet_response.data)

                if (verifyTokenResponse.data === "Token Expired") {
                    localStorage.clear();
                    window.location.href = '/login';
                } else {
                    setCoinPrice(priceResponse.data.current_price);
                    setBalanceAndPower(balanceAndPowerResponse.data);
                    setreserved_power((parseFloat(getSummary.data.totalAskAmounts)*212)+(parseFloat(getSummary.data.totalNFTsListedForSell)*212))
                    setreserved_balance((parseFloat(getSummary.data.totalBidAmount)))
                    setWalletAddress(walletResponse.data);
                    setPowerPerTxn(powerConsumptionResponse.data);
                    setStakedAmtState(isNaN(combined_wallet_response.data.stakedAmount) ? 0 : combined_wallet_response.data.stakedAmount);
                    setEarnedAmtState(isNaN(combined_wallet_response.data.earningsFromStake) ? 0 : combined_wallet_response.data.earningsFromStake);
                    setGeneratedPower(isNaN(combined_wallet_response.data.generatedPower) ? 0 : combined_wallet_response.data.generatedPower);
                    setstakedDevices(isNaN(combined_wallet_response.data.totalDevices) ? 0 : combined_wallet_response.data.totalDevices);
                    setstakeHistory(combined_wallet_response.data.Stakes ? [] : combined_wallet_response.data.Stakes)
                    setLoader(false);
                    // console.log("combined_wallet_response.data.Stakes",combined_wallet_response.data)
                    waitForDetails(combined_wallet_response.data.Stakes);
                }
            } else {
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("An error occurred while fetching data", error);
        }
    }, [walletAddress]);

    useEffect(() => {
        fetchData();
        fetchallValidatorKeys();
    }, [fetchData]);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
      };

    const waitForDetails = (data) =>{
        setdisplayTransactions(data.slice(currentPage * transactionsPerPage, (currentPage + 1) * transactionsPerPage));
         console.log("stakeHistory",data)
    }
    
    return (
        <>
            <div className="container" style={{ minHeight: "100vh" }}>
                <div className='mt-3'>
                    <div className='dashboard_box_001____ px-4 mb-4'>
                        <div className='my-5 for_device_difference____mx_5____'>
                            <p style={{ fontWeight: "900", fontSize: "20px" }}>Staking Information</p>
                            <div className='mt-4'>
                                <div className='row'>
                                    <div className='col-lg-3 col-md-6 col-sm-6 mt-2'>
                                        <div className="section_balance_and_stake____">
                                            <span style={{ fontWeight: "500" }}>Balance</span><br />
                                            <img src={"https://images.uaxdlts.com/uax-landing/assets/images/logo/uax%20favicon.png"} style={{ width: "18px" }} />
                                            <span style={{ color: "#0ce456", fontSize: "18px", marginLeft: "10px", fontWeight: "900" }}>
                                                {loader ? <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} /> : `${(parseFloat(balanceAndPower.balance)-parseFloat(reserved_balance)).toFixed(3)} UAXN`}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='col-lg-3 col-md-6 col-sm-6 mt-2'>
                                        <div className="section_balance_and_stake_brown____">
                                            <span style={{ fontWeight: "500" }}>Staked / Validators</span><br />
                                            <img src={"https://images.uaxdlts.com/uax-dashboard/images/mining .svg"} style={{ width: "18px" }} />
                                            <span style={{ color: "#f99f1b", fontSize: "18px", marginLeft: "10px", fontWeight: "900" }}>
                                                {loader ? <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} /> : `${stakedAmtState || 0} / ${stakedDevices || 0}`}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='col-lg-3 col-md-6 col-sm-6 mt-2'>
                                        <div className="section_balance_and_stake_white____">
                                            <span style={{ fontWeight: "500" }}>Generated Bandwidth</span><br />
                                            <PowerSettingsNewIcon style={{ color: "#fff" }} />
                                            <span style={{ color: "#fff", fontSize: "18px", marginLeft: "5px", fontWeight: "900" }}>
                                                {loader ? <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} /> : `${parseFloat(generatedPower).toFixed(2)}`}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='col-lg-3 col-md-6 col-sm-6 mt-2'>
                                        <div className="section_balance_and_stake_blue____">
                                            <span style={{ fontWeight: "500" }}>Stake Rewards</span><br />
                                            <Reward style={{ color: "#fff" }} />
                                            <span style={{ color: "#447be1", fontSize: "18px", marginLeft: "5px", fontWeight: "900" }}>
                                                {loader ? <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} /> : `${parseFloat(earnedAmtState).toFixed(2)} UAXN`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='dashboard_box_001____ px-4 mb-4'>
                        <div className='my-5 for_device_difference____mx_5____'>
                            <span style={{ fontWeight: "900", fontSize: "20px" }}>Need reward? Stake Now!</span>
                            <div className='mt-5'>
                                <div className="section_resources_____">
                                    {/* <label className="label">
                                        <Tooltip title="Power is essential in UAX blockchain for processing transactions and ensuring network security.">
                                            <InfoIcon style={{ color: "#863593", marginRight: "5px" }} />
                                        </Tooltip>
                                        Power
                                        <span className="horizontal-line"></span>
                                        <span style={{ float: "right" }}>
                                            {loader ? <img src={WhiteLoader} style={{ width: "2vw" }} /> : `${powerEquivalentToOneCoin * (amount || 0).toFixed(2)}`}
                                        </span>
                                    </label> */}
                                    <small style={{ marginLeft: "20px", color: "#fff",fontSize:"17px" }}>
                                        {/* {powerPerTxn} */}
                                        Estimated Fees : 424 BANDWIDTH
                                    </small>
                                    <br />
                                    <br />
                                    <small style={{ marginLeft: "20px", color: "#fff",fontSize:"17px" }}>
                                        Available Bandwidth
                                        <span style={{ float: "right", color: "#fff",fontSize:"17px" }}>{(parseFloat(balanceAndPower.bandwidth)-parseFloat(reserved_power)).toFixed(2)}</span>
                                    </small>
                                </div>
                                <div className='mt-5'>
                                    <p style={{ fontWeight: "600" }}>Get resources Bandwidth with UAXN</p>
                                    <div className="row">
                                        <div className="col-lg-4 col-md-12 col-sm-12 mt-2">
                                            <div style={{ display: 'block', alignItems: 'center', backgroundColor: '#211f24', borderRadius: '5px', padding: '6px 16px' }}>
                                                <select
                                                    className="w-100 no-arrow"
                                                    style={{ color: "#fff", backgroundColor: "transparent",border:"none" }}
                                                      onChange={(e) => {
                                                        const selectedKey = e.target.value;
                                                        setsoftware_unique_key(selectedKey); 
                                                        setMsg('')
                                                      }}
                                                    >
                                                    {/* <option value="" disabled selected>
                                                        Select Validator Key
                                                    </option> */}
                                                    <option key={showValidatorKey} value={showValidatorKey === "Key not found" || 'Error' ? showValidatorKey : ''}>
                                                            {showValidatorKey === "Key not found" || 'Error' ? showValidatorKey : ''}
                                                        </option>
                                                    {/* {showValidatorKey} */}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-12 col-sm-12 mt-2">
                                            <div style={{ display: 'block', alignItems: 'center', backgroundColor: '#211f24', borderRadius: '5px', padding: '6px 16px' }}>
                                            <input
                                                    type="text"
                                                    onChange={(e)=>{ 
                                                        setregistered_uuid(e.target.value);
                                                        setMsg('') }}
                                                    placeholder='Enter Machine ID'
                                                    style={{ backgroundColor: 'transparent', border: 'none', color: 'white', flex: 1 }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-12 col-sm-12 mt-2">
                                            <div style={{ display: 'block', alignItems: 'center', backgroundColor: '#211f24', borderRadius: '5px', padding: '6px 16px' }}>
                                                <input
                                                    type="number"
                                                    onChange={(e)=>{
                                                        setstake_amount(e.target.value);
                                                        setMsg('')}}
                                                    placeholder='Enter UAXN Amount to Stake'
                                                    style={{ backgroundColor: 'transparent', border: 'none', color: 'white', flex: 1 }}
                                                />
                                            </div>
                                            <small>Minimum : {(10/parseFloat(coinPrice)).toFixed(2)} UAXN ~ $10</small>
                                        </div>
                                        <div className="small-box mt-4 text-center">
                                            <Button
                                                className="primary_btnn___ mt-2"
                                                variant="primary"
                                                onClick={(e)=>setotpmodal(true)}
                                                style={{marginRight:"10px"}}
                                            >
                                                Stake Now!
                                            </Button>
                                            <a href="https://uaxscan.com/stake" target='_blank'>
                                            <Button
                                                className="primary_btnn___ mt-2"
                                                variant="primary"
                                                // onClick={StakeNow}
                                                style={{marginRight:"10px"}}
                                            >
                                                Calculate Reward
                                            </Button>
                                            </a>
                                            {/* <Button
                                                className="primary_btnn___ mt-2"
                                                variant="primary"
                                                onClick={openModal}
                                            >
                                                Unstake
                                            </Button> */}
                                        </div>
                                    </div>
                                    <center>
                                        {msg && <div className="alert alert-success mt-3" role="alert">{msg}</div>}
                                    </center>
                                </div>
                            </div>
                        </div>
                    </div>
                    


                    <div className='dashboard_box_001____ px-4' style={{ minHeight: "", position: "relative", maxWidth: "80vw" }}>
              <div className='my-4'>
                <p className='' style={{ fontWeight: '900', fontSize: '20px' }}>
                  Stake History
                </p>
                {/* <small>Last 100 Transactions</small> */}
                <div className='mt-5'>
                  <div className=''>
                    <Table responsive style={tableStyle}>
                      <tbody>
                        <th className='table_header_class____'>Validator Key</th>
                        <th className='table_header_class____'>Machine ID</th>
                        <th className='table_header_class____'>Date</th>
                        <th className='table_header_class____'>Amount</th>
                        <th className='table_header_class____'>Status</th>
                        {displayTransactions.length>0?
                          <>
                            {displayTransactions.map((index) => {
                            return (
                              <tr className='customized_row____'>
                                <td style={cellStyle}>{index.software_unique_key}</td>
                                <td style={cellStyle}>{index.registered_uuid}</td>
                                <td style={cellStyle}>{new Date(parseFloat(index.timestamp)).toLocaleDateString()}</td>
                                <td style={cellStyle}>
                                  <span style={{ color: '#31bf24' }}>{parseFloat(index.stake_amount)} UAXN</span>
                                </td>
                                <td style={cellStyle}>
                                 {index.stake_payment_status === "Done" && index.max_stake_bal === "Within Limit"?"Active":"Unstaked"}
                                </td>
                              </tr>
                            );
                        })}
                          </>
                          :
                          <tr>
                          <td colSpan="6" style={noDataStyle}>
                              <img src={"https://images.uaxdlts.com/uax-dashboard/images/NO_DATA.svg"} style={{ width: "6vw",position:"relative",top:"40%" }} />
                          </td>
                          </tr>
                        }
                      
                      </tbody>
                    </Table>
                  </div>
                  {displayTransactions.length>0?
                  <div className='pagination-container'>
                    <ReactPaginate
                      previousLabel={'Previous'}
                      nextLabel={'Next'}
                      breakLabel={'...'}
                      pageCount={Math.ceil(stakeHistory.length / transactionsPerPage)}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'}
                    />
                  </div>
                  :
                  ''
                  }
                </div>
              </div>
            </div>





                </div>
            </div>
            <Modal show={showModal} onHide={closeModal}>
        {/* <Modal.Header closeButton>
        </Modal.Header> */}
        <Modal.Body style={{ padding: '5%', border: 'none', color: '#fff', backgroundColor: '#1a181b' }}>
          <Form>
            <Form.Group controlId="machineId">
              <Form.Label>Machine ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your Machine ID"
                value={entered_machine_id}
                onChange={(e) => setentered_machine_id(e.target.value)}
              />
            </Form.Group>
          </Form>
          <center>
          {msgs && <div className="mt-2">{msgs}</div>}
          <Button   style={{
                color: 'white',
                backgroundColor: '#c006de',
                border: 'none',
                minHeight: '5.5vh',
                minWidth: '9rem',
                borderRadius: '.25rem',
                fontWeight: '600',
                marginTop: '20px',
              }} onClick={handleUnstake}>
            Submit
          </Button>
          </center>
        </Modal.Body>
      </Modal>

       <Modal className='modal__content' size="lg"
             show={otpmodal} onHide={handleClose}>
                     <Modal.Header closeButton style={{borderBottom:"none",backgroundColor:"#000"}}>
                     </Modal.Header>
                     <center style={{backgroundColor:"#000"}}>
                     <p style={{ fontWeight: '700', fontSize: '20px', marginTop: '15px',color:"#fff" }}>Staking Policy and User Responsibilities</p>
                     </center>
              <Modal.Body className="" style={{maxHeight:"60vh",overflow:"scroll" ,backgroundColor:"#000",padding: '5%', border: 'none', color: '#fff',backgroundSize:"cover" }}>
                <center>
                
                  <div className='text-left' style={{textAlign:"left"}}>
                  <p>
                  To participate in running a full chain node as a validator, users are required to stake a minimum of $10 worth of UAXN tokens. This ensures commitment to the network and helps maintain its integrity. Upon staking, the tokens will be locked for a period of one year, during which they cannot be withdrawn or moved. Validators must also adhere to strict protocol rules — a single validator key cannot be used on multiple machines simultaneously. Doing so is considered a serious protocol violation and will result in slashing, meaning a portion or all of the staked amount may be forfeited. In an ideal and uninterrupted validating environment, a validator can submit up to 3,153,600 shares annually, contributing significantly to the network's consensus and earning rewards proportionally.
                  </p>
                  </div>
                </center>
              </Modal.Body>
              <Modal.Footer style={{backgroundColor:"#000",display:"unset",border:"none"}}>
                <center>
              <button
                    onClick={StakeNow}
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
                    I Agree
                  </button>
                  </center>
        </Modal.Footer>
            </Modal>
        </>
    );
};

export default Stake;
