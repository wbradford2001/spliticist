import { render } from '@testing-library/react'
import React from 'react'
import Exercise from '../components/Exercise'

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
    addExercise(){
        this.props.addExercise(this.props.day)
    }

    render(){
        let exercises = this.props.exercises


        return(
            <div>
                <div>
                <input value = {this.state.title} onChange={this.handleTitleChange}/>
                <button onClick = {this.deleteSelf}>Delete</button>
                </div>
                <div style={{margin: "3rem"}}>
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
                <button onClick={this.addExercise}>+</button>
                </div>
            </div>
        )
    }
}

export default DayInput;