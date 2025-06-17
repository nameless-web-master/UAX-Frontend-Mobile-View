import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ReCAPTCHA from 'react-google-recaptcha';
import Footer from './Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpmodal, setotpmodal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [TFACode, setTFACode] = useState('');
  const [err2FA, seterr2FA] = useState('');
  const [CloudSecret, setCloudSecret] = useState('');
  const [login_details, setlogin_details] = useState('');
  const _reCaptchaRef = useRef();

  useEffect(() => {
    _reCaptchaRef.current.execute();
    const getLoginDetails = async () => {
      const details = await axios.get("https://ipapi.co/json/")
      setlogin_details(details.data)
    }
    getLoginDetails()
  }, [])

  const handleClose = () => {
    setotpmodal(false)
  };

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      await _reCaptchaRef.current.execute();
      setSuccessMessage(<img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />)
      if (!email) {
        setSuccessMessage("Email id is required")
      }
      else {
        const resp = await axios.post("https://services.uaxwallet.com/api/check_resetPassword", {
          email: email,
          country_code: login_details ? login_details.country_code : 'Not Detected',
          ip: login_details ? login_details.ip : 'Not Detected'
        })
        if (resp.data === 'Email not registered' || resp.data === 'Validatiopn failed , kindly enter Email') {
          setSuccessMessage(resp.data)
        }
        else {
          setSuccessMessage(resp.data)
        }
      }
    } catch (error) {
      setSuccessMessage('Something went wrong, please try again later');
    }
  };

  const handleSubmit2FACode = () => {
    seterr2FA(<img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{ width: "3vw" }} />)
    if (TFACode.length > 0) {
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
      let token = TFACode
      let secret = CloudSecret;
      //    console.log("token",token,"secret",secret,captchaToken)
      axios.post("https://services.uaxwallet.com/api/resetPassword", {
        token: token,
        secret: secret,
        email: email,
        password: password,
        captchaToken: captchaToken,
        browser: browserName,
        os: osName,
        ip: login_details ? login_details.ip : 'Not Detected',
        country_code: login_details ? login_details.country_code : 'Not Detected',
        timestamp: new Date().toLocaleString()
      })
        .then(res => {
          if (res.data === 'Password changed successfully') {
            seterr2FA(res.data)
            setTimeout(() => {
              window.location.href = '/login'
            }, 2000)
          }
          else {
            seterr2FA(res.data)
          }
        })
    }
    else {
      seterr2FA('Please enter OTP')
    }
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
                <img src={"https://images.uaxdlts.com/uax-dashboard/images/laptop.svg"} style={{ width: "100%" }} alt="laptop" />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 gap_for_mobile_____">
            <div className="parent">
              <div className="child">
                <div className="card_design___ p-3 p-sm-5">
                  <div className='desk_view'>
                    <center className="my-4">
                      <img src={"https://images.uaxdlts.com/uax-landing/assets/images/logo/uax_white_logo.png?quality=lossless"} style={{ width: "130px" }} />                  </center>
                    <center className="mb-5">
                      <h3>Reset <span style={{ color: "#c006de" }}>Password</span></h3>
                    </center>
                  </div>
                  <h1 className='welcome mobile_view'>
                    Forgot <br /><span>Password?</span>
                  </h1>
                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        style={{ border: "0.1px solid #3e3d3d" }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>

                    {/* <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        style={{ border: "0.1px solid #3e3d3d" }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group> */}

                    {/* <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm New Password"
                        style={{ border: "0.1px solid #3e3d3d" }}
                        value={confirm_Password}
                        onChange={(e) => setconfirm_Password(e.target.value)}
                        required
                      />
                    </Form.Group> */}
                    <Button
                      className="w-100 primary_btnn___"
                      variant="primary"
                      type="submit"
                    >
                      Send Reset Link
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

      <Modal show={otpmodal} onHide={handleClose}>
        <Modal.Body style={{ padding: '5%', border: 'none', color: "#fff", backgroundColor: '#1a181b', }}>
          <center>
            <img src={"https://images.uaxdlts.com/uax-dashboard/images/I21.png"} style={{ height: '15vh' }} alt="I21" />
            <p style={{ fontWeight: '700', fontSize: '20px', marginTop: '15px' }}>
              Reset Your Account Password
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
                placeholder="0 0 0 0 0 0"
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
              onClick={handleSubmit2FACode}
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
            <p style={{ marginTop: '10px' }}>{err2FA}</p>
          </center>
        </Modal.Body>
      </Modal>
      <div
        className='d-md-block d-none'
      >
        <Footer />
      </div>
    </>
  );
};

export default Login;
