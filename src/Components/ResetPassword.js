import React, { useState, useRef, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ReCAPTCHA from 'react-google-recaptcha';

const ReseetPassword = () => {
  const [password, setPassword] = useState('');
  const [otpmodal, setotpmodal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
//   const [TFACode, setTFACode] = useState('');
  const [confirm_Password, setconfirm_Password] = useState('');
  const [login_details, setlogin_details] = useState('');
  const [reset_token_code, setreset_token_code] = useState('');
  const _reCaptchaRef = useRef();
  
  useEffect(() => {
    _reCaptchaRef.current.execute();
    const getLoginDetails = async() =>{
      const details = await axios.get("https://ipapi.co/json/")
      setlogin_details(details.data)
      var reset_token = window.location.href.split('?')[1]
      if(!reset_token){
        window.location.href="/forgotpassword"
      }
      else{
        setreset_token_code(reset_token)
      }
    }
    getLoginDetails()
  }, [])

  const handleClose = () => {
    setotpmodal(false)
  };

  const handleSubmit2FACode = (e) =>{
    e.preventDefault();
    setSuccessMessage(<img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{width:"3vw"}}/>)
    if(password===confirm_Password){
        const getBrowserAndOS = () => {
            const userAgent = window.navigator.userAgent;
            let browserName = 'Unknown Browser';
            let osName = 'Unknown OS';
          
            if (userAgent.indexOf('Firefox') > -1) {
              browserName = 'Mozilla Firefox';
            } else if (userAgent.indexOf('SamsungBrowser') > -1) {
              browserName = 'Samsung Internet';
            } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
              browserName = 'Opera';
            } else if (userAgent.indexOf('Trident') > -1) {
              browserName = 'Microsoft Internet Explorer';
            } else if (userAgent.indexOf('Edge') > -1) {
              browserName = 'Microsoft Edge';
            } else if (userAgent.indexOf('Chrome') > -1) {
              browserName = 'Google Chrome';
            } else if (userAgent.indexOf('Safari') > -1) {
              browserName = 'Apple Safari';
            }
          
            if (userAgent.indexOf('Windows NT 10.0') > -1) {
              osName = 'Windows 10';
            } else if (userAgent.indexOf('Windows NT 6.3') > -1) {
              osName = 'Windows 8.1';
            } else if (userAgent.indexOf('Windows NT 6.2') > -1) {
              osName = 'Windows 8';
            } else if (userAgent.indexOf('Windows NT 6.1') > -1) {
              osName = 'Windows 7';
            } else if (userAgent.indexOf('Windows NT 6.0') > -1) {
              osName = 'Windows Vista';
            } else if (userAgent.indexOf('Windows NT 5.1') > -1) {
              osName = 'Windows XP';
            } else if (userAgent.indexOf('Mac OS X') > -1) {
              osName = 'Mac OS X';
            } else if (userAgent.indexOf('Android') > -1) {
              osName = 'Android';
            } else if (userAgent.indexOf('Linux') > -1) {
              osName = 'Linux';
            } else if (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
              osName = 'iOS';
            }
          
            return { browserName, osName };
          };
          
          const { browserName, osName } = getBrowserAndOS();
      //    console.log("token",token,"secret",secret,captchaToken)
         axios.post("https://services.uaxwallet.com/api/resetPassword",{
          reset_token:reset_token_code,
          // token:TFACode,
          password:password,
          captchaToken:captchaToken,
          browser:browserName,
          os:osName,
          ip:login_details?login_details.ip:'Not Detected',
          country_code:login_details?login_details.country_code:'Not Detected',
          timestamp:new Date().toLocaleString()
      })
         .then(res=>{
             if(res.data==='Password changed successfully'){
              setSuccessMessage(res.data)
                  setTimeout(()=>{
                  window.location.href='/login'
                  },2000)
             }
             else{
              setSuccessMessage(res.data)
             }
         })
    }
    else{
        setSuccessMessage("Password doesn't match")
    }
//    if(TFACode.length>0){

//  }
//  else{
//     setSuccessMessage('Please enter OTP')
//  }
 }

  const captchaChange = (value) => {
    setCaptchaToken(value);
  };
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-12 hide_in_mobile__">
            <div className="parent">
              <div className="child">
                <div className='mb-5'>
                  <h2>Simple <span style={{ color: "#c006de" }}>.</span> Instant <span style={{ color: "#c006de" }}>.</span> Secure <span style={{ color: "#c006de" }}>.</span> Global</h2>
                </div>
                <img src={"https://images.uaxdlts.com/uax-dashboard/images/LAPTOP.svg"} style={{ width: "100%" }} alt="laptop" />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 gap_for_mobile_____">
            <div className="parent">
              <div className="child">
                <div className="card_design___ p-5">
                  <center className="my-4">
                  <img src={"https://images.uaxdlts.com/uax-landing/assets/images/logo/uax_white_logo.png?quality=lossless"} style={{width:"130px"}}/>                  </center>
                  <center className="mb-5">
                    <h3>Reset <span style={{color:"#c006de"}}>Password</span></h3>
                  </center>
                  <Form onSubmit={handleSubmit2FACode}>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        style={{ border: "0.1px solid #3e3d3d" }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm New Password"
                        style={{ border: "0.1px solid #3e3d3d" }}
                        value={confirm_Password}
                        onChange={(e) => setconfirm_Password(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Button
                      className="w-100 primary_btnn___"
                      variant="primary"
                      type="submit"
                    >
                      Reset Password
                    </Button>
                  </Form>
                  {successMessage && (
                    <div className="alert alert-success mt-3 text-center" role="alert">
                      {successMessage}
                    </div>
                  )}
                  <div className="text-center mt-4">
                    <p>
                      Don't have an account ? {" "}
                      <Link to="/signup" style={{ textDecoration: "none" }}>
                        <span style={{ color: "#c006de" }}>Sign up</span>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReCAPTCHA
        sitekey="6Lf-dGUpAAAAAB_rysVP0bsYeT7_JhJ0jtJ8eXuQ"
        onChange={captchaChange}
        size="invisible"
        ref={_reCaptchaRef}
      />


    </>
  );
};

export default ReseetPassword;
