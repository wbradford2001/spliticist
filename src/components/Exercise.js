import React from 'react'
import {Form} from 'react-bootstrap'
import styled from 'styled-components'


const OuterDiv = styled.div`
display: flex;
`

const StyledTrash = styled.div`

display: flex;
align-items: center;
`
class Exercise extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exercise: this.props.exercise
        }
        this.handleChange = this.handleChange.bind(this)
        this.deleteSelf = this.deleteSelf.bind(this)
        this.mouseEnterTrash = this.mouseEnterTrash.bind(this)
        this.mouseLeaveTrash = this.mouseLeaveTrash.bind(this)
    }
    handleChange(event){
        this.setState({exercise: event.target.value})
        this.props.handleExerciseChange(event.target.value, this.props.exerciseNumber)
    }
    deleteSelf(event){
        this.props.deleteExercise(this.props.exerciseNumber)
    }

    mouseEnterTrash(event){
        document.body.style.cursor = 'pointer'

    }
    mouseLeaveTrash(event){
        document.body.style.cursor = 'auto'

    }      
    render(){
        return(<OuterDiv>
            
            <Form.Control value={this.state.exercise} onChange = {this.handleChange}/>
            <StyledTrash className="material-symbols-outlined"onClick = {this.deleteSelf} onMouseEnter={this.mouseEnterTrash} onMouseLeave={this.mouseLeaveTrash} size = {40}icon="delete" color='#440000'>delete</StyledTrash>

            </OuterDiv>)
    }
}

export default Exercise