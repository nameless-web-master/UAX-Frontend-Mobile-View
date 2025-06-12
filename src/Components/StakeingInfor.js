import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import PowerSettingsNewIcon from '@mui/icons-material/Bolt';
import ReactPaginate from 'react-paginate';
import { Button } from 'react-bootstrap';
import Txlist from './Txlist';
import { UserInfor } from './UserInfor';

import Icon from '../media/icon.png';

const noDataStyle = {
    textAlign: 'center',
    height: '55vh',
    backgroundColor: '#000',
    borderBottom: "none",
    position: "relative"
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

const StakingInfor = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [loader, setLoader] = useState(true);
    const [walletTransactions, setWalletTransactions] = useState([]);
    const [walletAddress, setWalletAddress] = useState('');
    const [balanceAndPower, setBalanceAndPower] = useState('');
    const [walletTransactionsSent, setWalletTransactionsSent] = useState([]);
    const [stakedAmtState, setStakedAmtState] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [reserved_power, setreserved_power] = React.useState(0);
    const [reserved_balance, setreserved_balance] = React.useState(0);
    const transactionsPerPage = 10;

    useEffect(() => {
        const initialFunction = async () => {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email');
            if (token && email) {
                setEmail(email);
                setToken(token);

                try {
                    const responseToken = await axios.post('https://services.uaxwallet.com/api/verifyToken', {
                        token: token,
                        email: email,
                    });

                    if (responseToken.data === 'Token Expired') {
                        localStorage.clear();
                        window.location.href = '/login';
                    } else {
                        const config = {
                            headers: { Authorization: `Bearer ${token}` },
                        };
                        setWalletAddress(localStorage.getItem('wallet_address'));

                        const stakedAmtRequest = axios.post("https://webservices.uaxwallet.com/get_staked_amount_by_wallet", {
                            wallet_address: localStorage.getItem('wallet_address')
                        });

                        const balanceAndPowerRequest = axios.post(
                            'https://services.uaxwallet.com/api/getUserBalanceAndPower',
                            {
                                email: email,
                            },
                            config
                        );

                        const walletTransactionsRequest = axios.post(
                            'https://services.uaxwallet.com/api/getUserWalletTransactions',
                            {
                                email: email,
                            },
                            config
                        );

                        const getSummaryRequest = await axios.post("https://services.uaxwallet.com/api/getNFTsAndOffersSummary", {
                            email: email
                        }, config)

                        const [stakedAmt, balanceAndPower, walletTransactions, getSummary] = await Promise.all([
                            stakedAmtRequest,
                            balanceAndPowerRequest,
                            walletTransactionsRequest,
                            getSummaryRequest
                        ]);
                        // console.log("stakedAmtRequest",stakedAmt.data)
                        if (walletTransactions.data.error) {
                            if (stakedAmt.data === 'Wallet address not found') {
                                setStakedAmtState({ staked_amt: 0, total_devices: 0 });
                            }
                            else {
                                setStakedAmtState(isNaN(stakedAmt.data.staked_amt) ? 0 : stakedAmt.data);
                            }
                            setBalanceAndPower(balanceAndPower.data);
                            const transactions = [];
                            setWalletTransactions(transactions);

                            setreserved_power((parseFloat(getSummary.data.totalAskAmounts) * 212) + (parseFloat(getSummary.data.totalNFTsListedForSell) * 212))
                            setreserved_balance((parseFloat(getSummary.data.totalBidAmount)))

                            const sentTxns = transactions.filter(txn => txn.sender === localStorage.getItem('wallet_address') && txn.recipient !== 'xjYL2vLJCFSZ.uax');
                            setWalletTransactionsSent(sentTxns);

                            setLoader(false);
                        }
                        else {
                            if (stakedAmt.data === 'Wallet address not found') {
                                setStakedAmtState({ staked_amt: 0, total_devices: 0 });
                            }
                            else {
                                setStakedAmtState(isNaN(stakedAmt.data.staked_amt) ? 0 : stakedAmt.data);
                            }
                            setBalanceAndPower(balanceAndPower.data);
                            // const transactions = walletTransactions.data.reverse();
                            const transactions = walletTransactions.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                            setWalletTransactions(transactions);

                            setreserved_power((parseFloat(getSummary.data.totalAskAmounts) * 212) + (parseFloat(getSummary.data.totalNFTsListedForSell) * 212))
                            setreserved_balance((parseFloat(getSummary.data.totalBidAmount)))

                            const sentTxns = transactions.filter(txn => txn.sender === localStorage.getItem('wallet_address') && txn.recipient !== 'xjYL2vLJCFSZ.uax');
                            setWalletTransactionsSent(sentTxns);

                            setLoader(false);
                        }

                    }
                } catch (error) {
                    console.error("Error during API calls:", error);
                    // window.location.href = '/login';
                }
            } else {
                window.location.href = '/login';
            }
        };

        initialFunction();
    }, []);


    // console.log("stakedAmtState",stakedAmtState)
    return (
        <>
            {loader ? (
                <div className='' style={{ position: 'relative', backgroundColor: '#000' }}>
                    <center style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                        <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "3vw" }} />
                    </center>
                </div>
            ) : (
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-3 col-md-6 col-sm-6 col-12 my-1'>
                            <div className='section_balance_and_stake____ h-100'>
                                <span style={{ fontWeight: '500' }}>Balance</span>
                                <br />
                                <img src={"https://images.uaxdlts.com/uax-landing/assets/images/logo/uax%20favicon.png"} style={{ width: '18px' }} />
                                <span style={{ color: '#0ce456', fontSize: '18px', marginLeft: '10px', fontWeight: '900' }}>
                                    {loader ? <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} /> : `${(parseFloat(balanceAndPower.balance) - parseFloat(reserved_balance)).toFixed(2)} UAXN`}
                                </span>
                            </div>
                        </div>
                        <div className='col-lg-3 col-md-6 col-sm-6 col-12 my-1'>
                            <div className="section_balance_and_stake_brown____ h-100">
                                <span style={{ fontWeight: "500" }}>Staked / Validators</span><br />
                                <img src={"https://images.uaxdlts.com/uax-dashboard/images/mining .svg"} style={{ width: "18px" }} />
                                <span style={{ color: "#f99f1b", fontSize: "18px", marginLeft: "10px", fontWeight: "900" }}>
                                    {loader ? <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} /> : `${(stakedAmtState.staked_amt)} / ${stakedAmtState.total_devices}`}
                                </span>
                            </div>
                        </div>
                        <div className='col-lg-3 col-md-6 col-sm-6 col-12 my-1'>
                            <div className='section_balance_and_stake_white____ h-100'>
                                <span style={{ fontWeight: '500' }}>Bandwidth</span>
                                <br />
                                <PowerSettingsNewIcon style={{ padding: '', backgroundColor: '', color: '#fff' }} />
                                <span style={{ color: '#fff', fontSize: '18px', marginLeft: '5px', fontWeight: '900' }}>
                                    {loader ? <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} /> : `${(parseFloat(balanceAndPower.bandwidth) - parseFloat(reserved_power)).toFixed(2)}`}
                                </span>
                            </div>
                        </div>
                        <div className='col-lg-3 col-md-6 col-sm-6 col-12 my-1'>
                            <div className='section_balance_and_stake_red____ h-100'>
                                <span style={{ fontWeight: '500' }}>Avg. Utilized Bandwidth</span>
                                <br />
                                <PowerSettingsNewIcon style={{ padding: '', backgroundColor: '', color: 'red' }} />
                                <span style={{ color: 'red', fontSize: '18px', marginLeft: '5px', fontWeight: '900' }}>
                                    {loader ? <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} /> : `${parseFloat(walletTransactionsSent.length * 100).toFixed(2)}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StakingInfor;
