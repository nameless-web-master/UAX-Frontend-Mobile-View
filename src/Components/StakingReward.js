import React, { useState, useEffect, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import PowerSettingsNewIcon from '@mui/icons-material/Bolt';
import Reward from '@mui/icons-material/EmojiEvents';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

const inputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#211f24',
    borderRadius: '5px',
    padding: '6px 16px'
};

const currencyStyle = {
    marginLeft: '8px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    borderLeft: '2px solid #38363a'
};

const amountInputStyle = {
    ...inputContainerStyle,
    justifyContent: 'space-between'
};

const StakingReward = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [coinPrice, setCoinPrice] = useState(0);
    const [balanceAndPower, setBalanceAndPower] = useState('');
    const [loader, setLoader] = useState(true);
    const [walletAddress, setWalletAddress] = useState('');
    const [amount, setAmount] = useState(0);
    const [powerEquivalentToOneCoin, setPowerEquivalentToOneCoin] = useState(0);
    const [powerPerTxn, setPowerPerTxn] = useState('');
    const [msg, setMsg] = useState('');
    const [stakedAmtState, setStakedAmtState] = useState('');
    const [stakedDevices, setstakedDevices] = useState(0);
    const [earnedAmtState, setEarnedAmtState] = useState(0);
    const [generatedPower, setGeneratedPower] = useState(0);
    const [combined_info, setcombined_info] = useState('');
    const [reserved_power, setreserved_power] = React.useState(0);
    const [reserved_balance, setreserved_balance] = React.useState(0);

    const handleAmountChange = (e) => {
        const value = parseFloat(e.target.value);
        setAmount(value > 0 ? value : '');
    };

    const getPower = async () => {
        setMsg(<img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />);
        if (amount > 0) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const purchasePowerResponse = await axios.post("https://services.uaxwallet.com/api/userPurchasePower", {
                    power_amt: amount.toFixed(2),
                    email
                }, config);
                // console.log("purchasePowerResponse",purchasePowerResponse)
                if (purchasePowerResponse) {
                    if (!purchasePowerResponse.data.note) {
                        setMsg(purchasePowerResponse.data);
                        setTimeout(() => {
                            fetchData();
                        }, 3000)
                    }
                    else {
                        setMsg("Bandwidth purchase completed");
                    }
                } else {
                    setMsg("Something went wrong, please try again later");
                }
            } catch (error) {
                setMsg("An error occurred, please try again later");
            }
        } else {
            setMsg("Invalid Amount");
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
                    power_rate
                ] = await Promise.all([
                    axios.post('https://services.uaxwallet.com/api/verifyToken', { token, email }),
                    axios.get("https://cmw.uax.network/get_current_price"),
                    axios.post("https://services.uaxwallet.com/api/getUserBalanceAndPower", { email }, config),
                    axios.post('https://services.uaxwallet.com/api/getUserWallet', { email }, config),
                    axios.get("https://cmw.uax.network/estimate_bandwidth"),
                    axios.post("https://webservices.uaxwallet.com/get_combined_wallet_info", { wallet_address: walletAddress }),
                    axios.post("https://services.uaxwallet.com/api/getNFTsAndOffersSummary", {
                        email
                    }, config),
                    axios.get("https://cmw.uax.network/buy_bandwidth_thrugh_uaxn")
                ]);

                if (verifyTokenResponse.data === "Token Expired") {
                    localStorage.clear();
                    window.location.href = '/login';
                } else {
                    setCoinPrice(priceResponse.data.current_price);
                    setBalanceAndPower(balanceAndPowerResponse.data);
                    setreserved_power((parseFloat(getSummary.data.totalAskAmounts) * 212) + (parseFloat(getSummary.data.totalNFTsListedForSell) * 212))
                    setreserved_balance((parseFloat(getSummary.data.totalBidAmount)))
                    setWalletAddress(walletResponse.data);
                    setPowerPerTxn(powerConsumptionResponse.data);
                    setStakedAmtState(isNaN(combined_wallet_response.data.stakedAmount) ? 0 : combined_wallet_response.data.stakedAmount);
                    setEarnedAmtState(isNaN(combined_wallet_response.data.earningsFromStake) ? 0 : combined_wallet_response.data.earningsFromStake);
                    setGeneratedPower(isNaN(combined_wallet_response.data.generatedPower) ? 0 : combined_wallet_response.data.generatedPower);
                    setstakedDevices(isNaN(combined_wallet_response.data.totalDevices) ? 0 : combined_wallet_response.data.totalDevices);
                    setPowerEquivalentToOneCoin((parseFloat(power_rate.data)).toFixed(2))
                    setAmount(215 / parseFloat(power_rate.data))
                    setLoader(false);
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
    }, [fetchData]);
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
                                                {loader ? <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} /> : `${(parseFloat(balanceAndPower.balance) - parseFloat(reserved_balance)).toFixed(3)} UAXN`}
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
                    <div className='dashboard_box_001____ px-4'>
                        <div className='my-5 for_device_difference____mx_5____'>
                            <span style={{ fontWeight: "900", fontSize: "20px" }}>Need resources? Get Bandwidth</span>
                            <div className='mt-5'>
                                <div className="section_resources_____">
                                    <label className="label">
                                        <Tooltip title="Bandwidth is essential in UAX blockchain for processing transactions and ensuring network security.">
                                            <InfoIcon style={{ color: "#863593", marginRight: "5px" }} />
                                        </Tooltip>
                                        Bandwidth
                                        <span className="horizontal-line"></span>
                                        <span style={{ float: "right" }}>
                                            {loader ? <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} /> : `${powerEquivalentToOneCoin * (amount || 0).toFixed(2)}`}
                                        </span>
                                    </label>
                                    <small style={{ marginLeft: "20px", color: "#fff", fontSize: "17px" }}>
                                        {powerPerTxn}
                                    </small>
                                    <br />
                                    <br />
                                    <small style={{ marginLeft: "20px", color: "#fff", fontSize: "17px" }}>
                                        Available Bandwidth
                                        <span style={{ float: "right", color: "#fff", fontSize: "17px" }}>{(parseFloat(balanceAndPower.bandwidth) - parseFloat(reserved_power)).toFixed(2)}</span>
                                    </small>
                                </div>
                                <div className='mt-5'>
                                    <p style={{ fontWeight: "600" }}>Get resources Bandwidth with UAXN</p>
                                    <div className="d-flex align-items-center flex-wrap responsive-container">
                                        <div
                                            className="p-2 width-full-1050"
                                            style={{
                                                minWidth: 156
                                            }}
                                        >
                                            <div style={{
                                                display: 'block',
                                                alignItems: 'center',
                                                backgroundColor: '#211f24',
                                                borderRadius: '5px',
                                                padding: '6px 16px',
                                                minWidth: 140
                                            }}>
                                                <PowerSettingsNewIcon style={{ color: "#fff" }} />
                                                <span style={{ color: "#a0a0a0" }}>Bandwidth</span>
                                            </div>
                                        </div>
                                        <div
                                            className='d-flex flex-row flex-wrap'
                                            style={{
                                                flex: 1
                                            }}
                                        >
                                            <div
                                                className="large-box p-2"
                                            >
                                                <div style={amountInputStyle}>
                                                    <input
                                                        type="number"
                                                        value={amount}
                                                        onChange={handleAmountChange}
                                                        placeholder='Enter UAXN Amount'
                                                        style={{ backgroundColor: 'transparent', border: 'none', color: 'white', flex: 1 }}
                                                    />
                                                    <div style={currencyStyle}>
                                                        <span style={{ marginLeft: "8px" }}>UAXN</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="large-box p-2"
                                            >
                                                <div style={amountInputStyle}>
                                                    <span style={{ color: "#a0a0a0" }}>
                                                        {loader ? <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} /> : walletAddress}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="p-2 width-full-1050"
                                            style={{
                                                minWidth: 156
                                            }}
                                        >
                                            <Button
                                                style={{
                                                    width: "100%",
                                                    minWidth: 140
                                                }}
                                                className="primary_btnn___"
                                                variant="primary"
                                                onClick={getPower}
                                            >
                                                Get Bandwidth
                                            </Button>
                                        </div>
                                    </div>
                                    <center>
                                        {msg && <div className="alert alert-success mt-3" role="alert">{msg}</div>}
                                    </center>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StakingReward;
