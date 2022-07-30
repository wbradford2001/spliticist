import React from "react";

import styled from 'styled-components';
import Spinner from "react-bootstrap/Spinner";

const CustomSp = styled(Spinner)`
margin: 1rem;
`;

class CustomSpinner extends React.Component{
    constructor(props){
        super(props);
        
    }
    render(){
        if (this.props.show === 'false'){

            return (<div></div>)
        }
        return (
            <CustomSp animation="border"></CustomSp>
        )
            


    }
}

export default CustomSpinner;