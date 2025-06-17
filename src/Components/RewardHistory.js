import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

const tableStyle = {
  borderCollapse: 'collapse',
  width: '100%',
};

const cellStyle = {
  border: 'none',
  backgroundColor: 'transparent',
  padding: '20px',
  color: "#fff"
};
const noDataStyle = {
  textAlign: 'center',
  height: '55vh',
  borderBottom: "none",
  position: "relative"
};
const RewardHistory = ({ setshowReward }) => {
  // const [my_ref_bonus_history, setmy_ref_bonus_history] = useState('');
  const [loader, setloader] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [myRefBonusHistory, setMyRefBonusHistory] = useState([]);

  useEffect(() => {
    const initial = async () => {
      var token = localStorage.getItem("token")
      var email = localStorage.getItem("email")
      if (token && email) {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const my_ref_history = await axios.post("https://services.uaxwallet.com/api/getReferralBonusHistory", { email: email }, config)
        setMyRefBonusHistory(my_ref_history.data);
        setloader(false)
      }
      else {
        window.location.href = '/login'
      }
    }
    initial();
  }, [])
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = myRefBonusHistory.slice(indexOfFirstItem, indexOfLastItem);
  const data = [
    {
      email: 'dfhwuefhwoiefh',
      amount: 100
    },
    {
      email: 'dfhwuefhwoiefh',
      amount: 100
    },
    {
      email: 'dfhwuefhwoiefh',
      amount: 100
    },
  ]
  return (
    <>
      {/* {loader?
    <div className='' style={{height:"80vh",position:"relative",backgroundColor:"#000"}}>
      <center style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
      <img src={WhiteLoader} style={{width:"3vw"}}/>
      </center>
    </div>
    :  */}
      <div className="container" style={{ minHeight: "100vh" }}>
        <div className="mobile_view mobile_view_flex align-items-center">
          <button
            className={`nav-link tabs_button____ m-0`}
            id="pills-home-tab"
            data-bs-target="#pills-home"
            type="button"
            role="tab"
            style={{
              borderRadius: 4,
              backgroundColor: '#3F2146',
              border: 0
            }}
            aria-controls="pills-home"
            onClick={() => setshowReward(false)}
          >
            <i class="fa fa-chevron-left" aria-hidden="true"></i>
          </button>
          <h3 className="flex-fill m-0 text-center"
            style={{
              fontSize: 16
            }}
          >
            Referral & Reward History
          </h3>
        </div>
        <div className='mt-3'>
          <div className='mobile_view'>
            <div className='d-flex gap-3'>
              <input
                id="searchQueryInput"
                style={{ backgroundColor: "#2A1A2E !important", paddingTop: 8, paddingBottom: 8 }}
                type="number"
                name="searchQueryInput"
                placeholder="Search by date"
              />
              <button
                type="button"
                className="text-white text-sm primary_btnn___"
                style={{
                  right: "2px",
                  backgroundColor: "",
                  padding: "4px 18px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Filters
              </button>
            </div>
          </div>
          <div className='dashboard_box_001____ px-4 desk_view' style={{ minHeight: "80vh", position: "relative", maxWidth: "100vw" }}>
            <div className='my-4'>
              <p className='' style={{ fontWeight: "900", fontSize: "20px" }}>Reward History</p>
              <small style={{ color: "#a8a8a8" }}>
                Earn up to 50% of your friends' trading fees as a reward. Refer now and take control of your earnings!
              </small>
              <div className='mt-5'>
                <div className="">
                  <Table responsive style={tableStyle}>
                    <tbody>
                      <th className='table_header_class____'>Date</th>
                      <th className='table_header_class____'>Email</th>
                      <th className='table_header_class____'>Reward</th>
                      <th className='table_header_class____'>Reward Rate[%]</th>
                      {currentItems.length > 0 ?
                        <>
                          {currentItems.map(index => {
                            return (
                              <tr className='customized_row____'>
                                <td style={cellStyle}>{new Date(index.timestamp).toLocaleString()}</td>
                                <td style={cellStyle}><span style={{ color: "#c006df" }}>{index.email.slice(0, 4)}******{index.email.slice(-4)}</span></td>
                                <td style={cellStyle}><span style={{ color: "#31bf24" }}>{parseFloat(index.amount).toFixed(2)} UAXN</span></td>
                                <td style={cellStyle}>{
                                  <>
                                    <>
                                      {parseFloat(index.amount) < 10000 ? '15%' : ''}
                                    </>
                                    <>
                                      {parseFloat(index.amount) > 50000 ? '25%' : ''}
                                    </>
                                    <>
                                      {parseFloat(index.amount) >= 50000 ? '50%' : ''}
                                    </>
                                  </>
                                }</td>
                              </tr>
                            )
                          })}
                        </>
                        :
                        <tr>
                          {loader ?
                            ''
                            :
                            <td colSpan="6" style={noDataStyle}>
                              <img src={"https://images.uaxdlts.com/uax-dashboard/images/NO_DATA.svg"} style={{ width: "6vw", position: "relative", top: "40%" }} />
                            </td>
                          }
                        </tr>
                      }
                    </tbody>
                  </Table>
                  {loader ?
                    <center style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                      <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} />
                    </center>
                    :
                    <>
                      {currentItems.length > 0 ?
                        <ReactPaginate
                          previousLabel={'Previous'}
                          nextLabel={'Next'}
                          breakLabel={'...'}
                          pageCount={Math.ceil(myRefBonusHistory.length / itemsPerPage)}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={handlePageClick}
                          containerClassName={'pagination'}
                          subContainerClassName={'pages pagination'}
                          activeClassName={'active'}
                        />
                        :
                        ''
                      }
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className='mobile_view mt-5'>
            {currentItems.length > 0 ?
              currentItems.map((_itm, _idx) => {
                return (
                  <div className='d-flex justify-content-between border-bottom border-dark pt-3' key={_idx}>
                    <div className='d-flex flex-column align-items-start'>
                      <h3 style={{
                        fontSize: 13,
                        fontWeight: 600
                      }}>{_itm.email}</h3>
                      <h6 style={{
                        fontWeight: 400,
                        fontSize: 11,
                        color: '#A8A8A8'
                      }}>{new Date(_itm.timestamp).toLocaleString()}</h6>
                    </div>
                    <div className='d-flex flex-column align-items-end'>
                      <span style={{ color: "#0DF469", fontWeight: 600, fontSize: 14 }}>{parseFloat(_itm.amount).toFixed(2)} UAXN</span>
                      <span style={{
                        fontWeight: 400,
                        fontSize: 11,
                        color: '#A8A8A8'
                      }}>
                        <>
                          {parseFloat(_itm.amount) < 10000 ? '15%' : ''}
                        </>
                        <>
                          {parseFloat(_itm.amount) > 50000 ? '25%' : ''}
                        </>
                        <>
                          {parseFloat(_itm.amount) >= 50000 ? '50%' : ''}
                        </>
                      </span>
                    </div>
                  </div>
                )
              })
              : (
                loader ? '' :
                  <div style={noDataStyle}>
                    <img src={"https://images.uaxdlts.com/uax-dashboard/images/NO_DATA.svg"} style={{ width: 72, position: "relative", top: "40%" }} alt='' />
                  </div>
              )}
          </div>
        </div>

      </div>
      {/* } */}
    </>
  )
};

export default RewardHistory;
