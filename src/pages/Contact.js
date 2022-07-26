import React from 'react';
import styled from 'styled-components';

const StyledContact = styled.div`
  color: green
`;

class ContactPage extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(

                <StyledContact>Contact Page</StyledContact>
        )
    }
}

export default ContactPage;