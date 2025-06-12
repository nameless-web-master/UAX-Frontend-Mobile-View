import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

const MyCollections = () => {
    const [show, setShow] = useState(false);
    const [transfer_show, settransfer_show] = useState(false);
    const [wallet_address, setwallet_address] = useState('');
    const [list_for_sell_msg, setlist_for_sell_msg] = useState('');
    const [nft_list, setnft_list] = useState([]);
    const [loader, setloader] = useState(true);
    const [clicked_nft, setclicked_nft] = useState('');
    const [transfer_msg, settransfer_msg] = useState('');
    const [resWalletAddress, setresWalletAddress] = useState('');
    const [openAreaForListPrice, setOpenAreaForListPrice] = useState(false);
    const [listing_price, setlisting_price] = useState(0);


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
                setresWalletAddress(responseWalletAddress.data)
                const responseWallet = await axios.post('https://services.uaxwallet.com/api/getUserNFT', {
                    email: email
                }, config);
                // console.log(responseWallet.data)
                if (!responseWallet) {
                    setnft_list([])
                    setloader(false)
                }
                else {
                    setnft_list(responseWallet.data)
                    setloader(false)
                    // var nft_arr = []
                    // for(let i=0;i<responseWallet.data.length;i++){
                    //     if(responseWallet.data[i].new_owner_address==='NA'){
                    //         nft_arr.push(responseWallet.data[i])
                    //     }
                    //     else{
                    //         if(responseWallet.data[i].new_owner_address === responseWalletAddress.data){
                    //             nft_arr.push(responseWallet.data[i])
                    //         }
                    //     }
                    //     if(i==responseWallet.data.length-1){
                    //         setnft_list(nft_arr)
                    //         setloader(false)
                    //         // console.log("nft_arr",nft_arr)
                    //     }
                    // }
                }
            }
            else {
                window.location.href = '/login'
            }
        }
        initial();
    }, [])

    const transferOwnership = async () => {
        var token = localStorage.getItem("token")
        var email = localStorage.getItem("email")
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        settransfer_msg(<img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />)
        const transfer_ownership = await axios.post("https://services.uaxwallet.com/api/transferNFT", {
            email: email,
            nft_txn_id: clicked_nft.nft_txn_id,
            fileHash: clicked_nft.file_path,
            nft_lowest_price: clicked_nft.nft_lowest_price,
            newOwnerAddress: wallet_address
        }, config)
        // console.log(transfer_ownership.data)
        if (!transfer_ownership) {
            settransfer_msg("Something went wrong,Try again later")
        }
        else {
            if (transfer_ownership.data.success) {
                settransfer_msg(transfer_ownership.data.message)
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            }
            else {
                settransfer_msg(transfer_ownership.data.message)
            }
        }
    }

    const handleClose = () => {
        setShow(false);
        settransfer_show(false)
        setlist_for_sell_msg('')
        setOpenAreaForListPrice(false)
    }
    const handleShow = (data) => {
        setShow(true);
        setclicked_nft(data)
        // console.log(data)
    }
    const handleShowTransfer = () => {
        settransfer_show(true);
        setShow(false)
    }

    const listForSell_open_area = () => {
        setOpenAreaForListPrice(true)
    }

    const listForSell = async (e) => {
        e.preventDefault()
        var token = localStorage.getItem("token")
        var email = localStorage.getItem("email")
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        setlist_for_sell_msg(<img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />)
        if (parseFloat(listing_price) > 0) {
            const transfer_ownership = await axios.post("https://services.uaxwallet.com/api/listNFTForSell", {
                email: email,
                nft_txn_id: clicked_nft.nft_txn_id,
                listing_price: listing_price
            }, config)
            if (transfer_ownership.data.success) {
                setlist_for_sell_msg(transfer_ownership.data.message)
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            }
            else {
                setlist_for_sell_msg("Something went wrong,please try again later")
            }
        }
        else {
            setlist_for_sell_msg("Invalid listing price")
        }
    }

    const delistFromSell = async () => {
        var token = localStorage.getItem("token")
        var email = localStorage.getItem("email")
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        setlist_for_sell_msg(<img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />)
        const transfer_ownership = await axios.post("https://services.uaxwallet.com/api/deListNFTFromSell", {
            email: email,
            nft_txn_id: clicked_nft.nft_txn_id,
            nft_owner_address: clicked_nft.nft_owner_address
        }, config)
        if (transfer_ownership.data.success) {
            setlist_for_sell_msg(transfer_ownership.data.message)
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        }
        else {
            setlist_for_sell_msg("Something went wrong,please try again later")
        }

    }

    return (
        <>
            {loader ?
                <div className='' style={{ height: "80vh", position: "relative", backgroundImage: 'linear-gradient(#2B2330, #2218260F)', borderRadius: 6 }}>
                    <center style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                        <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "3vw" }} />
                    </center>
                </div>
                :
                <>
                    <div className='row'>
                        {nft_list.length > 0 ?
                            <>
                                {nft_list.map(index => {
                                    if (index.new_owner_address === 'NA') {
                                        if (index.nft_owner_address === resWalletAddress) {
                                            if (index.listed_for_sell === 'NO') {
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
                                                                    <small style={{ color: "#b6b6b6" }}>Price : <span style={{ color: "green", fontWeight: "900" }}>{index.nft_lowest_price} UAXN</span> ($7.70)</small>
                                                                    <i className="fa fa-exchange" style={{ float: "right" }} aria-hidden="true"></i>
                                                                </div>
                                                            </div>
                                                        </span>
                                                    </div>
                                                )
                                            }
                                            else {
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
                                                                    <small style={{ color: "#b6b6b6" }}>Price : <span style={{ color: "green", fontWeight: "900" }}>{index.nft_lowest_price} UAXN</span> ($7.70)</small>
                                                                    <i className="fa fa-exchange" style={{ float: "right" }} aria-hidden="true"></i>
                                                                </div>
                                                                <br />
                                                                <span style={{ padding: "4px", backgroundColor: "#c006df", borderRadius: "5px" }}>Listed</span>
                                                            </div>
                                                        </span>
                                                    </div>
                                                )
                                            }
                                        }
                                    }
                                    else {
                                        if (index.new_owner_address === resWalletAddress) {
                                            if (index.listed_for_sell === 'NO') {
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
                                                                    <small style={{ color: "#b6b6b6" }}>Price : <span style={{ color: "green", fontWeight: "900" }}>{index.nft_lowest_price} UAXN</span> ($7.70)</small>
                                                                    <i className="fa fa-exchange" style={{ float: "right" }} aria-hidden="true"></i>
                                                                </div>
                                                            </div>
                                                        </span>
                                                    </div>
                                                )
                                            }
                                            else {
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
                                                                    <small style={{ color: "#b6b6b6" }}>Price : <span style={{ color: "green", fontWeight: "900" }}>{index.nft_lowest_price} UAXN</span> ($7.70)</small>
                                                                    <i className="fa fa-exchange" style={{ float: "right" }} aria-hidden="true"></i>
                                                                </div>
                                                                <br />
                                                                <span style={{ padding: "4px", backgroundColor: "#c006df", borderRadius: "5px" }}>Listed</span>
                                                            </div>
                                                        </span>
                                                    </div>
                                                )
                                            }
                                        }
                                    }
                                })}
                            </>
                            :
                            <div className='' style={{ height: "80vh", position: "relative", backgroundImage: 'linear-gradient(#2B2330, #2218260F)', borderRadius: 6 }}>
                                <center style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                                    <img src={"https://images.uaxdlts.com/uax-dashboard/images/NO_DATA.svg"} style={{ width: "6vw" }} />
                                </center>
                            </div>
                        }
                    </div>


                    <Modal centered show={show} onHide={handleClose} size="lg">
                        <Modal.Body className='mobile_responsiveness' style={{ padding: '5%', backgroundColor: '#1a181b', border: 'none', color: "#fff", borderRadius: "12px", minHeight: "90vh" }}>
                            <div className='' style={{ position: "relative", height: "100%", width: "100%" }}>
                                <div>
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
                                                    <div className='col-md-6 col-sm-12 mt-1'>
                                                        {clicked_nft ?
                                                            clicked_nft.listed_for_sell === 'Yes' ?
                                                                <>
                                                                    <button
                                                                        disabled
                                                                        className="headerGrad"
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            backgroundColor: "grey ",
                                                                            color: "white",
                                                                            minWidth: "100%",
                                                                            fontWeight: "600",
                                                                            fontSize: "16px",
                                                                            // border: "1px solid #c006df",
                                                                            marginRight: "0px",
                                                                            minHeight: "5vh",
                                                                            borderRadius: ".25rem",
                                                                        }}
                                                                    >
                                                                        <span style={{ fontSize: "14px" }}> Transfer Now</span>
                                                                    </button>
                                                                </>
                                                                :
                                                                <>
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
                                                                        onClick={handleShowTransfer}
                                                                    >
                                                                        <span style={{ fontSize: "14px" }}> Transfer Now</span>
                                                                    </button>
                                                                </>
                                                            :
                                                            ''
                                                        }
                                                    </div>
                                                    <div className='col-md-6 col-sm-12 mt-1'>
                                                        {clicked_nft ?
                                                            clicked_nft.listed_for_sell === 'Yes' ?
                                                                <>
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
                                                                        onClick={delistFromSell}
                                                                    >
                                                                        <span style={{ fontSize: "14px" }}> Delist from sell</span>
                                                                    </button>
                                                                </>
                                                                :
                                                                <>
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
                                                                        onClick={listForSell_open_area}
                                                                    >
                                                                        <span style={{ fontSize: "14px" }}> List for sell</span>
                                                                    </button>
                                                                </>
                                                            : ''}
                                                    </div>
                                                </div>
                                                <div className='mt-4'>
                                                    {openAreaForListPrice ?
                                                        <form>
                                                            <div className="form-group">
                                                                <label htmlFor="" style={{ fontWeight: "700" }}>
                                                                    Listing Price*
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className="mt-2"
                                                                    id="searchQueryInput"
                                                                    aria-describedby=""
                                                                    placeholder="Enter Listing Price Eg.- 12 UAXN"
                                                                    style={{ backgroundColor: '#1a181b' }}
                                                                    onChange={(e) => setlisting_price(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="form-group mt-3">
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
                                                                    onClick={listForSell}
                                                                >
                                                                    <span style={{ fontSize: "14px" }}> Place</span>
                                                                </button>
                                                            </div>
                                                        </form>
                                                        :
                                                        ''
                                                    }
                                                </div>
                                                {list_for_sell_msg && (
                                                    <div className="alert alert-success mt-3 text-center" role="alert">
                                                        {list_for_sell_msg}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </Modal.Body>
                    </Modal>

                    <Modal centered show={transfer_show} onHide={handleClose} size="">
                        <Modal.Body style={{ padding: '5%', backgroundColor: '#1a181b', border: 'none', color: "#fff", borderRadius: "12px" }}>
                            <center>
                                <p style={{ fontWeight: '700', fontSize: '20px', marginTop: '15px' }}>{clicked_nft.nft_name}</p>
                                <img className='img-fluid' src={`https://nfts.uax.capital/${clicked_nft ? clicked_nft.file_path.split('/').pop() : ''}`} style={{ borderRadius: "10px" }} />
                                <br /><br />
                                <small style={{ fontWeight: '600' }}>ID : {clicked_nft.nft_txn_id}</small>
                                <br />
                                <small style={{ fontWeight: '600' }}>Owner Address : {clicked_nft.new_owner_address === 'NA' ? clicked_nft.nft_owner_address : clicked_nft.new_owner_address}</small>
                            </center>
                            <div style={{ marginTop: '30px' }}>
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="" style={{ fontWeight: "700" }}>
                                            Wallet Address*
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-2"
                                            id="searchQueryInput"
                                            aria-describedby=""
                                            placeholder="Recipient Wallet Address"
                                            style={{ backgroundColor: '#403242' }}
                                            onChange={(e) => setwallet_address(e.target.value)}
                                        />
                                    </div>
                                    {/* <br/>
                        <div className="form-group">
                            <label htmlFor="" style={{ fontWeight: "700" }}>
                            Transfer Price*
                            </label>
                            <input
                            type="number"
                            className="mt-2"
                            id="searchQueryInput"
                            aria-describedby=""
                            placeholder="Transfer Price"
                            style={{ backgroundColor: '#403242' }}
                            onChange={(e)=>settransfer_price(e.target.value)}
                            />
                        </div> */}
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
                                            onClick={transferOwnership}
                                        >
                                            <span style={{ fontSize: "14px" }}> Transfer</span>
                                        </button>
                                        {transfer_msg && (
                                            <div className="alert alert-success mt-3 text-center" role="alert">
                                                {transfer_msg}
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


export default MyCollections;
