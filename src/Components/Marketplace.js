import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';

const Marketplace = () => {
    const [nft_list, setnft_list] = useState([]);
    const [loader, setloader] = useState(true);
    const [clicked_nft, setclicked_nft] = useState('');
    const [coin_price, setcoin_price] = useState(0);
    const [show, setShow] = useState(false);
    const [make_offer, setmake_offer] = useState(false);
    const [buy_now_msg, setbuy_now_msg] = useState('');
    const [offer_now_msg, setoffer_now_msg] = useState('');
    const [wallet_address, setwallet_address] = useState('');
    const [offer_amount, setoffer_amount] = useState(0);

    const handleClose = () => {
        setShow(false);
        setmake_offer(false)
        // settransfer_show(false)
        // setlist_for_sell_msg('')
        setbuy_now_msg('')
        setoffer_now_msg('')
    }

    useEffect(() => {
        const initial = async () => {
            var token = localStorage.getItem("token")
            var email = localStorage.getItem("email")
            if (token && email) {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const responseWalletAddress = await axios.post('https://services.uaxwallet.com/api/getUserWallet', {
                    email: email
                }, config);
                setwallet_address(responseWalletAddress.data)
                const responseWallet = await axios.post('https://services.uaxwallet.com/api/getAllNFTForMarketplace', {
                    email: email
                }, config);
                if (!responseWallet) {
                    const price = await axios.get("https://cmw.uax.network/get_current_price")
                    setcoin_price(price.data.current_price)
                    setnft_list([])
                    setloader(false)
                }
                else {
                    const price = await axios.get("https://cmw.uax.network/get_current_price")
                    setcoin_price(price.data.current_price)
                    setnft_list(responseWallet.data)
                    setloader(false)
                }
            }
            else {
                window.location.href = '/login'
            }
        }
        initial();
    }, [])
    // console.log(nft_list)
    const handleShow = (data) => {
        setShow(true);
        setclicked_nft(data)
    }

    const buyNow = async () => {
        setbuy_now_msg(
            <img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />
        )
        if (clicked_nft) {
            var token = localStorage.getItem("token")
            var email = localStorage.getItem("email")
            if (token && email) {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const buy_now_nft = await axios.post('https://services.uaxwallet.com/api/buyNowNFT', {
                    email: email,
                    seller_address: clicked_nft.new_owner_address === 'NA' ? clicked_nft.nft_owner_address : clicked_nft.new_owner_address,
                    nft_txn_id: clicked_nft.nft_txn_id,
                }, config);
                // console.log(buy_now_nft.data)
                if (buy_now_nft) {
                    setbuy_now_msg(buy_now_nft.data.message)
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000)
                }
            }
            else {
                window.location.href = "/"
            }
        }
        else {
            setbuy_now_msg("No NFT selected")
        }
    }

    const openOfferPopup = async () => {
        setmake_offer(true)
        setShow(false);
    }

    const offerNow = async () => {
        var token = localStorage.getItem("token")
        var email = localStorage.getItem("email")
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        setoffer_now_msg(
            <img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />
        )
        if (!clicked_nft) {
            setoffer_now_msg("No NFT is selected")
        }
        else {
            // if(parseFloat(offer_amount)>parseFloat(clicked_nft.nft_lowest_price)){
            const successOffered = await axios.post("https://services.uaxwallet.com/api/offerNow", {
                email: email,
                amount: parseFloat(offer_amount),
                seller_address: clicked_nft.new_owner_address === 'NA' ? clicked_nft.nft_owner_address : clicked_nft.new_owner_address,
                nft_creator_address: clicked_nft.nft_owner_address,
                nft_txn_id: clicked_nft.nft_txn_id,
                nft_id: clicked_nft.nft_id
            }, config)
            // console.log(successOffered.data)
            if (!successOffered) {
                setoffer_now_msg("Something went wrong,please try again later")
            }
            else {
                setoffer_now_msg(successOffered.data.message)
            }
            // }
            // else{
            //     setoffer_now_msg("Offer amount is less than lowest price")
            // }
        }
    }
    return (
        <>
            {loader ?
                <div className='' style={{ height: "40vh", position: "relative", backgroundImage: 'linear-gradient(#2B2330, #2218260F)', borderRadius: 6 }}>
                    <center style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                        <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "3vw" }} />
                    </center>
                </div>
                :
                <>
                    <div className='row w-100 m-auto'>
                        {nft_list.length > 0 ?
                            <>
                                {nft_list.map(index => {
                                    if (index.new_owner_address === 'NA') {
                                        if (index.nft_owner_address != wallet_address) {
                                            return (
                                                <div className='col-lg-3 col-md-6 col-sm-12 mt-2'>
                                                    <span onClick={(e) => handleShow(index)} style={{ cursor: "pointer" }}>
                                                        <div className='nft_box_0001____ p-4'>
                                                            <div className='text-center' style={{ position: "relative" }}>
                                                                <img className='img-fluid' src={"https://images.uaxdlts.com/uax-dashboard/images/Group 40004 (1).svg"} style={{ width: "1vw", borderRadius: "50%", position: "absolute", top: "10px", right: "10px" }} />
                                                                <img className='fixed-height-img img-fluid' src={nft_list.length > 0 ? `https://nfts.uax.capital/${index.file_path.split('/').pop()}` : null} style={{ borderRadius: "10px", width: "100%" }} />
                                                            </div>
                                                            <div className='' style={{ marginTop: "2rem" }}>
                                                                <hr style={{ borderTop: "1px solid #5f5b61" }} />
                                                                <span>{index.nft_name}</span><br />
                                                                <small style={{ color: "#b6b6b6" }}>Price : <span style={{ color: "green", fontWeight: "900" }}>{index.nft_lowest_price} UAXN</span> (${(parseFloat(coin_price) * parseFloat(index.nft_lowest_price)).toFixed(2)})</small>
                                                                <i className="fa fa-exchange" style={{ float: "right" }} aria-hidden="true"></i>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-md-12 col-sm-12'>
                                                                    <button
                                                                        className="headerGrad mt-3"
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            backgroundColor: "#c006df ",
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
                                                                        <span style={{ fontSize: "14px" }}>
                                                                            <img src={"https://images.uaxdlts.com/uax-dashboard/images/icons8_buy.svg"} style={{ width: "24px" }} />Buy Now</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </div>
                                            )
                                        }
                                    }
                                    else {
                                        if (index.new_owner_address != wallet_address) {
                                            return (
                                                <div className='col-lg-3 col-md-6 col-sm-12 mt-2'>
                                                    <span onClick={(e) => handleShow(index)} style={{ cursor: "pointer" }}>
                                                        <div className='nft_box_0001____ p-4'>
                                                            <div className='text-center' style={{ position: "relative" }}>
                                                                <img className='img-fluid' src={"https://images.uaxdlts.com/uax-dashboard/images/Group 40004 (1).svg"} style={{ width: "1vw", borderRadius: "50%", position: "absolute", top: "10px", right: "10px" }} />
                                                                <img className='img-fluid' src={nft_list.length > 0 ? `https://nfts.uax.capital/${index.file_path.split('/').pop()}` : null} style={{ borderRadius: "10px" }} />
                                                            </div>
                                                            <div className='' style={{ marginTop: "2rem" }}>
                                                                <hr style={{ borderTop: "1px solid #5f5b61" }} />
                                                                <span>{index.nft_name}</span><br />
                                                                <small style={{ color: "#b6b6b6" }}>Price : <span style={{ color: "green", fontWeight: "900" }}>{index.nft_lowest_price} UAXN</span> (${(parseFloat(coin_price) * parseFloat(index.nft_lowest_price)).toFixed(2)})</small>
                                                                <i className="fa fa-exchange" style={{ float: "right" }} aria-hidden="true"></i>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-md-12 col-sm-12'>
                                                                    <button
                                                                        className="headerGrad mt-3"
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            backgroundColor: "#c006df ",
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
                                                                        <span style={{ fontSize: "14px" }}>
                                                                            <img src={"https://images.uaxdlts.com/uax-dashboard/images/icons8_buy.svg"} style={{ width: "24px" }} />Buy Now</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </div>
                                            )
                                        }
                                    }
                                })}
                            </>
                            :
                            <div className='' style={{ height: "40vh", position: "relative", backgroundImage: 'linear-gradient(#2B2330, #2218260F)', borderRadius: 6 }}>
                                <center style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                                    <img src={"https://images.uaxdlts.com/uax-dashboard/images/NO_DATA.svg"} style={{ width: "" }} />
                                </center>
                            </div>

                        }
                    </div>

                    <Modal centered show={show} onHide={handleClose} size="lg">
                        <Modal.Body className='mobile_responsiveness' style={{ padding: '5%', backgroundColor: '#1a181b', border: 'none', color: "#fff", borderRadius: "12px"}}>
                            <div className='' style={{ position: "relative", height: "100%", width: "100%" }}>
                                <div >
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-12 col-sm-12'>
                                            <center style={{ height: "100%" }}>
                                                <img className='img-fluid' style={{ height: "100%", borderRadius: "10px" }} src={`https://nfts.uax.capital/${clicked_nft ? clicked_nft.file_path.split('/').pop() : ''}`} />
                                            </center>
                                        </div>
                                        <div className='col-lg-6 col-md-12 col-sm-12'>
                                            <div style={{ marginTop: '', fontFamily: "" }}>
                                                <p style={{ fontWeight: '700', fontSize: '20px', marginTop: '15px' }}>{clicked_nft.nft_name}
                                                    <a href="" target="_blank" >
                                                        <button
                                                            className="headerGrad"
                                                            style={{
                                                                cursor: "pointer",
                                                                backgroundColor: "transparent ",
                                                                color: "white",
                                                                padding: "5px",
                                                                minWidth: "",
                                                                fontSize: "",
                                                                border: "1px solid #c006df",
                                                                borderRadius: ".25rem",
                                                                float: "right",
                                                                fontSize: "10px",
                                                                marginLeft: "5px"
                                                            }}
                                                        >
                                                            <img src={"https://images.uaxdlts.com/uax-dashboard/images/Group 40004 (1).svg"} style={{ width: "1vw" }} />
                                                        </button>
                                                    </a>
                                                    {/* <button
                            className="headerGrad"
                            style={{
                                cursor: "pointer",
                                backgroundColor: "transparent ",
                                color: "white",
                                padding:"5px",
                                minWidth: "",
                                fontSize: "",
                                border: "1px solid #c006df",
                                borderRadius: ".25rem",
                                float:"right",
                                fontSize: "10px",
                                marginLeft:"5px"
                            }}
                            >
                               <i class="fa fa-share-alt" aria-hidden="true"></i> Share
                            </button> */}
                                                    {/* <button
                            className="headerGrad"
                            style={{
                                cursor: "pointer",
                                backgroundColor: "transparent ",
                                color: "white",
                                padding:"5px",
                                minWidth: "",
                                fontSize: "",
                                border: "1px solid #c006df",
                                borderRadius: ".25rem",
                                float:"right",
                                fontSize: "10px"
                            }}
                            >
                               <i class="fa fa-heart" aria-hidden="true"></i> wishlist
                            </button> */}
                                                </p>
                                                <small style={{ fontWeight: '', color: "grey" }}>NFT Creator Name <br /> <span style={{ color: "#fff", fontSize: "17px" }}>{clicked_nft.nft_craetor}</span></small>
                                                <br />
                                                <small style={{ fontWeight: '', color: "grey", marginTop: "20px" }}>Description <br /> <span style={{ color: "#fff", fontSize: "17px" }}>{clicked_nft.nft_description}</span></small>
                                                <br />
                                                <small style={{ fontWeight: '', color: "grey" }}>External Link <br /> <span style={{ color: "#fff", fontSize: "17px" }}>{clicked_nft.nft_external_link}</span></small>
                                                <br />
                                                <small style={{ fontWeight: '', color: "grey" }}>Txn ID <br /> <span style={{ color: "#fff", fontSize: "17px" }}>{clicked_nft.nft_txn_id}</span></small>
                                                <br />
                                                <small style={{ fontWeight: '', color: "grey" }}>Block ID <br /> <span style={{ color: "#fff", fontSize: "17px" }}>{clicked_nft.nft_id}</span></small>
                                                <br />
                                                <small style={{ fontWeight: '', color: "grey" }}>Owner Address <br /> <span style={{ color: "#fff", fontSize: "17px" }}>
                                                    {clicked_nft ? clicked_nft.new_owner_address === 'NA' ? clicked_nft.nft_owner_address : clicked_nft.new_owner_address
                                                        :
                                                        ''
                                                    }
                                                </span></small>
                                                <br />
                                                <small style={{ fontWeight: '900', color: "grey", fontSize: "18px" }}>Lowest Price <br /> <span style={{ color: "#fff", fontSize: "22px" }}><span style={{ color: "green", fontWeight: "900" }}>{clicked_nft.nft_lowest_price} UAXN</span> ($7.70)</span></small>
                                                <br />
                                                <small style={{ fontWeight: '', color: "grey" }}>Listed for Sell <br /> <span style={{ color: "#fff", fontSize: "17px" }}>{clicked_nft.listed_for_sell}</span></small>
                                                <br />
                                                <small style={{ fontWeight: '', color: "grey" }}>Date <br /> <span style={{ color: "#fff", fontSize: "17px" }}>{new Date(clicked_nft.timestamp).toDateString()}</span></small>
                                                <br />
                                            </div>
                                            <div className='dashboard_box_001____ mt-3 p-3' style={{ backgroundColor: "#403242" }}>
                                                <div className='row'>
                                                    <div className='col-md-6 col-sm-12'>
                                                        <button
                                                            className="headerGrad"
                                                            style={{
                                                                cursor: "pointer",
                                                                backgroundColor: "#c006df ",
                                                                color: "white",
                                                                minWidth: "100%",
                                                                fontWeight: "600",
                                                                fontSize: "16px",
                                                                border: "1px solid #c006df",
                                                                marginRight: "0px",
                                                                minHeight: "5vh",
                                                                borderRadius: ".25rem",
                                                            }}
                                                            onClick={buyNow}
                                                        >
                                                            <span style={{ fontSize: "14px" }}>
                                                                <img src={"https://images.uaxdlts.com/uax-dashboard/images/icons8_buy.svg"} style={{ width: "24px" }} /> Buy Now</span>
                                                        </button>
                                                    </div>

                                                    <div className='col-md-6 col-sm-12'>
                                                        <button
                                                            className="headerGrad"
                                                            style={{
                                                                cursor: "pointer",
                                                                backgroundColor: "#c006df ",
                                                                color: "white",
                                                                minWidth: "100%",
                                                                fontWeight: "600",
                                                                fontSize: "16px",
                                                                border: "1px solid #c006df",
                                                                marginRight: "0px",
                                                                minHeight: "5vh",
                                                                borderRadius: ".25rem",
                                                            }}
                                                            onClick={openOfferPopup}
                                                        >
                                                            <span style={{ fontSize: "14px" }}> Make offer</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                {buy_now_msg && (
                                                    <div className="alert alert-success mt-3 text-center" role="alert">
                                                        {buy_now_msg}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </Modal.Body>
                    </Modal>

                    <Modal centered show={make_offer} onHide={handleClose} size="">
                        <Modal.Body style={{ padding: '5%', backgroundColor: '#1a181b', border: 'none', color: "#fff", borderRadius: "12px" }}>
                            <center>
                                <p style={{ fontWeight: '700', fontSize: '20px', marginTop: '15px' }}>{clicked_nft.nft_name}</p>
                                <img className='img-fluid' src={`https://nfts.uax.capital/${clicked_nft ? clicked_nft.file_path.split('/').pop() : ''}`} style={{ borderRadius: "10px" }} />
                                <br /><br />
                                <small style={{ fontWeight: '600' }}>ID : {clicked_nft.nft_txn_id}</small>
                                <br />
                                <small style={{ fontWeight: '600' }}>Owner Address : {clicked_nft ? clicked_nft.new_owner_address === 'NA' ? clicked_nft.nft_owner_address : clicked_nft.new_owner_address
                                    :
                                    ''
                                }
                                </small>
                                <br />
                                <small style={{ fontWeight: '600' }}>Lowest Price : {clicked_nft.nft_lowest_price} UAXN</small>
                            </center>
                            <div style={{ marginTop: '30px' }}>
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="" style={{ fontWeight: "700" }}>
                                            Amount*
                                        </label>
                                        <input
                                            type="number"
                                            className="mt-2"
                                            id="searchQueryInput"
                                            aria-describedby=""
                                            placeholder="Offer Amount"
                                            style={{ backgroundColor: '#403242' }}
                                            onChange={(e) => setoffer_amount(e.target.value)}
                                        />
                                    </div>
                                </form>
                            </div>
                            <center className='mt-2'>
                                <div className='row'>
                                    <div className='col-md-12 col-sm-12'>
                                        <button
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
                                            onClick={offerNow}
                                        >
                                            <span style={{ fontSize: "14px" }}> Offer Now</span>
                                        </button>
                                        {offer_now_msg && (
                                            <div className="alert alert-success mt-3 text-center" role="alert">
                                                {offer_now_msg}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </center>
                        </Modal.Body>
                    </Modal>
                </>
            }
        </>
    )
};

export default Marketplace;
