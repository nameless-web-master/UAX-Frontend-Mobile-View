import React from 'react';
import Button from 'react-bootstrap/Button';

const SwapComponent = () => (
  <>
    <div className="container" style={{minHeight:"100vh"}}>
     
      <div className='mt-3'>
                <div className='dashboard_box_001____ px-4'>
                    <div className='my-5'>
                    <p className='' style={{fontWeight:"900",fontSize:"20px"}}>Swap</p>
                    <span>Enter the number of UAX tokens that you want to swap, then click "SWAP"</span>
                    <div className='mt-5'>
                        
                    <div className="">
                        <div className="section">
                            <label className="label">Select Assets</label>
                            <div className="inputContainer rightAlign">
                                <select className="currencySelect">
                                    <option value="UAX">UAX</option>
                                </select>
                            </div>
                            <label className="label">Amount</label>
                            <div className="inputContainer">
                                <input className="input" type="text" value="0.00" readOnly />
                                <span className="maxButton">MAX</span>
                            </div>
                        </div>

                        <div className="swapIconContainer">
                            <span className="swapIcon">
                                <img src={"https://images.uaxdlts.com/uax-dashboard/images/swap (2).svg"}/>
                            </span>
                        </div>

                        <div className="section">
                            <label className="label">Select Assets</label>
                            <div className="inputContainer rightAlign">
                                <select className="currencySelect">
                                    <option value="UAX">UAX</option>
                                </select>
                            </div>
                            <label className="label">Amount</label>
                            <div className="inputContainer">
                            <input className="input" type="text" value="0.00" readOnly />
                            <span className="maxButton">MAX</span>
                            </div>
                        </div>

                        <div className="conversionRate mt-4">
                            <small>Conversion Rate</small>
                            <small>1 TRC ~ 2,701.43 UAX</small>
                        </div>
                        <br/><br/>
                        <div className='sell_button_class____'>
                                    <Button
                                        style={{fontWeight:"900",width:"100%",minHeight:""}}
                                        className="primary_btnn___ mt-4"
                                        variant="primary"
                                        type="submit"
                                        >
                                         Swap
                                    </Button>
                        </div>
                     </div>

                    </div>
                    </div>
                </div>
            </div>
       
        </div>
  </>
);

export default SwapComponent;
