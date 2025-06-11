import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavbarComponent() {
  return (
    <Navbar expand="lg" className="">
      <Container>
        <Navbar.Brand href="/"><img src={"https://images.uaxdlts.com/uax-landing/assets/images/logo/uax_white_logo.png?quality=lossless"} style={{width:"130px"}}/></Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;