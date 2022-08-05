import React from 'react';
import styled from 'styled-components';
import {Alert} from 'react-bootstrap';



const StyledDay = styled.div`
border: 1px solid grey;
background-color: rgb(100, 100, 100);
margin: 2rem;
border-radius: 1rem;
padding: 1rem;
display: flex;
align-items: center;
font-size: 1.5rem;
flex-flow: column;
flex-grow: 1;
min-width: 300px;
max-width: 400px;
`
const DayBody = styled.div`

padding: 0rem;
font-size: 1rem;
width: 50%;
display: flex;
align-items: center;
flex-flow: column
`

const StyledAlert = styled(Alert)`
    font-size: 1.5rem;
    padding: 0.7rem;
    display: flex;
    justify-content: center;
    width: 90%
`
const StyledExercise = styled(Alert)`
    width: 100%;
    padding: 0.5rem;
    margin: 0.5rem;   
    display: flex;
    justify-content: center 
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
            <StyledAlert variant="primary">
                
                {this.props.title}
            </StyledAlert>
            <DayBody>

                {this.props.exercises.map((key, index)=>{
                    return(<StyledExercise variant = "secondary" key={index}>{key["Name"]}</StyledExercise>)
                })}
            </DayBody>
        </StyledDay>)
    }
}
export default Day;