import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

const tableStyle = {
  borderCollapse: 'collapse',
  width: '100%',
  minWidth: 700,
};

const cellStyle = {
  border: 'none',
  backgroundColor: 'transparent',
  padding: '20px',
  color: '#fff',
};
const noDataStyle = {
  textAlign: 'center',
  height: '30vh',
  backgroundColor: '#000',
  borderBottom: "none",
  position: "relative"
};

const ViewOffers = () => {
  const [offers, setoffers] = useState([]);
  const [loader, setloader] = useState(true);
  const [clicked_nft, setclicked_nft] = useState('');
  const [coin_price, setcoin_price] = useState(0);
  const [make_offer, setmake_offer] = useState(false);
  const [buy_now_msg, setbuy_now_msg] = useState('');
  const [offer_now_msg, setoffer_now_msg] = useState('');
  const [wallet_address, setwallet_address] = useState('');
  const [email, setemail] = useState('');
  const [token, settoken] = useState('');
  // const [cancel_now_msg, setcancel_now_msg] = useState('');

  const handleClose = () => {
    setmake_offer(false)
    setbuy_now_msg('')
    setoffer_now_msg('')
  }

  useEffect(() => {
    const initial = async () => {
      var token = localStorage.getItem("token")
      var email = localStorage.getItem("email")
      if (token && email) {
        settoken(token)
        setemail(email)
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        //   const rr = await axios.post("https://services.uaxwallet.com/api/getNFTsAndOffersSummary",{
        //     email: email
        //   },config)
        //   console.log(rr.data)
        const responseWalletAddress = await axios.post('https://services.uaxwallet.com/api/getUserWallet', {
          email: email
        }, config);
        setwallet_address(responseWalletAddress.data)
        const offers = await axios.post('https://services.uaxwallet.com/api/getAllOffers', {
          email: email
        }, config);
        if (!offers) {
          const price = await axios.get("https://cmw.uax.network/get_current_price")
          setcoin_price(price.data.current_price)
          setloader(false)
          setoffers([])
        }
        else {
          const price = await axios.get("https://cmw.uax.network/get_current_price")
          setcoin_price(price.data.current_price)
          setloader(false)
          setoffers(offers.data.nfts)
        }
      }
      else {
        window.location.href = '/login'
      }
    }
    initial();
  }, [])

  const handleShow = (data) => {
    setmake_offer(true);
    setclicked_nft(data)
    // console.log(data)
  }
  const acceptOffer = async () => {
    setoffer_now_msg(<img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />)
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const accept_offer_response = await axios.post("https://services.uaxwallet.com/api/acceptOffer", {
      email: email,
      nft_txn_id: clicked_nft.nft_txn_id,
      offer_id: clicked_nft.id
    }, config)
    setoffer_now_msg(accept_offer_response.data.message)
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  const cancelOffer = async () => {
    setoffer_now_msg(<img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />)
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const reject_offer_response = await axios.post("https://services.uaxwallet.com/api/deleteBid", {
      email: email,
      nft_txn_id: clicked_nft.nft_txn_id,
      offer_id: clicked_nft.id
    }, config)
    setoffer_now_msg(reject_offer_response.data.message)
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }


  return (
    <>
      {loader ?
        <div className='' style={{ height: "80vh", position: "relative", backgroundColor: "#000" }}>
          <center style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
            <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "3vw" }} />
          </center>
        </div>
        :
        <div style={{
          width: '100%'
        }}>
          <div className='dashboard_box_001____ px-4 w-100' style={{ maxWidth: "100%" }}>
            <div className='my-4 w-100'>
              <p className='' style={{ fontWeight: '900', fontSize: '20px' }}>
                Offers
              </p>
              <div className='mt-2 overflow-hidden w-100'>
                <div className='overflow-auto w-100 mw-100'
                  style={{
                    display: 'block',
                  }}
                >
                  <Table style={tableStyle}>
                    <tbody>
                      <th className='table_header_class____'>NFT Name</th>
                      <th className='table_header_class____'>Ask Price</th>
                      <th className='table_header_class____'>Lowest Price</th>
                      <th className='table_header_class____'>Txn ID</th>
                      <th className='table_header_class____'>Date</th>
                      <th className='table_header_class____'>Status</th>
                      {offers.length > 0 ?
                        <>
                          {offers.map((index) => {
                            return (
                              <tr className='customized_row____' onClick={() => handleShow(index)} style={{ cursor: "pointer" }}>
                                <td style={cellStyle}>{index.nft_name}</td>
                                <td style={cellStyle}>
                                  <span style={{ color: '#31bf24' }}>{parseFloat(index.ask_amount).toFixed(2)} UAXN</span>
                                </td>
                                <td style={cellStyle}>
                                  <span style={{ color: '#31bf24' }}>{parseFloat(index.nft_lowest_price).toFixed(2)} UAXN</span>
                                </td>
                                <td style={cellStyle}>
                                  <span style={{ color: '' }}>{index.nft_txn_id.slice(0, 5)}...{index.nft_txn_id.slice(-5)}</span>
                                </td>
                                <td style={cellStyle}>{new Date(index.ask_amount_timestamp).toLocaleString()}</td>
                                <td style={cellStyle}>
                                  {index.ask_amount_status === "Pending" ? "Unsettled" : "Settled"}
                                </td>
                              </tr>
                            );
                          })}
                        </>
                        :
                        <tr>
                          <td colSpan="6" style={noDataStyle}>
                            <img src={"https://images.uaxdlts.com/uax-dashboard/images/NO_DATA.svg"} style={{ width: 60, position: "relative", top: "30%" }} />
                          </td>
                        </tr>
                      }

                    </tbody>
                  </Table>
                </div>
                {/* <div className='pagination-container'>
                    <ReactPaginate
                      previousLabel={'Previous'}
                      nextLabel={'Next'}
                      breakLabel={'...'}
                      pageCount={Math.ceil(Wallet_transactions.length / transactionsPerPage)}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'}
                    />
                  </div> */}
              </div>
            </div>
          </div>



          <Modal centered show={make_offer} onHide={handleClose} size="">
            <Modal.Body style={{ padding: '5%', backgroundColor: '#1a181b', border: 'none', color: "#fff", borderRadius: "12px" }}>
              <div className='text-left'>
                <p style={{ fontWeight: '700', fontSize: '20px', marginTop: '15px' }}>{clicked_nft.nft_name}</p>
                <img className='img-fluid' src={`https://nfts.uax.capital/${clicked_nft ? clicked_nft.file_path.split('/').pop() : ''}`} style={{ maxHeight: "50vh", width: "100%", borderRadius: "10px" }} />
                <br /><br />
                <small style={{ fontWeight: '600' }}>NFT ID : {clicked_nft.nft_id}</small>
                <br />
                <small style={{ fontWeight: '600' }}>Current Address : {clicked_nft ? clicked_nft.current_seller_address === 'NA' ? clicked_nft.current_seller_address : clicked_nft.current_seller_address
                  :
                  ''
                }
                </small>
                <br />
                <small style={{ fontWeight: '600' }}>Buyer Address :{clicked_nft.buyer_address}</small>
                <br />
                <small style={{ fontWeight: '600' }}>Lowest Price : {clicked_nft.nft_lowest_price} UAXN</small>
                <br />
                <small style={{ fontWeight: '600' }}>Bid Price : {clicked_nft.ask_amount} UAXN</small>
                <br />
                <small style={{ fontWeight: '600' }}>Bid Time : {new Date(clicked_nft.ask_amount_timestamp).toLocaleString()}</small>
                <br />
                <small style={{ fontWeight: '600' }}>Bid Status : {clicked_nft.ask_amount_status === 'Pending' ? "Unsettled" : "Settled"}</small>

              </div>
              <center className='mt-2'>
                <div className='row'>
                  <div className='col-lg-6 col-md-12 col-sm-12'>
                    <button
                      onClick={acceptOffer}
                      className="headerGrad"
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#c006df ",
                        marginTop: "15px",
                        color: "white",
                        minWidth: "100%",
                        fontWeight: "600",
                        fontSize: "16px",
                        border: "1px solid #c006df",
                        marginRight: "0px",
                        minHeight: "5vh",
                        borderRadius: ".25rem",
                      }}
                    >
                      <span style={{ fontSize: "14px" }}> Accept Now</span>
                    </button>
                  </div>
                  <div className='col-lg-6 col-md-12 col-sm-12'>
                    <button
                      className="headerGrad"
                      onClick={cancelOffer}
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#c006df ",
                        marginTop: "15px",
                        color: "white",
                        minWidth: "100%",
                        fontWeight: "600",
                        fontSize: "16px",
                        border: "1px solid #c006df",
                        marginRight: "0px",
                        minHeight: "5vh",
                        borderRadius: ".25rem",
                      }}
                    >
                      <span style={{ fontSize: "14px" }}> Reject Now</span>
                    </button>
                  </div>
                </div>
                {offer_now_msg && (
                  <div className="alert alert-success mt-3 text-center" role="alert">
                    {offer_now_msg}
                  </div>
                )}
              </center>
            </Modal.Body>
          </Modal>
        </div>
      }
    </>
  )
};

export default ViewOffers;
