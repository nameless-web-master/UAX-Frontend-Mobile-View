import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const TimerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  color: white;
  width: 100%;
`;

const ProgressBarWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const TimeDisplay = styled.div`
  margin-right: 10px;
  color: #b0b0b0;
`;

const ProgressBar = styled.div`
  flex-grow: 1;
  height: 10px;
  background: #4d4d4d;
  border-radius: 5px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background: #d43fff;
  width: ${({ percent }) => percent}%;
  transition: width 1s linear;
`;

const ModalContent = styled.div`
  text-align: center;
  padding: 20px;
`;

const Timer = () => {
  const [time, setTime] = useState(300);
  const [percent, setPercent] = useState(100);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    let statusInterval;
    let timerInterval;

    const checkPaymentStatus = async () => {
      try {
        const response = await axios.post("https://services.uaxwallet.com/api/checkPaymentStatus", {
          email: email
        }, config);

        if (response.data === "Completed") {
          setShowSuccessModal(true);
          clearInterval(statusInterval);
          clearInterval(timerInterval);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    statusInterval = setInterval(checkPaymentStatus, 4000);

    timerInterval = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(timerInterval);
    };
  }, []);

  useEffect(() => {
    setPercent((time / 300) * 100);
    if (time === 0) {
      setShowFailedModal(true);
    }
  }, [time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleClose = () => {
    setShowFailedModal(false);
    setShowSuccessModal(false);
    window.location.reload();
  };

  return (
    <TimerWrapper>
      <ProgressBarWrapper>
        <TimeDisplay>{formatTime(time)}</TimeDisplay>
        <ProgressBar>
          <Progress percent={percent} />
        </ProgressBar>
      </ProgressBarWrapper>

      <Modal centered show={showFailedModal} onHide={handleClose} size="md">
        <Modal.Body style={{ padding: '5%', backgroundColor: '#1a181b', border: 'none', color: "#fff", borderRadius: "12px" }}>
          <ModalContent>
            <i className="fa fa-exclamation-triangle" style={{ fontSize: "60px", color: "#fa634c" }} aria-hidden="true"></i>
            <p>The transaction has failed. If you have already paid, kindly contact to admin.</p>
          </ModalContent>
        </Modal.Body>
      </Modal>

      <Modal centered show={showSuccessModal} onHide={handleClose} size="md">
        <Modal.Body style={{ padding: '5%', backgroundColor: '#1a181b', border: 'none', color: "#fff", borderRadius: "12px" }}>
          <ModalContent>
            <i className="fa fa-check-circle" style={{ fontSize: "60px", color: "#4caf50" }} aria-hidden="true"></i>
            <p>Your payment was successful. Thank you!</p>
          </ModalContent>
        </Modal.Body>
      </Modal>
    </TimerWrapper>
  );
};

export default Timer;
