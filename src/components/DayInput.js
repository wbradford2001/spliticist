import { render } from '@testing-library/react'
import React from 'react'
import Exercise from '../components/Exercise'
import {Form} from 'react-bootstrap'
import styled from 'styled-components'


const StyledForm = styled(Form)`
border: 1px solid grey;
border-radius: 1rem;
padding: 2rem;
margin: 1rem;
`
const StyledHeader=styled.div`
display: flex;
`

const StyledBody = styled.div`

padding: 1rem;
display: flex;
flex-flow: column;
align-items: center;
`


const StyledAb = styled.div`
margin: 1rem;

font-size: 30px;
`


const StyledTrash = styled.div`

display: flex;
align-items: center;
`


class DayInput extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            title: this.props.title
        }
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleExerciseChange = this.handleExerciseChange.bind(this)
        this.deleteSelf = this.deleteSelf.bind(this)
        this.deleteExercise = this.deleteExercise.bind(this)
        this.addExercise = this.addExercise.bind(this)
        this.mouseEnterTrash = this.mouseEnterTrash.bind(this)
        this.mouseLeaveTrash = this.mouseLeaveTrash.bind(this)
    }
    handleTitleChange(event){
        this.setState({title: event.target.value})
        this.props.handleTitleChange(event.target.value,this.props.day)
    }
    handleExerciseChange(newVal, exerciseNumber){
        this.props.handleExerciseChange(this.props.day, exerciseNumber, newVal)
    }
    deleteSelf(){
        this.props.deleteDay(this.props.day)
    }
    deleteExercise(exerciseNumber){
        this.props.deleteExercise(this.props.day, exerciseNumber)
    }
    addExercise(event){
        event.preventDefault();
        this.props.addExercise(this.props.day)
    }
    mouseEnterTrash(event){
        document.body.style.cursor = 'pointer'

    }
    mouseLeaveTrash(event){
        document.body.style.cursor = 'auto'

    }    
    render(){
        let exercises = this.props.exercises


        return(
            <StyledForm>
                <StyledHeader>
                    <Form.Control value = {this.state.title} onChange={this.handleTitleChange}/>

                        <StyledTrash className="material-symbols-outlined"onClick = {this.deleteSelf} onMouseEnter={this.mouseEnterTrash} onMouseLeave={this.mouseLeaveTrash} size = {40}icon="delete" color='#440000'>delete</StyledTrash>

                    {/* <button onClick = {this.deleteSelf}>Delete</button> */}
                </StyledHeader>
                <StyledBody >
                    {
                    exercises.map((exercise, index)=>{
 

                        return(<Exercise 
                            key={index} 
                            exerciseNumber = {index} 
                            handleExerciseChange = {this.handleExerciseChange}
                            exercise={exercise["Name"]}
                            deleteExercise={this.deleteExercise}
                             ></Exercise>)
                    })}

                        <StyledAb onClick={this.addExercise} onMouseEnter={this.mouseEnterTrash} onMouseLeave={this.mouseLeaveTrash}  className="material-symbols-outlined">add_box</StyledAb>
                </StyledBody>
            </StyledForm>
        )
    }
}

export default DayInput;