import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import RewardHistory from './RewardHistory'
import axios from 'axios';
import copy from 'copy-to-clipboard';
import Star from '../media/star.svg';

const InviteAndEarn = () => {
    const [showReward, setshowReward] = useState(false);
    const [claim_reward_msg, setclaim_reward_msg] = useState('');
    const [referral_details, setreferral_details] = useState('');
    const [loader, setloader] = useState(true);
    const [my_ref_id, setmy_ref_id] = useState('');
    const [copied_to_clipboard, setcopied_to_clipboard] = useState('');
    const [copied_to_clipboard_code, setcopied_to_clipboard_code] = useState('');

    const rewardHistory = () => {
        setshowReward(true)
    }
    const claimReward = async () => {
        setclaim_reward_msg(
            <img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} alt='' />
        )
        var token = localStorage.getItem("token")
        var email = localStorage.getItem("email")
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const claimed = await axios.post("https://services.uaxwallet.com/api/claimReferralReward", {
            email: email
        }, config)
        setclaim_reward_msg(claimed.data)
    }

    const copyRefLink = async () => {
        copy(`https://uaxwallet.com/signup?ref_id=${my_ref_id}`);
        setcopied_to_clipboard("Copied to clipboard!")
        setTimeout(() => {
            setcopied_to_clipboard('')
        }, 2000)
    }
    const copyRefCode = async () => {
        copy(my_ref_id);
        setcopied_to_clipboard_code("Copied to clipboard!")
        setTimeout(() => {
            setcopied_to_clipboard_code('')
        }, 2000)
    }

    useEffect(() => {
        const initial = async () => {
            const token = localStorage.getItem("token");
            const email = localStorage.getItem("email");

            if (token && email) {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };

                try {
                    // Perform API calls concurrently
                    const [referralDetailsResponse, referralIdResponse] = await Promise.all([
                        axios.post("https://services.uaxwallet.com/api/getReferralBalanceAndNumber", { email: email }, config),
                        axios.post("https://services.uaxwallet.com/api/getReferralId", { email: email }, config)
                    ]);

                    // Set state with the responses
                    setreferral_details(referralDetailsResponse.data);
                    setmy_ref_id(referralIdResponse.data);
                    setloader(false);

                } catch (error) {
                    console.error("Error during API calls:", error);
                    // Handle error (e.g., show error message, retry, etc.)
                }
            } else {
                window.location.href = '/login';
            }
        };

        initial();
    }, []);

    return (
        <>
            {/* {loader?
    <div className='' style={{height:"80vh",position:"relative",backgroundColor:"#000"}}>
      <center style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
      <img src={WhiteLoader} style={{width:"3vw"}}/>
      </center>
    </div>
    :     */}
            <>
                {showReward ? <RewardHistory setshowReward={setshowReward} /> :

                    <div className="container" style={{ minHeight: "100vh" }}>
                        <div className='mt-3'>
                            <div className='dashboard_box_001____ px-4 mb-4 for_invite_and_earn_banner desk_view'>
                                <div className='my-5 for_device_difference____mx_5____'>
                                    <div className='mt-4'>
                                        <div className="row">
                                            <div className="col-lg-6 col-md-12 mt-3">
                                                <div className="parent d-flex align-items-center" style={{ height: "100%" }}>
                                                    <div className="px-4">
                                                        <h2 style={{ fontWeight: "900" }}>Refer Friends, Earn Coins Together</h2>
                                                        <br />
                                                        <small style={{ color: "#a8a8a8" }}>
                                                            Earn up to 50% of your friends' trading fees as a reward. Refer now and take control of your earnings!
                                                        </small>
                                                        <br />
                                                        <div className='row'>
                                                            <div className='col-md-6 col-md-12 text-left px-2'>
                                                                <Button
                                                                    style={{ fontWeight: "700", width: "100%" }}
                                                                    className="primary_btnn___ mt-4"
                                                                    variant="primary"
                                                                    type="submit"
                                                                    onClick={rewardHistory}
                                                                >
                                                                    <i className="fa fa-trophy" aria-hidden="true" style={{ marginRight: "5px" }}></i>
                                                                    Reward History
                                                                </Button>
                                                            </div>
                                                            <div className='col-md-6 col-md-12 px-2'>
                                                                <Button
                                                                    style={{ fontWeight: "700", width: "100%" }}
                                                                    className="primary_btnn___ mt-4"
                                                                    variant="primary"
                                                                    type="submit"
                                                                    onClick={claimReward}
                                                                >
                                                                    <i className="fa fa-money" aria-hidden="true" style={{ marginRight: "5px" }}></i>
                                                                    Claim Reward
                                                                </Button>
                                                                {/* {claim_reward_msg && (
                                        <div className="alert alert-success mt-3 text-center" role="alert">
                                        {claim_reward_msg}
                                        </div>
                                    )} */}
                                                            </div>
                                                            {claim_reward_msg && (
                                                                <div className="alert alert-success mt-3 text-center" role="alert">
                                                                    {claim_reward_msg}
                                                                </div>
                                                            )}
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-12 mt-3">
                                                <div className="card_design_for_refer_and_earn_component___ p-4">

                                                    <div className='settings_box_0003____ d-flex justify-content-between align-items-center'>
                                                        <span>
                                                            Total Reward Earned
                                                            <br />
                                                            <span style={{ color: "#32f220", fontSize: "20px", fontWeight: "900" }}>
                                                                {loader ?
                                                                    <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} />
                                                                    :
                                                                    <>
                                                                        {parseFloat(referral_details.ref_bonus).toFixed(2)} UAXN
                                                                    </>
                                                                }
                                                            </span>
                                                        </span>
                                                        <div className='' style={{ textAlign: "right" }}>
                                                            <span>Referred Friend</span><br />
                                                            <span style={{ color: "#c006de" }}>
                                                                {loader ?
                                                                    <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} />
                                                                    :
                                                                    <>
                                                                        {parseFloat(referral_details.ref_count)}
                                                                    </>
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='mt-5 d-flex justify-content-between align-items-center' style={{ color: "#a8a8a8" }}>
                                                        <small>REFERAL REWARD SLABS</small>
                                                        <small>REQUIRED</small>
                                                    </div>

                                                    <div className="slab-container mt-4">
                                                        <div className="slab-item current-slab">
                                                            <div className="slab-header">
                                                                <div className="slab-percentage" style={{ fontWeight: "900" }}>0%</div>
                                                                <div className="slab-range" style={{ fontWeight: "900" }}>0 - 500 UAXN</div>
                                                            </div>
                                                            <div className="slab-detail">
                                                                <small style={{ fontSize: "11px" }}>Starter Referrer</small>
                                                                {/* <span className="current-slab-amount" style={{fontSize:"11px"}}>You have 0 UAXN</span> */}
                                                            </div>
                                                        </div>

                                                        <div className="slab-item current-slab">
                                                            <div className="slab-header">
                                                                <div className="slab-percentage" style={{ fontWeight: "900" }}>15%</div>
                                                                <div className="slab-range" style={{ fontWeight: "900" }}>500 - 10,000 UAXN</div>
                                                            </div>
                                                            <div className="slab-detail">
                                                                <small style={{ fontSize: "11px" }}>Pro Referrer</small>
                                                                {/* <span className="current-slab-amount" style={{fontSize:"11px"}}>You have 0 UAXN</span> */}
                                                            </div>
                                                        </div>

                                                        <div className="slab-item current-slab">
                                                            <div className="slab-header">
                                                                <div className="slab-percentage" style={{ fontWeight: "900" }}>25%</div>
                                                                <div className="slab-range" style={{ fontWeight: "900" }}>10,000 - 50,000 UAXN</div>
                                                            </div>
                                                            <div className="slab-detail">
                                                                <small style={{ fontSize: "11px" }}>Elite Referrer</small>
                                                                {/* <span className="current-slab-amount" style={{fontSize:"11px"}}>You have 0 UAXN</span> */}
                                                            </div>
                                                        </div>

                                                        <div className="slab-item current-slab">
                                                            <div className="slab-header">
                                                                <div className="slab-percentage" style={{ fontWeight: "900" }}>50%</div>
                                                                <div className="slab-range" style={{ fontWeight: "900" }}>{'>'} 50,000 UAXN</div>
                                                            </div>
                                                            <div className="slab-detail">
                                                                <small style={{ fontSize: "11px" }}>Master Referrer</small>
                                                                {/* <span className="current-slab-amount" style={{fontSize:"11px"}}>You have 0 UAXN</span> */}
                                                            </div>
                                                        </div>

                                                        {/* <div className="slab-item">
                        <div className="slab-percentage">15%</div>
                        <div className="slab-range">500 - 10,000 UAXN</div>
                    </div>
                    <div className="slab-item">
                        <div className="slab-percentage">25%</div>
                        <div className="slab-range">10,000 - 50,000 UAXN</div>
                    </div>
                    <div className="slab-item">
                        <div className="slab-percentage">50%</div>
                        <div className="slab-range">{'>'} 50,000 UAXN</div>
                    </div> */}
                                                    </div>

                                                    <div className='mt-4 text-center'>
                                                        <hr style={{ borderTop: "1px solid #5f5e60" }} />
                                                        <small style={{ color: "#a8a8a8" }}>SHARE NOW</small>
                                                        <div className='mt-3' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            <img src={"https://images.uaxdlts.com/uax-dashboard/images/logos_facebook.svg"} alt="FB" style={{ margin: '0 10px' }} />
                                                            <img src={"https://images.uaxdlts.com/uax-dashboard/images/skill-icons_instagram.svg"} alt="IG" style={{ margin: '0 10px' }} />
                                                            <img src={"https://images.uaxdlts.com/uax-dashboard/images/prime_twitter.svg"} alt="TW" style={{ margin: '0 10px' }} />
                                                            <img src={"https://images.uaxdlts.com/uax-dashboard/images/logos_telegram.svg"} alt="IG" style={{ margin: '0 10px' }} />
                                                            <i className="fa fa-link" aria-hidden="true" style={{ cursor: "pointer" }} onClick={copyRefLink}></i>
                                                            {/* <img src={WA} alt="WA" style={{ margin: '0 10px' }} /> */}
                                                        </div>
                                                    </div>
                                                    <center className='mt-2'>
                                                        {copied_to_clipboard && (
                                                            <div className="alert alert-success mt-3 text-center" role="alert">
                                                                {copied_to_clipboard}
                                                            </div>
                                                        )}
                                                    </center>
                                                    <div className='mt-4 text-center'>
                                                        <small style={{ color: "#a8a8a8" }}>YOUR REFERRAL CODE</small><br />
                                                        <div className='mt-2'>
                                                            <span style={{ color: "#c006df" }}>{my_ref_id} <i className="fa fa-clipboard ml-2" style={{ cursor: "pointer" }} onClick={copyRefCode} aria-hidden="true"></i></span>
                                                            {copied_to_clipboard_code && (
                                                                <div className="alert alert-success mt-3 text-center" role="alert">
                                                                    {copied_to_clipboard_code}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mobile_view'>
                                <div className='my-5 for_device_difference____mx_5____'>
                                    <div className='mt-4'>
                                        <div className="row">
                                            <div className="col-lg-6 col-md-12 mt-3">
                                                <div className="parent" style={{ height: "100%" }}>
                                                    <div className="child__ px-0">
                                                        <div className='d-flex flex-column align-items-center justify-content-center'>
                                                            <h5 className='text-center'>
                                                                My Reward Points
                                                            </h5>
                                                            <span style={{ color: "#32f220", fontSize: "20px", fontWeight: "900" }} >
                                                                {loader ?
                                                                    <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "2vw" }} alt='' />
                                                                    :
                                                                    <>
                                                                        {parseFloat(referral_details.ref_bonus).toFixed(2)} UAXN
                                                                    </>
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className='row'>

                                                            <div className='col-md-6 col-sm-12 text-left px-0 d-flex flex-column align-items-center'>
                                                                <div
                                                                    style={{
                                                                        height: 16,
                                                                        width: '86%',
                                                                        borderRadius: 24,
                                                                        backgroundColor: '#3C0747',
                                                                        transform: 'translate(0,100%)',
                                                                        marginHorizontal: 'auto',
                                                                    }}
                                                                />
                                                                <div
                                                                    style={{
                                                                        height: 16,
                                                                        width: '92%',
                                                                        borderRadius: 24,
                                                                        backgroundColor: '#5F0A6D',
                                                                        transform: 'translate(0,50%)',
                                                                        marginHorizontal: 'auto',
                                                                    }}
                                                                />
                                                                <Button
                                                                    style={{ fontWeight: "700", width: "100%", borderRadius: 26 }}
                                                                    className="primary_btnn___ "
                                                                    variant="primary"
                                                                    type="submit"
                                                                    onClick={rewardHistory}
                                                                >
                                                                    <div className='d-flex gap-2 py-2'>
                                                                        <img src={Star} alt='no Star' />
                                                                        <div className='flex-fill'>
                                                                            <div className='d-flex justify-content-between'>
                                                                                <span
                                                                                    style={{
                                                                                        fontSize: 16,
                                                                                        fontWeight: 600
                                                                                    }}
                                                                                >Total Referrals</span>
                                                                                <i className="fa fa-arrow-up" aria-hidden="true"
                                                                                    style={{
                                                                                        transform: 'rotate(45deg)',
                                                                                        fontSize: 15
                                                                                    }}
                                                                                ></i>

                                                                            </div>
                                                                            <div className='text-start'
                                                                                style={{
                                                                                    fontSize: 12,
                                                                                    fontWeight: 400
                                                                                }}
                                                                            >
                                                                                So far, you have 5 referrals.
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Button>
                                                            </div>
                                                            {/* <div className='col-md-6 col-sm-12 px-0'>
                                                                <Button
                                                                    style={{ fontWeight: "700", width: "100%" }}
                                                                    className="primary_btnn___ mt-4"
                                                                    variant="primary"
                                                                    type="submit"
                                                                    onClick={claimReward}
                                                                >
                                                                    <i className="fa fa-money" aria-hidden="true" style={{ marginRight: "5px" }}></i>
                                                                    Claim Reward
                                                                </Button> */}
                                                            {/* {claim_reward_msg && (
                                        <div className="alert alert-success mt-3 text-center" role="alert">
                                        {claim_reward_msg}
                                        </div>
                                    )} */}
                                                            {/* </div> */}
                                                            {claim_reward_msg && (
                                                                <div className="alert alert-success mt-3 text-center" role="alert">
                                                                    {claim_reward_msg}
                                                                </div>
                                                            )}
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-12 mt-3 p-sm-2 p-0">

                                                <div className='mt-5 d-flex justify-content-between align-items-center' style={{ color: "#a8a8a8" }}>
                                                    <small>REFERAL REWARD SLABS</small>
                                                    <small>REQUIRED</small>
                                                </div>

                                                <div className="slab-container mt-4">
                                                    <div className="current-slab rounded-1">
                                                        <div className="slab-header mb-0 px-4 py-2">
                                                            <div className="slab-percentage" style={{ fontWeight: "900" }}>0%</div>
                                                            <div className="slab-range" style={{ fontWeight: "900" }}>0 - 500 UAXN</div>
                                                        </div>
                                                        <div className="slab-detail rounded-0 px-4">
                                                            <small style={{ fontSize: "11px" }}>Starter Referrer</small>
                                                            {/* <span className="current-slab-amount" style={{fontSize:"11px"}}>You have 0 UAXN</span> */}
                                                        </div>
                                                    </div>

                                                    <div className="current-slab rounded-1">
                                                        <div className="slab-header mb-0 px-4 py-2">
                                                            <div className="slab-percentage" style={{ fontWeight: "900" }}>15%</div>
                                                            <div className="slab-range" style={{ fontWeight: "900" }}>500 - 10,000 UAXN</div>
                                                        </div>
                                                        <div className="slab-detail rounded-0 px-4">
                                                            <small style={{ fontSize: "11px" }}>Pro Referrer</small>
                                                            {/* <span className="current-slab-amount" style={{fontSize:"11px"}}>You have 0 UAXN</span> */}
                                                        </div>
                                                    </div>

                                                    <div className="current-slab rounded-1">
                                                        <div className="slab-header mb-0 px-4 py-2">
                                                            <div className="slab-percentage" style={{ fontWeight: "900" }}>25%</div>
                                                            <div className="slab-range" style={{ fontWeight: "900" }}>10,000 - 50,000 UAXN</div>
                                                        </div>
                                                        <div className="slab-detail rounded-0 px-4">
                                                            <small style={{ fontSize: "11px" }}>Elite Referrer</small>
                                                            {/* <span className="current-slab-amount" style={{fontSize:"11px"}}>You have 0 UAXN</span> */}
                                                        </div>
                                                    </div>

                                                    <div className="current-slab rounded-1">
                                                        <div className="slab-header mb-0 px-4 py-2">
                                                            <div className="slab-percentage" style={{ fontWeight: "900" }}>50%</div>
                                                            <div className="slab-range" style={{ fontWeight: "900" }}>{'>'} 50,000 UAXN</div>
                                                        </div>
                                                        <div className="slab-detail rounded-0 px-4">
                                                            <small style={{ fontSize: "11px" }}>Master Referrer</small>
                                                            {/* <span className="current-slab-amount" style={{fontSize:"11px"}}>You have 0 UAXN</span> */}
                                                        </div>
                                                    </div>

                                                    {/* <div className="slab-item">
                        <div className="slab-percentage">15%</div>
                        <div className="slab-range">500 - 10,000 UAXN</div>
                    </div>
                    <div className="slab-item">
                        <div className="slab-percentage">25%</div>
                        <div className="slab-range">10,000 - 50,000 UAXN</div>
                    </div>
                    <div className="slab-item">
                        <div className="slab-percentage">50%</div>
                        <div className="slab-range">{'>'} 50,000 UAXN</div>
                    </div> */}
                                                </div>

                                                <div className='mt-4 text-center'>
                                                    <hr style={{ borderTop: "1px solid #5f5e60" }} />
                                                    <small style={{ color: "#a8a8a8" }}>SHARE NOW</small>
                                                    <div className='mt-3' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <img src={"https://images.uaxdlts.com/uax-dashboard/images/logos_facebook.svg"} alt="FB" style={{ margin: '0 10px' }} />
                                                        <img src={"https://images.uaxdlts.com/uax-dashboard/images/skill-icons_instagram.svg"} alt="IG" style={{ margin: '0 10px' }} />
                                                        <img src={"https://images.uaxdlts.com/uax-dashboard/images/prime_twitter.svg"} alt="TW" style={{ margin: '0 10px' }} />
                                                        <img src={"https://images.uaxdlts.com/uax-dashboard/images/logos_telegram.svg"} alt="IG" style={{ margin: '0 10px' }} />
                                                        <i className="fa fa-link" aria-hidden="true" style={{ cursor: "pointer" }} onClick={copyRefLink}></i>
                                                        {/* <img src={WA} alt="WA" style={{ margin: '0 10px' }} /> */}
                                                    </div>
                                                </div>
                                                <center className='mt-2'>
                                                    {copied_to_clipboard && (
                                                        <div className="alert alert-success mt-3 text-center" role="alert">
                                                            {copied_to_clipboard}
                                                        </div>
                                                    )}
                                                </center>
                                                <div className='mt-4 text-center'>
                                                    <small style={{ color: "#a8a8a8" }}>YOUR REFERRAL CODE</small><br />
                                                    <div className='mt-2'>
                                                        <span style={{ color: "#c006df" }}>{my_ref_id} <i className="fa fa-clipboard ml-2" style={{ cursor: "pointer" }} onClick={copyRefCode} aria-hidden="true"></i></span>
                                                        {copied_to_clipboard_code && (
                                                            <div className="alert alert-success mt-3 text-center" role="alert">
                                                                {copied_to_clipboard_code}
                                                            </div>
                                                        )}
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='dashboard_box_001____ px-4 mb-4'>
                                <div className='my-5 for_device_difference____mx_5____'>
                                    <div className='row text-center'>
                                        <div className='col-lg-3 col-md-6 col-sm-12'>
                                            <img src={"https://images.uaxdlts.com/uax-dashboard/images/upto.svg"} />
                                            <p className='mt-2'>Earn upto 50% as reward of every trading fee</p>
                                        </div>
                                        <div className='col-lg-3 col-md-6 col-sm-12'>
                                            <img src={"https://images.uaxdlts.com/uax-dashboard/images/Group 1000003219.svg"} />
                                            <p className='mt-2'>Payout every 24 hours</p>
                                        </div>
                                        <div className='col-lg-3 col-md-6 col-sm-12'>
                                            <img src={"https://images.uaxdlts.com/uax-dashboard/images/unlimited.svg"} />
                                            <p className='mt-2'>Unlimited referrals</p>
                                        </div>
                                        <div className='col-lg-3 col-md-6 col-sm-12'>
                                            <img src={"https://images.uaxdlts.com/uax-dashboard/images/unlimited rewards.svg"} />
                                            <p className='mt-2'>Unlimited rewards</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <center>
                                <p className='mt-5' style={{ fontWeight: "900", fontSize: "20px" }}>How it Works?</p>
                            </center>
                            <div className='row'>
                                <div className='col-md-4 col-sm-12 mt-2'>
                                    <div className='nft_box_0001____ p-4'>
                                        <div className='text-center'>
                                            <img className='img-fluid' src={"https://images.uaxdlts.com/uax-dashboard/images/get_link.png"} style={{ width: "50%" }} />
                                            <div className='' style={{ marginTop: "2rem" }}>
                                                <h5 style={{ fontWeight: "700", marginBottom: "1rem" }}>Get your link</h5>
                                                <small style={{ color: "#a8a8a8" }}>Join UAX and get your unique referral link.You'll earn for customers who signup through
                                                    this link.
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-4 col-sm-12 mt-2'>
                                    <div className='nft_box_0001____ p-4'>
                                        <div className='text-center'>
                                            <img className='img-fluid' src={"https://images.uaxdlts.com/uax-dashboard/images/share_link.png"} />
                                            <div className='' style={{ marginTop: "2rem" }}>
                                                <h5 style={{ fontWeight: "700", marginBottom: "1rem" }}>Share your link</h5>
                                                <small style={{ color: "#a8a8a8" }}>
                                                    Share your referral link via Telegram, Twitter, Emails, Whatsapp or anyway you want.
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-4 col-sm-12 mt-2'>
                                    <div className='nft_box_0001____ p-4'>
                                        <div className='text-center'>
                                            <img className='img-fluid' src={"https://images.uaxdlts.com/uax-dashboard/images/HODL.png"} style={{ width: "80%" }} />
                                            <div className='' style={{ marginTop: "2rem" }}>
                                                <h5 style={{ fontWeight: "700", marginBottom: "1rem" }}>HODL, Trade & Earn</h5>
                                                <small style={{ color: "#a8a8a8" }}>
                                                    HODL UAX, Trade a minimum of $1000 in the last 30 days, and earn upto 50% of your referral
                                                    trading fee as a reward.
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                }
            </>
            {/* } */}
        </>
    )
};

export default InviteAndEarn;
