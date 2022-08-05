

import React from "react";
import {Navbar, Nav, Button} from "react-bootstrap";
import styled from 'styled-components'




const StyledNav = styled(Navbar)`
  position: sticky;
  top: 0;
  z-index: 100; 
  
`;
const StyledNavLinks = styled(Nav)`

width: 100%;
display: flex;
justify-content: center`


const NavLink = styled(Nav.Link)`
color: grey;
margin-right: 4rem;
margin-left: 4rem;
.hover{
  color: white;
}`
const NavbarToggle = styled(Navbar.Toggle)`
color: grey;
background: grey`

const StyledButton = styled(Button)`
position: absolute;
right: 3rem;
background: black;
`
const login_url = 'https://spliticist.auth.us-west-1.amazoncognito.com/login?client_id=16kr7l3gd2uhro89pfnkk77api&response_type=token&scope=email+openid&redirect_uri=https://spliticist.com';


class NavB extends React.Component{
        constructor(props){
          super(props)
          this.LoginButton= (<StyledButton variant="secondary" onClick = {this.onclickfunc} href = {login_url}>Login</StyledButton>)    
          this.LogoutButton= (<StyledButton variant="secondary" onClick = {this.onclickfunc} href = "https://spliticist.com">Logout</StyledButton>)
          
          this.state = {
            activeButton: this.LoginButton        
      }
    this.onclickfunc=this.onclickfunc.bind(this)
    this.mouseEnter = this.mouseEnter.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)

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

      this.setState({activeButton: this.LogoutButton})
    }
    }

    onclickfunc(){
      localStorage.clear()

      if (this.state.activeButton==this.LoginButton){
        this.setState({activeButton: this.LogoutButton})
      } else {
        this.setState({activeButton: this.LoginButton})
      }

    
    }
    mouseEnter(event){
      event.target.style.color = 'white'
    }
    mouseLeave(event){
      event.target.style.color = 'grey'
    }
    render(){

        return (
            <StyledNav bg="black" expand="lg">
            <NavbarToggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            
                <StyledNavLinks className="me-auto">
                  <NavLink onMouseLeave = {this.mouseLeave}onMouseEnter = {this.mouseEnter}bg = "white"href="/">My Split</NavLink>
                  <NavLink onMouseLeave = {this.mouseLeave}onMouseEnter = {this.mouseEnter}href="/Edit">Edit Split</NavLink>
                  <NavLink onMouseLeave = {this.mouseLeave}onMouseEnter = {this.mouseEnter}href="/Contact">Contact</NavLink>

                  {this.state.activeButton}
                </StyledNavLinks>

              
            </Navbar.Collapse>
        </StyledNav>
        )
    }
}
export default NavB;