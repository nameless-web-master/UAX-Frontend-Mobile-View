import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { Link } from "react-router-dom";
import Footer from './Footer';

const Login = () => {
  const [inputs, setInputs] = useState(['', '', '', '', '', '']);
  const [TFACode, setTFACode] = useState('');
  const [err2FA, seterr2FA] = useState('');
  const [email, setemail] = useState('');
  const [acc_token, setacc_token] = useState('');

  useEffect(() => {
    const url = window.location.href;
    const t_id_start = url.indexOf('t_id=') + 5; 
    const t_id_end = url.indexOf('?e_id='); 
    const e_id_start = t_id_end + 6; 

    const t_id = url.substring(t_id_start, t_id_end); 
    const e_id = url.substring(e_id_start); 
    const decryptedEmail = CryptoJS.AES.decrypt(e_id, 'key');
    const decryptedEmailToString = decryptedEmail.toString(CryptoJS.enc.Utf8);
    const decryptedToken = CryptoJS.AES.decrypt(t_id, 'key');
    const decryptedTokenToString = decryptedToken.toString(CryptoJS.enc.Utf8);
    setemail(decryptedEmailToString);
    setacc_token(decryptedTokenToString);
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newInputs = [...inputs];
      newInputs[index] = value;
      setInputs(newInputs);
      setTFACode(newInputs.join(''));
      if (value && index < 5) {
        document.getElementById(`input-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit2FACode = () => {
    seterr2FA(<img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: '3vw' }} />);
    if (TFACode.length === 6) {
      const token = TFACode;
      const secret = localStorage.getItem('cloudsecret');
      axios.post('https://services.uaxwallet.com/api/verifyTwoFA', { token, secret })
        .then(res => {
          if (res.data.verified === true) {
            localStorage.setItem('token', acc_token);
            localStorage.setItem('email', email);
            localStorage.setItem('cloudverified', res.data.verified);
            window.location.href = '/dashboard';
          } else {
            seterr2FA('Incorrect OTP');
          }
        });
    } else {
      seterr2FA('Please enter OTP');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-md-6 hide_in_mobile__">
            <div className="parent">
              <div className="child">
                <div className="mb-5">
                  <h2>Simple <span style={{ color: "#c006de" }}> .</span> Instant <span style={{ color: "#c006de" }}> .</span> Secure <span style={{ color: "#c006de" }}> .</span> Global</h2>
                </div>
                <img src={"https://images.uaxdlts.com/uax-dashboard/images/laptop.svg"} style={{ width: "100%" }} />
              </div>
            </div>
          </div>
          <div className="col-md-6 gap_for_mobile_____">
            <div className="parent">
              <div className="child" style={{ width: "70%" }}>
                <div className="card_design___ p-4">
                  <center className="my-5">
                  <img src={"https://images.uaxdlts.com/uax-landing/assets/images/logo/uax_white_logo.png?quality=lossless"} style={{width:"130px"}}/>                  </center>
                  <center className="mb-5">
                    <h3>Login <span style={{ color: "#c006de" }}>Authentication</span></h3>
                  </center>
                  <center style={{ color: "grey" }}>
                    <p>
                    Enter the 6-digit authentication code from your Authenticator app to continue
                    </p>
                  </center>
                  <br />
                  <Form>
                    <div className="sub_box_auth____ p-4">
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <center>
                          <Form.Label style={{ fontWeight: "600" }}>Login Authentication Code</Form.Label>
                        </center>
                        <br />
                        <div className="d-flex justify-content-between">
                          {inputs.map((digit, index) => (
                            <Form.Control
                              key={index}
                              id={`input-${index}`}
                              type="text"
                              value={digit}
                              onChange={(e) => handleChange(e, index)}
                              className="form_control_box_01"
                              style={{
                                border: "0.1px solid #c006df",
                                minWidth: "3vw",
                                minHeight: "7vh",
                                textAlign: "center",
                                fontSize: "1.5rem",
                                marginRight:"5px"
                              }}
                              maxLength="1"
                            />
                          ))}
                        </div>
                      </Form.Group>
                    </div>
                    <br />
                    <Button
                      className="w-100 primary_btnn___"
                      variant="primary"
                      onClick={handleSubmit2FACode}
                    >
                      Continue
                    </Button>
                    {err2FA && (
                      <div className="alert alert-success mt-3 text-center" role="alert">
                        {err2FA}
                      </div>
                    )}
                  </Form>
                  <center className='mt-3'>
                  <Link to="/login" style={{ textDecoration: "none" }}>
                        <span style={{ color: "#c006de" }}>Back to Login </span>
                  </Link>
                  </center>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-3'>
      <Footer/>
      </div>
    </>
  );
};

export default Login;
