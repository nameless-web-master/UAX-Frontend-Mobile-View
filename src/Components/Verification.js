import React, { Component } from 'react';
import axios from 'axios';

class Verification extends Component {
  state = {
    msg: <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{width:"3vw"}}/>,
    hasCalledAPI: false
  }

  componentDidMount() {
    if (!this.state.hasCalledAPI) {
      this.setState({ hasCalledAPI: true });
      const token = window.location.href.split('?')[1];
      axios.post("https://services.uaxwallet.com/api/activateaccount", { token })
        .then(res => {
          if (res.data.user) {
            this.setState({
              msg: 'Registration Successful'
            });
            setTimeout(() => { window.location.href = "/login" }, 2000);
          } else if (res.data === 'Something went wrong while creating user profile') {
            this.setState({
              msg: res.data
            });
          } else if (res.data === 'Unable to create user') {
            this.setState({
              msg: res.data
            });
          } else {
            this.setState({
              msg: res.data
            });
            setTimeout(() => { window.location.href = "/login" }, 2000);
          }
        })
        .catch(err => {
          console.log(err);
          this.setState({ msg: 'Error during verification' });
        });
    }
  }

  render() {
    return (
      <div className='' style={{ height: "100vh", position: "relative", backgroundColor: "#000" }}>
        <center style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
        <img src={"https://images.uaxdlts.com/uax-landing/assets/images/logo/uax_white_logo.png?quality=lossless"} style={{width:"130px"}}/>              
        <h1>{this.state.msg}</h1>
        </center>
      </div>
    );
  }
}

export default Verification;
