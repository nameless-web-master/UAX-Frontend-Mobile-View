import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import Modal from 'react-bootstrap/Modal';
import copy from "copy-to-clipboard";
import { CloseButton } from 'react-bootstrap';


const Settings = () => {
  const [loader, setloader] = useState(true);
  const [content2FA, setcontent2FA] = useState(false);
  const [qrcodeData, setqrcodeData] = useState('');
  const [twoFAmsg, settwoFAmsg] = useState('');
  const [popupmsg, setpopupmsg] = useState('');
  const [otpcode, setotpcode] = useState('');
  const [otpmodal, setotpmodal] = useState(false);
  const [email, setemail] = useState('');
  const [wallet_address, setwallet_address] = useState('');
  const [oldPassword, set_oldPassword] = useState('');
  const [newPassword, set_newPassword] = useState('');
  const [c_newPassword, set_c_newPassword] = useState('');

  const [show_oldPassword, set_show_oldPassword] = useState(false);
  const [show_newPassword, set_show_newPassword] = useState(false);
  const [show_c_newPassword, set_show_c_newPassword] = useState(false);



  const [successMessageChangePassword, setsuccessMessageChangePassword] = useState('');
  const [otpmodal_of_change_password, setotpmodal_of_change_password] = useState(false);
  const [TFACode, setTFACode] = useState('');
  const [change_pass_initial_validation_msg, setchange_pass_initial_validation_msg] = useState('');
  const [generate_key_message, setgenerate_key_message] = useState('');
  const [showValidatorKey, setshowValidatorKey] = useState([]);
  const [copied, setcopied] = useState(false);

  const [openTicketModal, setOpenTicketModal] = useState(false);
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [contact, setContact] = useState('');
  const [all_support_tickets, setall_support_tickets] = useState([]);
  const [createnew_ticket_message, setcreatenew_ticket_message] = useState('');
  const [openTicketDetailsModal, setopenTicketDetailsModal] = useState(false);
  const [ticketDetails, setTicketDetails] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [validator_loader, setvalidator_loader] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const ticketsPerPage = 3;
  const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml", "video/mp4"];
  const maxFileSize = 5 * 1024 * 1024;

  const updateTicketData = async (data) => {
    setTicketDetails(data)
    setopenTicketDetailsModal(true)
  };

  const copyKey = (key) => {
    copy(key);
    setcopied(true);
    setTimeout(() => {
      setcopied(false);
    }, 2000);
  };

  const fetchMachineID = async (validatorKey) => {
    try {
      const response = await axios.post(`https://webservices.uaxwallet.com/get_my_machine_id`, { validator_key: validatorKey });
      return response.data.message;
    } catch (error) {
      console.error('Error fetching machine ID:', error);
      return 'Error';
    }
  };

  const fetchAllSupportTickets = async () => {
    try {
      var token = localStorage.getItem("token");
      var email = localStorage.getItem("email");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.post(`https://services.uaxwallet.com/api/getSupportTickets`, { email: email }, config);
      setall_support_tickets(response.data.tickets.reverse());
    } catch (error) {
      console.error('Error fetching support tickets :', error);
    }
  };

  const createTicket = async () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    // Validate email
    if (!email) {
      setcreatenew_ticket_message("Email is required.");
      return;
    }

    // Validate subject
    if (!subject || subject.trim() === "") {
      setcreatenew_ticket_message("Subject is required.");
      return;
    }

    // Validate query
    if (!query || query.trim() === "") {
      setcreatenew_ticket_message("Query is required.");
      return;
    }

    // Validate file
    if (!selectedFile) {
      setcreatenew_ticket_message("File is required.");
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      setcreatenew_ticket_message("Invalid file type. Only PNG, JPEG, SVG, and MP4 are allowed.");
      return;
    }

    if (selectedFile.size > maxFileSize) {
      setcreatenew_ticket_message("File size exceeds 5MB limit.");
      return;
    }

    // Show loading state
    setcreatenew_ticket_message(
      <img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />
    );

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("email", email);
    formData.append("subject", subject.trim());
    formData.append("query", query.trim());

    try {
      const api_res = await axios.post(
        "https://services.uaxwallet.com/api/createNewSupportTicket",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setcreatenew_ticket_message(api_res.data.message);

      // Clear form and fetch tickets
      setTimeout(() => {
        fetchAllSupportTickets();
        setcreatenew_ticket_message('');
        setOpenTicketModal(false);
      }, 2000);
    } catch (error) {
      setcreatenew_ticket_message("Failed to create ticket. Please try again.");
      console.error("Error creating ticket:", error);
    }
  };


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setcreatenew_ticket_message("No file selected.");
      return;
    }

    if (file.size > maxFileSize) {
      setcreatenew_ticket_message("File size exceeds 5MB limit.");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setcreatenew_ticket_message("Invalid file type. Only PNG, JPEG, SVG, and MP4 are allowed.");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      // console.log("Base64 preview:", reader.result); 
    };
    reader.readAsDataURL(file);

    setcreatenew_ticket_message('');
  };


  const generateKey = async () => {
    var token = localStorage.getItem("token")
    var email = localStorage.getItem("email")
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    setgenerate_key_message(
      <img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />
    )
    const api_res = await axios.post("https://services.uaxwallet.com/api/generate_validator_key", {
      email: email
    }, config)
    setgenerate_key_message(api_res.data.message)
    setTimeout(() => {
      fetchallValidatorKeys();
      setgenerate_key_message('')
    }, 2000)
  }

  const fetchallValidatorKeys = async () => {
    var token = localStorage.getItem("token")
    var email = localStorage.getItem("email")
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const fetch_validator_key = await axios.post("https://services.uaxwallet.com/api/fetch_validator_key", {
      email: email
    }, config)
    if (fetch_validator_key.data.success) {
      var keys = []
      if (fetch_validator_key.data.validator_keys.length > 0) {
        for (let i = 0; i < fetch_validator_key.data.validator_keys.length; i++) {
          const machine_id = await fetchMachineID(fetch_validator_key.data.validator_keys[i])
          // console.log(fetch_validator_key.data.validator_keys[i])
          keys.push({ machine_id: machine_id, validator_key: fetch_validator_key.data.validator_keys[i] })
          setshowValidatorKey(keys)
          if (i == fetch_validator_key.data.validator_keys.length) {
            setvalidator_loader(false)
          }
        }
      }
      setvalidator_loader(false)
    }
    else {
      setshowValidatorKey([])
      setvalidator_loader(false)
    }
  }

  useEffect(() => {
    const initialFunction = async () => {
      var token = localStorage.getItem("token")
      var email = localStorage.getItem("email")
      if (token && email) {
        setemail(email)
        setloader(false)
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        fetchallValidatorKeys();
        fetchAllSupportTickets();
        const responseWallet = await axios.post('https://services.uaxwallet.com/api/getUserWallet', {
          email: email
        }, config);
        setwallet_address(responseWallet.data)
        const responseToken = await axios.post('https://services.uaxwallet.com/api/verifyToken', {
          token: token,
          email: email
        });
        // console.log(responseToken.data.enabledtwofactorauth)
        if (responseToken.data) {
          var check2FA = await axios.post("https://services.uaxwallet.com/api/check2FAEnabled", {
            email: email
          })
        }
        if (check2FA.data == true) {
          localStorage.setItem('cloudenabledtwofactorauth', true)
          getDetails();
        }
        else if (responseToken.data === "Token Expired") {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
      else {
        window.location.href = "/login"
      }
    }
    initialFunction()
  }, [])

  const getDetails = () => {
    if (localStorage.getItem('cloudenabledtwofactorauth').toString() === 'true') {
      let encryptedQRdata = localStorage.getItem('cloudqrdata')
      let qrcodeData = CryptoJS.enc.Base64.parse(encryptedQRdata).toString(CryptoJS.enc.Utf8)
      setqrcodeData(qrcodeData)
      setcontent2FA(true)
    }
    else {
      setcontent2FA(false)
    }
  }

  const handleSubmit2FACode = () => {
    setpopupmsg(<img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "3vw" }} />)
    var emaill = localStorage.getItem("email")
    if (emaill) {
      var encrypted = CryptoJS.AES.encrypt(emaill, "key")
      var secret = localStorage.getItem("cloudsecret")
      axios.post("https://services.uaxwallet.com/api/confirmEnableTwoFA", { encrypt1: encrypted.toString(), token: otpcode, secret: secret })
        .then(res => {

          if (res.data != "2FA Verfication failed,you can't enable 2FA") {
            localStorage.setItem('cloudenabledtwofactorauth', true);
            var a = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(res.data))
            localStorage.setItem("cloudqrdata", a);
            setpopupmsg('2FA Enabled Successfully')
            getDetails();
            setTimeout(() => {
              setotpmodal(false)
            }, 2000)
          }
          else {
            setpopupmsg(res.data)
          }
        })
        .catch(err => {
          console.log(err)
          setpopupmsg("Something went wrong , try again later.")
        })
    }
    else {
      setpopupmsg("Something went wrong , try again later.")
    }
  }

  const enableTwoFA = () => {
    settwoFAmsg(<img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "3vw" }} />)
    var emaill = localStorage.getItem("email")
    if (emaill) {
      var encrypted = CryptoJS.AES.encrypt(emaill, "key")
      axios.post("https://services.uaxwallet.com/api/enableTwoFA", { encrypt1: encrypted.toString() })
        .then(res => {
          // localStorage.setItem('cloudenabledtwofactorauth',true);
          var a = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(res.data))
          let qrcodeData = CryptoJS.enc.Base64.parse(a).toString(CryptoJS.enc.Utf8)
          // localStorage.setItem("cloudqrdata",a);
          setotpmodal(true)
          setqrcodeData(qrcodeData)
          settwoFAmsg('')
          // console.log()
          //  getDetails();
        })
        .catch(err => {
          settwoFAmsg("Something went wrong , try again later.")
        })
    }
    else {
      settwoFAmsg("Something went wrong , try again later.")
    }
  }

  const handleClose = () => {
    setotpmodal(false)
    setpopupmsg('')
    settwoFAmsg('')
    setotpmodal_of_change_password(false)
    setchange_pass_initial_validation_msg('')
    setsuccessMessageChangePassword('')
    setOpenTicketModal(false)
    setcreatenew_ticket_message('')
    setopenTicketDetailsModal(false)
  };

  const submitChnagePassword = async () => {
    let secret = localStorage.getItem('cloudsecret');
    setsuccessMessageChangePassword(
      <img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />
    )
    if (!secret) {
      setsuccessMessageChangePassword("Invalid secret code")
    }
    else {
      if (oldPassword.length > 0 && newPassword.length > 0 && TFACode.length > 0) {
        if (newPassword === c_newPassword) {
          const encrypt1 = CryptoJS.AES.encrypt(email, 'key').toString();
          const encrypt2 = CryptoJS.AES.encrypt(oldPassword, 'key').toString();
          const change_pass = await axios.post("https://services.uaxwallet.com/api/AccChangePass", {
            encrypt1: encrypt1,
            encrypt2: encrypt2,
            newPass: newPassword,
            token: TFACode,
            secret: secret
          })
          setsuccessMessageChangePassword(change_pass.data)
          if (change_pass.data === 'Password changed successfully') {
            setTimeout(() => {
              localStorage.clear();
              window.location.href = "/login"
            }, 2000)
          }
        }
        else {
          setsuccessMessageChangePassword("Password doesn't match")
        }
      }
      else {
        setsuccessMessageChangePassword("Old password, new password and 2FA OTP are required")
      }
    }
  }

  const handleChnagePassword = async () => {
    setchange_pass_initial_validation_msg(
      <img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />
    )
    if (oldPassword.length > 0 && newPassword.length > 0) {
      if (newPassword === c_newPassword) {
        setotpmodal_of_change_password(true)
        setchange_pass_initial_validation_msg('')
      }
      else {
        setchange_pass_initial_validation_msg("Password doesn't match")
      }
    }
    else {
      setchange_pass_initial_validation_msg("Old password, new password and 2FA OTP are required")
    }
  }
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = all_support_tickets.slice(indexOfFirstTicket, indexOfLastTicket);

  // Pagination logic
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(all_support_tickets.length / ticketsPerPage);
  return (
    <>
      {/* {loader?
    <div className='' style={{height:"80vh",position:"relative",backgroundColor:"#000"}}>
      <center style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
      <i className="fa fa-circle-o-notch fa-spin" style={{ fontSize: "30px" }}></i>
      </center>
    </div>
    : */}
      <div className="container" style={{ minHeight: "100vh" }}>
        <div className='mt-3'>
          <div className='dashboard_box_001____ px-4 mb-4'>
            <div className='my-5 for_device_difference____mx_5____'>
              <div className='mt-4'>
                <div className="row">
                  <div className="col-lg-3 col-md-12 mt-3 nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical" style={{ borderRight: "1px solid #2b272a" }}>
                    <button className="nav-link" id="v-pills-disabled-tab" data-bs-toggle="pill" data-bs-target="#v-pills-disabled" type="button" role="tab" aria-controls="v-pills-disabled" aria-selected="false" disabled style={{ color: "#bab8b8" }}>General</button>
                    <button className="nav-link active customized_nav_pills____" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">Basic Information</button>
                    <button className="nav-link customized_nav_pills____" id="v-pills-messages-tab" data-bs-toggle="pill" data-bs-target="#v-pills-messages" type="button" role="tab" aria-controls="v-pills-messages" aria-selected="false">Wallet Settings</button>
                    {/* <button className="nav-link customized_nav_pills____" id="v-pills-settings-tab" data-bs-toggle="pill" data-bs-target="#v-pills-settings" type="button" role="tab" aria-controls="v-pills-settings" aria-selected="false">Validator Key</button> */}
                    <button className="nav-link customized_nav_pills____" id="v-pills-support-tab" data-bs-toggle="pill" data-bs-target="#v-pills-support" type="button" role="tab" aria-controls="v-pills-settings" aria-selected="false">Support Tickets</button>
                  </div>
                  <div className="col-lg-9 col-md-12 mt-3 tab-content" id="v-pills-tabContent">
                    <div className="tab-pane fade show active px-2" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab" tabIndex="0">
                      <p className='' style={{ fontWeight: "900", fontSize: "20px" }}>Basic Information</p>
                      <form className="g-3 mt-5">
                        <div className='row'>
                          <div className="col-md-6">
                            <label htmlFor="inputFullName" className="form-label">Email</label>
                            <div className="input-group">
                              <input value={email} type="text" className="form-control customized_input_box_basic_settings_____" id="inputFullName" disabled />
                              {/* <span className="input-group-text" style={{backgroundColor:"#403242",border:"none",color:"#fff"}}>
                              <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                            </span> */}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="inputDisplayName" className="form-label">Wallet Address</label>
                            <div className="input-group">
                              <input type="text" value={wallet_address} className="form-control customized_input_box_basic_settings_____" id="inputDisplayName" disabled />
                              {/* <span className="input-group-text" style={{backgroundColor:"#403242",border:"none",color:"#fff"}}>
                              <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                            </span> */}
                            </div>
                          </div>
                        </div>

                        {/* <div className='mt-5'>
                      <p className='' style={{ fontWeight: "900", fontSize: "20px" }}>Change Password</p>
                      <div className='row'>
                        <div className="col-md-6">
                          <label htmlFor="inputPassword" className="form-label">Old Password</label>
                          <div className="input-group">
                            <input type="password" onChange={(e)=>set_oldPassword(e.target.value)} className="form-control customized_input_box_basic_settings_____" id="inputPassword" />
                            <span className="input-group-text" style={{backgroundColor:"#403242",border:"none",color:"#fff"}}>
                              <i className="fa fa-eye-square-o" aria-hidden="true"></i>
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="inputEmail" className="form-label">New Password</label>
                          <div className="input-group">
                            <input type="password" onChange={(e)=>set_newPassword(e.target.value)} className="form-control customized_input_box_basic_settings_____" id="inputEmail" />
                            <span className="input-group-text" style={{backgroundColor:"#403242",border:"none",color:"#fff"}}>
                              <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='row mt-2'>
                       <div className="col-md-6">
                       <label htmlFor="inputEmail" className="form-label">Confirm New Password</label>
                          <div className="input-group">
                            <input type="password" onChange={(e)=>set_c_newPassword(e.target.value)} className="form-control customized_input_box_basic_settings_____" id="inputEmail" />
                            <span className="input-group-text" style={{backgroundColor:"#403242",border:"none",color:"#fff"}}>
                              <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      </div> */}
                        <div className='mt-5'>
                          <p className='' style={{ fontWeight: "900", fontSize: "20px" }}>Change Password</p>
                          <div className='row'>
                            {/* Old Password */}
                            <div className="col-md-6">
                              <label htmlFor="inputPassword" className="form-label">Old Password</label>
                              <div className="input-group">
                                <input
                                  type={show_oldPassword ? "text" : "password"}
                                  onChange={(e) => set_oldPassword(e.target.value)}
                                  className="form-control customized_input_box_basic_settings_____"
                                // id="inputPassword"
                                />
                                <span
                                  className="input-group-text"
                                  style={{ backgroundColor: "#403242", border: "none", color: "#fff", cursor: "pointer" }}
                                  onClick={() => set_show_oldPassword(!show_oldPassword)}
                                >
                                  <i className={`fa ${show_oldPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                                </span>
                              </div>
                            </div>

                            {/* New Password */}
                            <div className="col-md-6">
                              <label htmlFor="inputEmail" className="form-label">New Password</label>
                              <div className="input-group">
                                <input
                                  type={show_newPassword ? "text" : "password"}
                                  onChange={(e) => set_newPassword(e.target.value)}
                                  className="form-control customized_input_box_basic_settings_____"
                                // id="inputEmail"
                                />
                                <span
                                  className="input-group-text"
                                  style={{ backgroundColor: "#403242", border: "none", color: "#fff", cursor: "pointer" }}
                                  onClick={() => set_show_newPassword(!show_newPassword)}
                                >
                                  <i className={`fa ${show_newPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className='row mt-2'>
                            {/* Confirm New Password */}
                            <div className="col-md-6">
                              <label htmlFor="inputEmail" className="form-label">Confirm New Password</label>
                              <div className="input-group">
                                <input
                                  type={show_c_newPassword ? "text" : "password"}
                                  onChange={(e) => set_c_newPassword(e.target.value)}
                                  className="form-control customized_input_box_basic_settings_____"
                                  id="inputEmail"
                                />
                                <span
                                  className="input-group-text"
                                  style={{ backgroundColor: "#403242", border: "none", color: "#fff", cursor: "pointer" }}
                                  onClick={() => set_show_c_newPassword(!show_c_newPassword)}
                                >
                                  <i className={`fa ${show_c_newPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button
                          className="w-100 primary_btnn___ mt-3"
                          variant="primary"
                          type="button"
                          onClick={handleChnagePassword}
                        >
                          Change Password
                        </Button>
                        {change_pass_initial_validation_msg && (
                          <div className="alert alert-success mt-3 text-center" role="alert">
                            {change_pass_initial_validation_msg}
                          </div>
                        )}
                      </form>
                      {/* <p className='mt-5' style={{ fontWeight: "900", fontSize: "20px" }}>Email Subscription</p>
                    <div className='settings_box_0002____ d-flex justify-content-between align-items-center'>
                        <span>
                        Signup to receive UAX emails and get exclusive content, events and more!
                        </span>
                        <Button
                          style={{
                            // marginLeft: "10px",
                            backgroundColor: "transparent",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            border: "1px solid #5b505c"
                          }}>
                          Open
                        </Button>
                    </div> */}
                    </div>
                    <div className="tab-pane fade px-2" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab" tabIndex="0">
                      <p className='' style={{ fontWeight: "900", fontSize: "20px" }}>Account Security</p>
                      <div className='settings_box_0003____ mt-5'>


                        <div className='d-flex justify-content-between align-items-center'>

                          {content2FA ?
                            <>
                              <center style={{ width: "100%" }}>
                                <p className='' style={{ fontWeight: "900", fontSize: "20px" }}>2FA Code</p>
                                <img src={qrcodeData} style={{ height: '25vh' }} />
                              </center>
                            </>
                            :
                            <>
                              <span>
                                2-Factor Authentication
                              </span>
                              <Button
                                onClick={enableTwoFA}
                                style={{
                                  marginLeft: "10px",
                                  backgroundColor: "#c006de",
                                  paddingLeft: "15px",
                                  paddingRight: "15px",
                                  paddingTop: "5px",
                                  paddingBottom: "5px",
                                  border: "1px solid #5b505c"
                                }}>
                                Enable
                              </Button>
                            </>
                          }


                        </div>
                        {twoFAmsg ?
                          <center className='my-4'>
                            <span>{twoFAmsg}</span>
                          </center>
                          :
                          ''
                        }

                      </div>
                      <p className='mt-5' style={{ fontWeight: "900", fontSize: "20px" }}>Wallet Settings</p>
                      <span className='' style={{ fontWeight: "900", fontSize: "15px" }}>Authorized Apps</span><br />
                      {/* <small style={{color:"#a8a8a8"}}>List of dApps got permission granted via UAXJS</small> */}
                      <div className='settings_box_0003____ mt-4'>
                        <div className='row mt-3 cusomized_box_from_settings_wallet_mx_5'>
                          <div className='col-md-6 col-sm-12'>
                            <img src={"https://images.uaxdlts.com/uax-dashboard/images/mob.svg"} className='w-100' />
                          </div>
                          <div className='col-md-6 col-sm-12 my-3'>
                            <div className='parent' style={{ height: "100%" }}>
                              <div className='child' style={{ position: "relative" }}>
                                <h5>
                                  Create your UAX account to start using <span style={{ color: "#c006de" }}>wallet</span> features
                                </h5>
                                <Button
                                  style={{ fontWeight: "900", backgroundColor: "grey" }}
                                  className="primary_btnn___ mt-3"
                                  variant="primary"
                                  type="submit"
                                  disabled
                                >
                                  Create Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade px-2" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab" tabIndex="0">
                      <p className='' style={{ fontWeight: "900", fontSize: "20px" }}>Developer Settings</p>
                      {/* {showValidatorKey==='Not available'? */}
                      <>
                        <div className='settings_box_0003____ mt-5 d-flex justify-content-between align-items-center'>
                          <span>
                            Generate Validator Key
                            {/* <br/>
                        <span>Use UAX API to streamline and automate some actions</span> */}
                          </span>
                          <Button
                            onClick={generateKey}
                            style={{
                              marginLeft: "10px",
                              backgroundColor: "#c006de",
                              paddingLeft: "15px",
                              paddingRight: "15px",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                              border: "1px solid #5b505c"
                            }}>
                            Generate
                          </Button>
                        </div>
                        {generate_key_message && (
                          <div className="alert alert-success mt-3 text-center" role="alert">
                            {generate_key_message}
                          </div>
                        )}
                      </>
                      {/* // :
                  // ''
                  // } */}
                      {showValidatorKey.length == 0 ?
                        <>
                          <div className='settings_box_0003____ mt-3'>
                            <div className='d-flex justify-content-between align-items-center'>
                              <span>
                                <br />
                                <span>Generated UAX Validator Key</span>
                              </span>
                              {/* <Button
                          style={{
                            marginLeft: "10px",
                            backgroundColor: "#c006de",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            border: "1px solid #5b505c"
                          }}>
                          Request
                        </Button> */}
                            </div>
                            <div className='mt-4 px-3'>
                              <Table responsive style={{}}>
                                <tbody>
                                  <th className='table_header_class_dev_settings____'>Key</th>
                                  <th className='table_header_class_dev_settings____'>Machine ID</th>
                                  {/* <th className='table_header_class_dev_settings____'>dApp Name</th>
                            <th className='table_header_class_dev_settings____'>Redirect URL</th> */}
                                  <th className='table_header_class_dev_settings____'>Status</th>
                                  {/* <th className='table_header_class_dev_settings____'>Action</th> */}
                                </tbody>
                              </Table>
                              <div className='text-center pb-3'>
                                <img src={"https://images.uaxdlts.com/uax-dashboard/images/NO_DATA.svg"} />
                              </div>
                            </div>
                          </div>
                        </>
                        :
                        <div className='settings_box_0003____ mt-3'>
                          <div className='d-flex justify-content-between align-items-center'>
                            <span>
                              {/* OAuth
                        <br/> */}
                              <span>Generated UAX Validator Key</span>
                            </span>
                            {/* <Button
                          style={{
                            marginLeft: "10px",
                            backgroundColor: "#c006de",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            border: "1px solid #5b505c"
                          }}>
                          Request
                        </Button> */}
                          </div>
                          <div className='mt-4 px-3'>
                            <Table responsive style={{}}>
                              <tbody>
                                <th className='table_header_class_dev_settings____'>Key</th>
                                <th className='table_header_class_dev_settings____'>Machine ID</th>
                                {/* <th className='table_header_class_dev_settings____'>Redirect URL</th> */}
                                <th className='table_header_class_dev_settings____'>Status</th>
                                {/* <th className='table_header_class_dev_settings____'>Action</th> */}
                                {validator_loader ?
                                  <>
                                    {/* <img src={WhiteLoader} style={{width:"3vw"}}/> */}
                                  </>
                                  :
                                  <>
                                    {showValidatorKey.map(index => {
                                      return (
                                        <tr>
                                          <td className='table_header_class_dev_settings____ px-0' style={{ color: "#fff" }}>
                                            {index.validator_key}
                                            <i
                                              style={{ cursor: "pointer", marginLeft: "5px" }}
                                              onClick={() => copyKey(index.validator_key)}
                                              className="fa fa-clipboard"
                                              aria-hidden="true"
                                            ></i>
                                          </td>
                                          <td className='table_header_class_dev_settings____ px-0' style={{ color: "#fff" }}>
                                            {index.machine_id === 'Key not found' ? 'Not in use' : index.machine_id}
                                          </td>
                                          <td className='table_header_class_dev_settings____ px-0' style={{ color: "#fff" }}>Active</td>
                                        </tr>
                                      )
                                    })}
                                  </>

                                }

                                {copied ? (
                                  <span style={{ color: "lightgreen", marginLeft: "5px" }}>
                                    Copied to clipboard!
                                  </span>
                                ) : (
                                  ""
                                )}

                              </tbody>
                            </Table>
                            {validator_loader ?
                              <div className='text-center pb-3'>
                                <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "3vw" }} />
                              </div>
                              :
                              ''
                            }
                            {/* <div className='text-center pb-3'>
                            <tr></tr>
                        </div> */}
                          </div>
                        </div>
                      }

                    </div>

                    <div className="tab-pane fade px-2" id="v-pills-support" role="tabpanel" aria-labelledby="v-pills-support-tab" tabIndex="0">
                      <p className='' style={{ fontWeight: "900", fontSize: "20px" }}>Support Ticket</p>
                      <>
                        <div className='settings_box_0003____ mt-5 d-flex justify-content-between align-items-center'>
                          <span>
                            Create Support Ticket
                          </span>
                          <Button
                            onClick={() => setOpenTicketModal(true)}
                            style={{
                              marginLeft: "10px",
                              backgroundColor: "#c006de",
                              paddingLeft: "15px",
                              paddingRight: "15px",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                              border: "1px solid #5b505c"
                            }}>
                            Create New
                          </Button>
                        </div>
                        {generate_key_message && (
                          <div className="alert alert-success mt-3 text-center" role="alert">
                            {generate_key_message}
                          </div>
                        )}
                      </>
                      {all_support_tickets.length === 0 ? (
                        <div className='settings_box_0003____ mt-3'>
                          <div className='d-flex justify-content-between align-items-center'>
                            <span><br /><span>All Raised Tickets</span></span>
                            {/* <Button style={{
              marginLeft: "10px",
              backgroundColor: "#c006de",
              paddingLeft: "15px",
              paddingRight: "15px",
              paddingTop: "5px",
              paddingBottom: "5px",
              border: "1px solid #5b505c"
            }}>Request</Button> */}
                          </div>
                          <div className='mt-4 px-3'>
                            <Table responsive>
                              <tbody>
                                <th className='table_header_class_dev_settings____'>Ticket ID</th>
                                <th className='table_header_class_dev_settings____'>Subject</th>
                                {/* <th className='table_header_class_dev_settings____'>Contact</th> */}
                                <th className='table_header_class_dev_settings____'>Time</th>
                                <th className='table_header_class_dev_settings____'>Status</th>
                              </tbody>
                            </Table>
                            <div className='text-center pb-3'>
                              <img src={"https://images.uaxdlts.com/uax-dashboard/images/NO_DATA.svg"} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className='settings_box_0003____ mt-3'>
                          <div className='d-flex justify-content-between align-items-center'>
                            <span><span>Generated Support Tickets</span></span>
                          </div>
                          <div className='mt-4 px-3'>
                            <Table responsive>
                              <tbody>
                                <th className='table_header_class_dev_settings____'>Ticket ID</th>
                                <th className='table_header_class_dev_settings____'>Subject</th>
                                {/* <th className='table_header_class_dev_settings____'>Contact</th> */}
                                <th className='table_header_class_dev_settings____'>Time</th>
                                <th className='table_header_class_dev_settings____'>Status</th>
                                {currentTickets.map((ticket, index) => (
                                  <tr key={index} style={{ cursor: "pointer" }} onClick={() => updateTicketData(ticket)}>
                                    <td className='table_header_class_dev_settings____ px-0' style={{ color: "#fff" }}>
                                      {String(ticket.timestamp).slice(0, 4) + String(ticket.timestamp).slice(-4)}
                                    </td>
                                    <td className='table_header_class_dev_settings____ px-0' style={{ color: "#fff" }}>
                                      {ticket.subject}
                                    </td>
                                    {/* <td className='table_header_class_dev_settings____ px-0' style={{ color: "#fff" }}>
                      {ticket.contact}
                    </td> */}
                                    <td className='table_header_class_dev_settings____ px-0' style={{ color: "#fff" }}>
                                      {new Date(ticket.timestamp).toLocaleDateString()}
                                    </td>
                                    <td className='table_header_class_dev_settings____ px-0' style={{ color: "#fff" }}>
                                      {ticket.status}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>

                            {/* Pagination */}
                            <div className='pagination mt-4'>
                              {Array.from({ length: totalPages }, (_, index) => (
                                <Button
                                  key={index}
                                  onClick={() => paginate(index + 1)}
                                  style={{
                                    margin: "0 5px",
                                    backgroundColor: currentPage === index + 1 ? "#c006de" : "#5b505c",
                                    border: "none"
                                  }}>
                                  {index + 1}
                                </Button>
                              ))}
                            </div>
                          </div>
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
      {/* } */}
      <Modal show={otpmodal} onHide={handleClose} size="" style={{ zIndex: "99999999999" }}>
        <CloseButton
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: 'white',
          }}
        />
        <Modal.Body style={{ padding: '5%', backgroundColor: '#1a181b', border: 'none', color: "#fff" }}>
          <center>
            <img src={"https://images.uaxdlts.com/uax-dashboard/images/I21.png"} style={{ height: '15vh' }} alt="Authenticator App" />
            <p style={{ fontWeight: '700', fontSize: '20px', marginTop: '15px' }}>Activate the authenticator app</p>
            <small>
              You'll need to install a two-factor authentication application on your smartphone/tablet such as Google
              Authenticator (Android/phone) or Authenticator (Windows phone)
            </small>
            <br />
          </center>
          <div style={{ marginTop: '30px' }}>
            <small style={{ fontWeight: '600' }}>1. Configure the app</small>
            <br />
            <small>
              Open your two-factor authentication application and add your UAX account by scanning the QR code.
            </small>
            <center className='my-5'>
              <img src={qrcodeData} style={{ height: '25vh' }} alt="QR Code" />
              {/* <br/>
                <small>If you can't use a QR code. <Link to="#" style={{color:'#532DA1',fontWeight:'600',textDecoration:'none'}}>enter this text code.</Link></small> */}
            </center>
            <center>
              <span>Enter OTP</span>
              <div className="input-group mb-1 mt-3" style={{ width: '50%' }}>
                <input type="text" onChange={(e) => setotpcode(e.target.value)} className="form-control" placeholder='0 0 0 0 0 0' style={{ color: "#000" }} id="inputFullName" />
              </div>
              <button
                onClick={handleSubmit2FACode}
                style={{
                  color: 'white',
                  backgroundColor: '#c006df',
                  border: 'none',
                  minHeight: '5.5vh',
                  minWidth: '9rem',
                  borderRadius: '.25rem',
                  fontWeight: '600',
                  marginTop: '20px'
                }}
              >
                Submit
              </button>
              <p style={{ marginTop: '10px' }}>{popupmsg}</p>
            </center>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={otpmodal_of_change_password} onHide={handleClose}>
        <Modal.Body style={{ padding: '5%', border: 'none', color: "#fff", backgroundColor: '#1a181b', }}>
          <CloseButton
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'white',
            }}
          />
          <center>
            <img src={"https://images.uaxdlts.com/uax-dashboard/images/I21.png"} style={{ height: '15vh' }} alt="I21" />
            <p style={{ fontWeight: '700', fontSize: '20px', marginTop: '15px' }}>
              Change Your Account Password
            </p>
            <span>
              Protecting your account is our top priority. Please confirm your
              account by entering the authorization code
            </span>
            <br />
            <div className="input-group mb-1 mt-3" style={{ width: '50%' }}>
              <input
                type="number"
                name="TFACode"
                onChange={(e) => setTFACode(e.target.value)}
                className="form-control text-center"
                placeholder="3 3 3 3"
                style={{ borderRadius: "5px" }}
              />
              <div className="input-group-append">
                <span
                  className="input-group-text"
                  id="basic-addon2"
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    padding: '0px',
                    cursor: 'pointer',
                    marginLeft: '7px'
                  }}
                ></span>
              </div>
            </div>
            <button
              onClick={submitChnagePassword}
              style={{
                color: 'white',
                backgroundColor: '#c006de',
                border: 'none',
                minHeight: '5.5vh',
                minWidth: '9rem',
                borderRadius: '.25rem',
                fontWeight: '600',
                marginTop: '20px'
              }}
            >
              Submit
            </button>
          </center>
          {successMessageChangePassword && (
            <div className="alert alert-success mt-3 text-center" role="alert">
              {successMessageChangePassword}
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={openTicketModal} onHide={handleClose}>
        <Modal.Body style={{ padding: '5%', border: 'none', color: "#fff", backgroundColor: '#1a181b', }}>
          <CloseButton
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'white',
            }}
          />
          <center>
            <p style={{ fontWeight: '700', fontSize: '20px', marginTop: '15px' }}>
              Raise New Ticket
            </p>
          </center>

          <span>
            Upload Screenshot
          </span>
          <div className="input-group mb-1 mt-3" >
            <input
              type="file"
              name="TFACode"
              onChange={handleFileUpload}
              className="form-control"
              style={{ borderRadius: "5px" }}
            />
          </div>
          <br />
          <span>
            Subject
          </span>
          <div className="input-group mb-1 mt-3" >
            <input
              type="text"
              name="TFACode"
              onChange={(e) => setSubject(e.target.value)}
              className="form-control"
              placeholder="Enter Subject"
              style={{ borderRadius: "5px" }}
            />
          </div>

          <br />
          <span>
            Query
          </span>
          <div className="input-group mb-1 mt-3" >
            <textarea
              type="text"
              name="TFACode"
              onChange={(e) => setQuery(e.target.value)}
              className="form-control"
              placeholder="Enter Your Query"
              style={{ borderRadius: "5px" }}
            />
          </div>

          <button
            onClick={createTicket}
            style={{
              color: 'white',
              backgroundColor: '#c006de',
              border: 'none',
              minHeight: '5.5vh',
              minWidth: '9rem',
              borderRadius: '.25rem',
              fontWeight: '600',
              marginTop: '20px'
            }}
          >
            Submit
          </button>

          {createnew_ticket_message && (
            <div className="alert alert-success mt-3 text-center" role="alert">
              {createnew_ticket_message}
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={openTicketDetailsModal} centered onHide={handleClose}>
        <Modal.Body style={{ padding: '5%', border: 'none', color: "#fff", backgroundColor: '#1a181b', }}>
          <CloseButton
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'white',
            }}
          />
          <p className='' style={{ fontWeight: '600', fontSize: '20px' }}>
            Ticket Details
          </p>
          <hr />
          {/* <center>
          <p style={{ fontWeight: '700', fontSize: '20px', marginTop: '15px' }}>
            Ticket Details
          </p>
          </center> */}
          <div className="ticket-details">
            <div className="ticket-row">
              <div className="ticket-column" style={{ textAlign: "right" }}>
                <div className="ticket-item">
                  <span className="label"> Ticket ID</span>  <span className="value">
                    {String(ticketDetails.timestamp).slice(0, 4) + String(ticketDetails.timestamp).slice(-4)}
                  </span>
                </div>
                <div className="ticket-item">
                  <span className="label">Subject</span>  <span className="value">
                    {ticketDetails.subject}
                  </span>
                </div>
                {/* <div className="ticket-item">
            <span className="label">Contact</span>  <span className="value">{ticketDetails.contact}</span>
          </div> */}
                <div className="ticket-item">
                  <span className="label">Query</span>  <span className="value">{ticketDetails.query}</span>
                </div>
                <div className="ticket-item">
                  <span className="label">Time</span>  <span className="value">{new Date(ticketDetails.timestamp).toLocaleString()}</span>
                </div>
                <div className="ticket-item">
                  <span className="label">Status</span>  <span className="value status-open">{ticketDetails.status}</span>
                </div>
              </div>
            </div>
          </div>

        </Modal.Body>
      </Modal>
    </>
  );
}

export default Settings;
