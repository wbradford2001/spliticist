import React from 'react'
import Exercise from '../components/Exercise'
import {Form, Overlay, Tooltip} from 'react-bootstrap'
import styled from 'styled-components'


const StyledForm = styled(Form)`
border: 1px solid grey;
border-radius: 1rem;
padding: 2rem;
margin: 1rem;
background-color: rgb(150, 150,150);
width: 70%;
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
color: green;
font-size: 30px;

`


const StyledTrash = styled.div`
color: red;
display: flex;
align-items: center;
`

const StyledTooltip = styled(Tooltip)`

`
class DayInput extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            title: this.props.title,
            showOverlay: false
        }
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleExerciseChange = this.handleExerciseChange.bind(this)
        this.deleteSelf = this.deleteSelf.bind(this)
        this.deleteExercise = this.deleteExercise.bind(this)
        this.addExercise = this.addExercise.bind(this)
        this.mouseEnterTrash = this.mouseEnterTrash.bind(this)
        this.mouseLeaveTrash = this.mouseLeaveTrash.bind(this)



        this.addExRef = React.createRef();
    }
    componentDidMount(){

        
        if (this.props.first==true){

            this.setState({showOverlay: true})
        }

        

        
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
        this.setState({showOverlay: false})
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

                        <StyledAb ref = {this.addExRef}onClick={this.addExercise} onMouseEnter={this.mouseEnterTrash} onMouseLeave={this.mouseLeaveTrash}  className="material-symbols-outlined">add_box</StyledAb>
                        <Overlay 
                            show={this.state.showOverlay}
                            target={this.addExRef.current}
                            placement="bottom"
                            

                            >
                            <StyledTooltip >

                                <strong>New Exercise</strong>

                            </StyledTooltip>
                        </Overlay>
                </StyledBody>
            </StyledForm>
        )
    }
}

export default DayInput;