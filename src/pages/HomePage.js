import React from 'react';
import styled from 'styled-components';

const StyledHomePage = styled.div`
  color: blue
`;

class HomePage extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(

                <StyledHomePage>Home Page</StyledHomePage>
        )
    }
}

export default HomePage;