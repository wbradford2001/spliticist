

import React from "react";
import {Navbar, Nav} from "react-bootstrap";
import styled from 'styled-components'



const StyledNav = styled(Navbar)`
  position: sticky;
  top: 0;
  z-index: 100; 
  border: 1px solid rgb(150, 150, 150);
  border-radius: 2px;
`;

class NavB extends React.Component{
    render(){
        return (
            <StyledNav bg="light" expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">My Split</Nav.Link>
                <Nav.Link href="/Edit">Edit</Nav.Link>
                <Nav.Link href="/Contact">Contact</Nav.Link>
              </Nav>
            </Navbar.Collapse>
        </StyledNav>
        )
    }
}
export default NavB;