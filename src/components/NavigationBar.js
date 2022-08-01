

import React from "react";
import {Navbar, Nav, Button} from "react-bootstrap";
import styled from 'styled-components'




const StyledNav = styled(Navbar)`
  position: sticky;
  top: 0;
  z-index: 100; 
  border: 1px solid rgb(150, 150, 150);
  border-radius: 2px;
`;



const login_url = 'https://spliticist.auth.us-west-1.amazoncognito.com/login?client_id=16kr7l3gd2uhro89pfnkk77api&response_type=token&scope=email+openid&redirect_uri=https://spliticist.com';


class NavB extends React.Component{
        constructor(props){
          super(props)
          this.LoginButton= (<Button style = {{"position": "absolute", "right": "3rem"}} onClick = {this.onclickfunc} href = {login_url}>Login</Button>)    
          this.LogoutButton= (<Button style = {{"position": "absolute", "right": "3rem"}} onClick = {this.onclickfunc} href = "https://spliticist.com">Logout</Button>)
          
          this.state = {
            activeButton: this.LoginButton        
      }
    this.onclickfunc=this.onclickfunc.bind(this)

    }
    componentDidMount(){
      if (localStorage.getItem("id_token")===null){
        const curUrl = window.location.href;
        if (curUrl.includes("id_token")){
          const id_token = (curUrl.split("#id_token=")[1]).split("&")[0]
          const access_token = (curUrl.split("#id_token=")[1]).split("&")[1].split("access_token=")[1]
          localStorage.setItem("id_token", id_token)
          localStorage.setItem("access_token", access_token)
        } 
      } 
    if (localStorage.getItem("id_token")===null){
      this.setState({activeButton: this.LoginButton})
    } else {
      console.log("setting logout button")
      this.setState({activeButton: this.LogoutButton})
    }
    }

    onclickfunc(){
      localStorage.clear()
      console.log(this.state.activeButton)
      if (this.state.activeButton==this.LoginButton){
        this.setState({activeButton: this.LogoutButton})
      } else {
        this.setState({activeButton: this.LoginButton})
      }

    
    }
    render(){

        return (
            <StyledNav bg="light" expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">My Split</Nav.Link>
                <Nav.Link href="/Edit">Edit</Nav.Link>
                <Nav.Link href="/Contact">Contact</Nav.Link>

                {this.state.activeButton}
              </Nav>
            </Navbar.Collapse>
        </StyledNav>
        )
    }
}
export default NavB;