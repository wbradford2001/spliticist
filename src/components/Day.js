import React from 'react';
import styled from 'styled-components';



const StyledDay = styled.div`
border: 1px solid black;
margin: 2rem;
border-radius: 1rem;
padding: 1rem;
display: flex;
align-items: center;
font-size: 1.5rem;
flex-flow: column;
`
const DayBody = styled.div`
border: 1px solid grey;
padding: 1rem;
font-size: 1rem;
width: 90%;
`


class Day extends React.Component{
    constructor(props){
        super(props)
        this.state={

        }
    }
    render(){

        return(
        <StyledDay>
            {this.props.title}
            <DayBody>

                {this.props.exercises.map((key, index)=>{
                    return(<li key={index}>{key["Name"]}</li>)
                })}
            </DayBody>
        </StyledDay>)
    }
}
export default Day;