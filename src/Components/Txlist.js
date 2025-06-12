import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import PowerSettingsNewIcon from '@mui/icons-material/Bolt';
import ReactPaginate from 'react-paginate';
import { Button } from 'react-bootstrap';

import Icon from '../media/icon.png';
import { IconButton } from '@mui/material';

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

const Txlist = ({ state = false }) => {
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

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const displayTransactions = walletTransactions.slice(currentPage * transactionsPerPage, (currentPage + 1) * transactionsPerPage);
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
                <div className='container p-0' >
                    <div className='mt-3'>
                        <ul>
                            {displayTransactions.length > 0 ?
                                <>
                                    {displayTransactions.map((index) =>

                                        <div className='dashboard_box_001____ px-4 py-2 my-2' style={{ position: "relative" }}>

                                            <li className='d-flex justify-content-between align-items-center'>
                                                <div className='d-flex'>
                                                    <div
                                                        className='d-flex justify-content-center align-items-center'
                                                        style={{
                                                            marginRight: 5
                                                        }}
                                                    >
                                                        <img src={Icon} alt='No icons' />
                                                        <i
                                                            className={index.recipient !== walletAddress ? "fa fa-arrow-up" : "fa fa-arrow-down"}
                                                            aria-hidden="true"
                                                            style={{
                                                                fontSize: 9,
                                                                position: 'absolute',
                                                                right: 0,
                                                                top: 0,
                                                                color: (index.recipient !== walletAddress ? '#FF4245' : '#27D07A')
                                                            }}
                                                        >
                                                        </i>
                                                    </div>
                                                    <div>
                                                        <div className='d-flex align-items-center'>
                                                            <h1
                                                                className='m-0'
                                                                style={{
                                                                    fontSize: 12,
                                                                    fontWeight: '600',
                                                                }}
                                                            >
                                                                UAXN
                                                            </h1>
                                                            {index.recipient === 'xjYL2vLJCFSZ.uax' ? (
                                                                <Button style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#403242', color: '#fff' }}>
                                                                    <PowerSettingsNewIcon style={{ padding: '', backgroundColor: '', color: '#fff' }} />
                                                                    Get Bandwidth
                                                                </Button>
                                                            ) : (
                                                                <>
                                                                    {index.recipient === walletAddress ? (
                                                                        <span style={{ color: '#31bf24', fontSize: 12 }}>(Deposit)</span>
                                                                    ) : (
                                                                        <span style={{ color: 'red', fontSize: 12 }}>(Withdraw)</span>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                        <div style={{
                                                            fontSize: 12,
                                                            color: '#A8A8A8'
                                                        }}
                                                        >
                                                            {
                                                                walletAddress === index.recipient ? (
                                                                    index.sender === 'EfDz4LTNHAlh.uaxn' ? (
                                                                        <>
                                                                            <img
                                                                                src="https://images.uaxdlts.com/explorer/mining%20.svg"
                                                                                alt="Reward"
                                                                                style={{ display: 'inline-block', marginRight: 3, width: 16 }}
                                                                            />
                                                                            Reward
                                                                        </>
                                                                    ) : index.sender === 'POFXyOvAjhF6.uaxn' ? (
                                                                        <>
                                                                            <img
                                                                                src="https://images.uaxdlts.com/uax-dashboard/images/staking-menu.svg"
                                                                                alt="Airdrop"
                                                                                style={{ marginRight: 3, width: 16 }}
                                                                            />
                                                                            Airdrop
                                                                        </>
                                                                    ) : (
                                                                        index.sender
                                                                    )) : index.recipient
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='d-flex flex-column'>
                                                    <span style={{ color: '#31bf24' }}>{parseFloat(index.amount).toFixed(2)} UAXN</span>
                                                    <span style={{
                                                        fontSize: 12,
                                                        color: '#A8A8A8'
                                                    }}>
                                                        {new Date(index.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                            </li>
                                        </div>
                                    )}
                                </>
                                :
                                <li className=' border-bottom border-2 py-2 border-dark'>
                                    <div style={noDataStyle}>
                                        <img src={"https://images.uaxdlts.com/uax-dashboard/images/NO_DATA.svg"}
                                            style={{ width: "6vw", position: "relative", top: "40%" }} />
                                    </div>
                                </li>
                            }
                        </ul>
                        {(displayTransactions.length > 0 && state) ?
                            <div className='pagination-container'>
                                <ReactPaginate
                                    previousLabel={'Previous'}
                                    nextLabel={'Next'}
                                    breakLabel={'...'}
                                    pageCount={Math.ceil(walletTransactions.length / transactionsPerPage)}
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
            )}
        </>
    );
};

export default Txlist;
