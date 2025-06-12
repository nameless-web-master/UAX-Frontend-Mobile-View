import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Footer() {
  return (
    // <Navbar expand="lg" className="">
    <div className='text-center py-3 mt-5' style={{ backgroundColor: "#000", borderRadius: "" }}>
      <span style={{ fontSize: "12px" }}>
        Powered by UAXNetwork - 2025 © Copyright
        All Rights Reserved - <a href="#" style={{ textDecoration: "none", fontWeight: "900", color: "#c006df" }}>Terms</a>  | <a href="#" style={{ textDecoration: "none", fontWeight: "900", color: "#c006df" }}>Privacy</a>
      </span>
    </div>
    // </Navbar>
  );
}

export default Footer;