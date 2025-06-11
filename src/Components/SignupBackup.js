import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import Laptop from '../images/LAPTOP.svg';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Logo from '../images/uaxlogo.svg';
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';
import Loader from '../images/loader3.gif';
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle,FaDotCircle } from 'react-icons/fa'; // Added FaQuestionCircle for the tooltip
import { OverlayTrigger, Tooltip } from 'react-bootstrap'; // Added OverlayTrigger and Tooltip for tooltip functionality
var CryptoJS = require("crypto-js");

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [signupMsg, setSignupMsg] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [r_email, setr_email] = useState('');
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const reCaptchaRef = useRef(null);
  const [login_details, setlogin_details] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordCriteria({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[^A-Za-z0-9]/.test(value),
    });
  };
  const handleCPasswordChange = (e) => setCPassword(e.target.value);
  const handleReferredByChange = (e) => setReferredBy(e.target.value);

  useEffect(() => {
    reCaptchaRef.current.execute();
    const getLoginDetails = async () => {
      const details = await axios.get("https://ipapi.co/json/");
      setlogin_details(details.data);
    }
    getLoginDetails();
    var r_email_from_link = window.location.href.split('?ref_id=')[1];
    if (r_email_from_link) {
      setr_email(r_email_from_link);
    }
  }, []);

  const captchaChange = (value) => {
    setCaptchaToken(value);
  }

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  }

  const signUp = (e) => {
    e.preventDefault();
    reCaptchaRef.current.execute();
    setSignupMsg(<img src={Loader} style={{ width: "3vw" }} />);

    if (password === cpassword) {
      if (email.length > 5 && validatePassword(password) && validatePassword(cpassword)) {
        var encryptedemail = CryptoJS.AES.encrypt(email, "key").toString();
        var encryptedpass = CryptoJS.AES.encrypt(password, "key").toString();

        if (captchaToken.length > 0) {
          axios.post("https://services.uaxwallet.com/api/signup", {
            encryptedemail,
            encryptedpass,
            captchaToken,
            referred_by: r_email.length > 0 ? r_email : referredBy,
            ip: login_details ? login_details.ip : 'Not Detected',
            country_code: login_details ? login_details.country_code : 'Not Detected'
          })
            .then(res => {
              reCaptchaRef.current.execute();
              if (!res) {
                setSignupMsg('An error occurred. Please try again.');
              } else {
                setSignupMsg(res.data);
                setEmail('')
                setPassword('')
                setCPassword('')
                setReferredBy('')
                setr_email('')
              }
            })
            .catch(err => {
              reCaptchaRef.current.execute();
              setSignupMsg('An error occurred. Please try again.');
            });
        } else {
          setSignupMsg('Please verify the captcha.');
        }
      } else {
        setSignupMsg('Kindly make sure your given details are valid.');
      }
    } else {
      setSignupMsg('Passwords do not match.');
    }
  }

  const renderTooltip = (props) => (
    <Tooltip id="password-tooltip" {...props}>
      <div style={{textAlign:"left",width:"500px"}}>
        {!passwordCriteria.length && <div><FaDotCircle /> At least 8 characters long</div>}
        {!passwordCriteria.uppercase && <div><FaDotCircle /> Contains an uppercase letter</div>}
        {!passwordCriteria.lowercase && <div><FaDotCircle /> Contains a lowercase letter</div>}
        {!passwordCriteria.number && <div><FaDotCircle /> Contains a number</div>}
        {!passwordCriteria.specialChar && <div><FaDotCircle /> Contains a special character</div>}
      </div>
    </Tooltip>
  );

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-12 hide_in_mobile__">
            <div className="parent">
              <div className="child">
                <div className='mb-5'>
                  <h2>Simple <span style={{ color: "#c006de" }}> .</span> Instant <span style={{ color: "#c006de" }}> .</span> Secure <span style={{ color: "#c006de" }}> .</span> Global</h2>
                </div>
                <img src={Laptop} style={{ width: "100%" }} alt="Laptop" />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 gap_for_mobile_____">
            <div className="parent">
              <div className="child">
                <div className="card_design___ px-5 py-2">
                  <center className="mt-3 mb-3">
                    <img src={Logo} alt="UAX Logo" />
                  </center>
                  <center className="mb-5">
                    <h3>Signup</h3>
                  </center>
                  <Form onSubmit={signUp}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={handleEmailChange}
                        style={{ border: "0.1px solid #3e3d3d" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                      >
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={handlePasswordChange}
                          style={{ border: "0.1px solid #3e3d3d" }}
                        />
                      </OverlayTrigger>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        value={cpassword}
                        onChange={handleCPasswordChange}
                        style={{ border: "0.1px solid #3e3d3d" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicReferredBy">
                      <Form.Label>Referral ID(Optional)</Form.Label>
                      {r_email.length > 0 ?
                        <Form.Control
                          type="text"
                          placeholder="Referral ID"
                          value={r_email}
                          onChange={handleReferredByChange}
                          style={{ border: "0.1px solid #3e3d3d" }}
                        />
                        :
                        <Form.Control
                          type="text"
                          placeholder="Referral ID"
                          value={referredBy}
                          onChange={handleReferredByChange}
                          style={{ border: "0.1px solid #3e3d3d" }}
                        />
                      }
                    </Form.Group>

                    <Button
                      className="w-100 primary_btnn___"
                      variant="primary"
                      type="submit"
                    >
                      Signup
                    </Button>
                  </Form>
                  <div className="text-center mt-2">
                    {signupMsg ?
                      <div className="alert alert-success mt-3" role="alert">
                        {signupMsg}
                      </div>
                      :
                      ''
                    }
                  </div>
                  <div className="text-center mt-4">
                    <p>
                      Already have an account ? {" "}
                      <Link to="/login" style={{ textDecoration: "none" }}>
                        <span style={{ color: "#c006de" }}>Sign in</span>
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
        ref={reCaptchaRef}
      />
    </>
  );
};

export default Signup;
