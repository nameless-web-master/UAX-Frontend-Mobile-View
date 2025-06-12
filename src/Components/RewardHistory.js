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
  backgroundColor: '#000',
  borderBottom: "none",
  position: "relative"
};
const RewardHistory = () => {
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
        <div className='mt-3'>
          <div className='dashboard_box_001____ px-4' style={{ minHeight: "80vh", position: "relative", maxWidth: "100vw" }}>
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
        </div>

      </div>
      {/* } */}
    </>
  )
};

export default RewardHistory;
