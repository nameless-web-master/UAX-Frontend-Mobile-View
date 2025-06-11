import { useState,useEffect } from 'react';
const NFTHistory = () => {
    const [loader, setloader] = useState(true);
useEffect(()=>{
    setloader(false)
},[])
return(
            <>
               {loader?
                <div className='' style={{height:"80vh",position:"relative",backgroundColor:"#000"}}>
                <center style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
                <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{width:"3vw"}}/>
                </center>
                </div>
                :      
                <> 
                <div className='dashboard_box_001____ px-4'>
                <div className='' style={{height:"80vh",position:"relative"}}>
                        <center style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
                        <img src={"https://images.uaxdlts.com/uax-dashboard/images/NO_DATA.svg"} style={{width:"6vw"}}/>
                        </center>
                        </div>
                </div>
                </>
                }
            </>
)};

export default NFTHistory;
