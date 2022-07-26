import React from 'react';
import styled from 'styled-components';

const StyledEditPage = styled.div`
  color: purple
`;

class EditPage extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
                <StyledEditPage>Edit Page</StyledEditPage>
        )
    }
}

export default EditPage;