import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import PowerSettingsNewIcon from '@mui/icons-material/Bolt';
import ReactPaginate from 'react-paginate';
import { Button } from 'react-bootstrap';

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

const Transactions = () => {
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

            const getSummaryRequest = await axios.post("https://services.uaxwallet.com/api/getNFTsAndOffersSummary",{
              email:email
            },config)

            const [stakedAmt, balanceAndPower, walletTransactions, getSummary] = await Promise.all([
              stakedAmtRequest,
              balanceAndPowerRequest,
              walletTransactionsRequest,
              getSummaryRequest
            ]);
            // console.log("stakedAmtRequest",stakedAmt.data)
            if(walletTransactions.data.error){
              if(stakedAmt.data==='Wallet address not found'){
                setStakedAmtState({staked_amt:0,total_devices:0});
              }
              else{
                setStakedAmtState(isNaN(stakedAmt.data.staked_amt) ? 0 : stakedAmt.data);
              }
              setBalanceAndPower(balanceAndPower.data);
              const transactions = [];
              setWalletTransactions(transactions);
  
              setreserved_power((parseFloat(getSummary.data.totalAskAmounts)*212)+(parseFloat(getSummary.data.totalNFTsListedForSell)*212))
              setreserved_balance((parseFloat(getSummary.data.totalBidAmount)))
  
              const sentTxns = transactions.filter(txn => txn.sender === localStorage.getItem('wallet_address') && txn.recipient !== 'xjYL2vLJCFSZ.uax');
              setWalletTransactionsSent(sentTxns);
  
              setLoader(false);
            }
            else{
              if(stakedAmt.data==='Wallet address not found'){
                setStakedAmtState({staked_amt:0,total_devices:0});
              }
              else{
                setStakedAmtState(isNaN(stakedAmt.data.staked_amt) ? 0 : stakedAmt.data);
              }
              setBalanceAndPower(balanceAndPower.data);
              // const transactions = walletTransactions.data.reverse();
              const transactions = walletTransactions.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

              setWalletTransactions(transactions);
  
              setreserved_power((parseFloat(getSummary.data.totalAskAmounts)*212)+(parseFloat(getSummary.data.totalNFTsListedForSell)*212))
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
        <div className='' style={{ height: '80vh', position: 'relative', backgroundColor: '#000' }}>
          <center style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
            <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "3vw" }} />
          </center>
        </div>
      ) : (
        <div className='container' style={{ minHeight: '100vh' }}>
          <div className='mt-3'>
            <div className='dashboard_box_001____ px-4 mb-4'>
              <div className='my-3 for_device_difference____mx_5____'>
                <div className=''>
                  <div className='row'>
                    <div className='col-lg-3 col-md-6 col-sm-6 mt-2'>
                      <div className='section_balance_and_stake____'>
                        <span style={{ fontWeight: '500' }}>Balance</span>
                        <br />
                        <img src={"https://images.uaxdlts.com/uax-landing/assets/images/logo/uax%20favicon.png"} style={{ width: '18px' }} />
                        <span style={{ color: '#0ce456', fontSize: '18px', marginLeft: '10px', fontWeight: '900' }}>
                        {loader ? <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} /> : `${(parseFloat(balanceAndPower.balance)-parseFloat(reserved_balance)).toFixed(2)} UAXN`}
                        </span>
                      </div>
                    </div>
                    <div className='col-lg-3 col-md-6 col-sm-6 mt-2'>
                      <div className="section_balance_and_stake_brown____">
                        <span style={{ fontWeight: "500" }}>Staked / Validators</span><br />
                        <img src={"https://images.uaxdlts.com/uax-dashboard/images/mining .svg"} style={{ width: "18px" }} />
                        <span style={{ color: "#f99f1b", fontSize: "18px", marginLeft: "10px", fontWeight: "900" }}>
                          {/* {stakedAmtState == 0 ? '0 / 0' :
                            <> */}
                              {loader ? <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} /> : `${(stakedAmtState.staked_amt)} / ${stakedAmtState.total_devices}`}
                            {/* </>
                          } */}
                        </span>
                      </div>
                    </div>
                    <div className='col-lg-3 col-md-6 col-sm-6 mt-2'>
                      <div className='section_balance_and_stake_white____'>
                        <span style={{ fontWeight: '500' }}>Bandwidth</span>
                        <br />
                        <PowerSettingsNewIcon style={{ padding: '', backgroundColor: '', color: '#fff' }} />
                        <span style={{ color: '#fff', fontSize: '18px', marginLeft: '5px', fontWeight: '900' }}>
                        {loader ? <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} /> : `${(parseFloat(balanceAndPower.bandwidth)-parseFloat(reserved_power)).toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                    <div className='col-lg-3 col-md-6 col-sm-6 mt-2'>
                      <div className='section_balance_and_stake_red____'>
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
              </div>
            </div>

            <div className='dashboard_box_001____ px-4' style={{ minHeight: "80vh", position: "relative", maxWidth: "80vw" }}>
              <div className='my-4'>
                <p className='' style={{ fontWeight: '900', fontSize: '20px' }}>
                  Transactions
                </p>
                <small>Last 100 Transactions</small>
                <div className='mt-5'>
                  <div className=''>
                    <Table responsive style={tableStyle}>
                      <tbody>
                        <th className='table_header_class____'>Coin</th>
                        <th className='table_header_class____'>Date</th>
                        <th className='table_header_class____'>Sender/Recipient</th>
                        <th className='table_header_class____'>Amount</th>
                        <th className='table_header_class____'>Status</th>
                        {displayTransactions.length>0?
                          <>
                            {displayTransactions.map((index) => {
                          if (walletAddress === index.recipient) {
                            return (
                              <tr className='customized_row____'>
                                <td style={cellStyle}>UAXN</td>
                                <td style={cellStyle}>{new Date(index.timestamp).toLocaleString()}</td>
                                <td style={cellStyle}>{
                                    index.sender === 'EfDz4LTNHAlh.uaxn' ? (
                                      <>
                                        <img
                                          src="https://images.uaxdlts.com/explorer/mining%20.svg"
                                          alt="Reward"
                                          style={{ display: 'inline-block', marginRight: '5px' }}
                                        />
                                        Reward
                                      </>
                                    ) : index.sender === 'POFXyOvAjhF6.uaxn' ? (
                                     <>
                                        <img
                                          src="https://images.uaxdlts.com/uax-dashboard/images/staking-menu.svg"
                                          alt="Airdrop"
                                          style={{ marginRight: '5px'}}
                                        />
                                        Airdrop
                                        </>
                                    ) : (
                                      index.sender
                                    )
                                  }
                                  </td>
                                <td style={cellStyle}>
                                  <span style={{ color: '#31bf24' }}>{parseFloat(index.amount).toFixed(5)} UAXN</span>
                                </td>
                                <td style={cellStyle}>
                                  {index.recipient === 'xjYL2vLJCFSZ.uax' ? (
                                    <Button style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#403242', color: '#fff' }}>
                                      <PowerSettingsNewIcon style={{ padding: '', backgroundColor: '', color: '#fff' }} />
                                      Get Bandwidth
                                    </Button>
                                  ) : (
                                    <>
                                      {index.recipient === walletAddress ? (
                                        <span style={{ color: '#31bf24' }}>Deposit</span>
                                      ) : (
                                        <span style={{ color: 'red' }}>Withdraw</span>
                                      )}
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          } else {
                            return (
                              <tr className='customized_row____'>
                                <td style={cellStyle}>UAXN</td>
                                <td style={cellStyle}>{new Date(index.timestamp).toLocaleString()}</td>
                                <td style={cellStyle}>{index.recipient}</td>
                                <td style={cellStyle}>
                                  <span style={{ color: '#31bf24' }}>{parseFloat(index.amount).toFixed(2)} UAXN</span>
                                </td>
                                <td style={cellStyle}>
                                  {index.recipient === 'xjYL2vLJCFSZ.uax' ? (
                                    <Button style={{ border: 0, minHeight: "2vh", borderRadius: '5px', backgroundColor: '#403242', color: '#fff' }}>
                                      <PowerSettingsNewIcon style={{ padding: '', backgroundColor: '', color: '#fff' }} />
                                      Get Bandwidth
                                    </Button>
                                  ) : (
                                    <>
                                      {index.recipient === walletAddress ? (
                                        <span style={{ color: '#31bf24' }}>Deposit</span>
                                      ) : (
                                        <span style={{ color: 'red' }}>Withdraw</span>
                                      )}
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          }
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
            </div>
          </div>
        </div>
     )} 
    </>
  );
};

export default Transactions;
