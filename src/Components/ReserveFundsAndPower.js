import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';

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
const noDataStyle = {
  textAlign: 'center',
  height: '30vh',
  backgroundColor: '#000',
  borderBottom: "none",
  position: "relative"
};


const ReserveFundsAndPower = () => {
  const [loader, setloader] = useState(true);
  const [reserves, setreserves] = useState([]);
  const [make_offer, setmake_offer] = useState(false);
  const [clicked_nft, setclicked_nft] = useState('');
  const [offer_now_msg, setoffer_now_msg] = useState('');
  const [email, setemail] = useState('');
  const [token, settoken] = useState('');

  useEffect(() => {
    setloader(false)
    initialFunction();
  }, [])

  const initialFunction = async () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token || !email) {
      window.location.href = "/login";
      return;
    }
    else {
      setemail(email)
      settoken(token)
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const reserve_logs = await axios.post("https://services.uaxwallet.com/api/getNFTsAndOffersSummary", {
        email: email,
      }, config)
      setreserves(reserve_logs.data.askAmountsDetails)
    }
  }

  const cancelNow = async () => {
    console.log(clicked_nft)
    setoffer_now_msg(<img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />)
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const cancelled = await axios.post("https://services.uaxwallet.com/api/deleteBidByPoster", {
      email: email,
      nft_txn_id: clicked_nft.nft_txn_id,
      offer_id: clicked_nft.id
    }, config)
    setoffer_now_msg(cancelled.data.message)
    setTimeout(() => {
      window.location.reload();
    }, 2000)
  }

  const handleShow = (data) => {
    setmake_offer(true);
    setclicked_nft(data)
    // console.log(data)
  }

  const handleClose = () => {
    setmake_offer(false)
    setoffer_now_msg('')
  }

  return (
    <>
      <div className='dashboard_box_001____ px-4' style={{ maxWidth: "100vw" }}>
        <div className='my-4'>
          <p className='' style={{ fontWeight: '900', fontSize: '20px' }}>
            Offers
          </p>
          <div className='mt-2'>
            <div className=''>
              <Table responsive style={tableStyle}>
                <tbody>
                  <th className='table_header_class____'>NFT Block Height</th>
                  <th className='table_header_class____'>Ask Price</th>
                  <th className='table_header_class____'>Seller Address</th>
                  <th className='table_header_class____'>Date</th>
                  <th className='table_header_class____'>Status</th>
                  {reserves.length > 0 ?
                    <>
                      {reserves.map((index) => {
                        return (
                          <tr className='customized_row____' onClick={() => handleShow(index)} style={{ cursor: "pointer" }}>
                            <td style={cellStyle}>{index.nft_id}</td>
                            <td style={cellStyle}>
                              <span style={{ color: '#31bf24' }}>{parseFloat(index.amount).toFixed(2)} UAXN</span>
                            </td>
                            <td style={cellStyle}>
                              <span style={{ color: '#31bf24' }}>{index.current_seller_address}</span>
                            </td>
                            <td style={cellStyle}>
                              <span style={{ color: '' }}>{new Date(index.timestamp).toLocaleString()}</span>
                            </td>
                            <td style={cellStyle}>
                              {index.status === "Pending" ? "Unsettled" : "Settled"}
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
          </div>
        </div>
      </div>

      <Modal centered show={make_offer} onHide={handleClose} size="">
        <Modal.Body style={{ padding: '5%', backgroundColor: '#1a181b', border: 'none', color: "#fff", borderRadius: "12px" }}>
          <div className='text-left'>
            <small style={{ fontWeight: '600' }}>NFT Block Height : {clicked_nft.nft_id}</small>
            <br />
            <small style={{ fontWeight: '600' }}>Seller Address : {clicked_nft.current_seller_address}</small>
            <br />
            <small style={{ fontWeight: '600' }}>Buyer Address :{clicked_nft.buyer_address}</small>
            <br />
            <small style={{ fontWeight: '600' }}>Bid Price : {clicked_nft.amount} UAXN</small>
            <br />
            <small style={{ fontWeight: '600' }}>NFT ID : {clicked_nft.id}</small>
            <br />
            <small style={{ fontWeight: '600' }}>Bid Time : {new Date(clicked_nft.timestamp).toLocaleString()}</small>
            <br />
            <small style={{ fontWeight: '600' }}>Bid Status : {clicked_nft.status === 'Pending' ? "Unsettled" : "Settled"}</small>

          </div>
          <center className='mt-2'>
            <div className='row'>
              <div className='col-lg-12 col-md-12 col-sm-12'>
                <button
                  className="headerGrad"
                  onClick={cancelNow}
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
                  <span style={{ fontSize: "14px" }}> Cancel Now</span>
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

    </>
  )
};

export default ReserveFundsAndPower;
