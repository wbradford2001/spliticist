import React from 'react'

class Exercise extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exercise: this.props.exercise
        }
        this.handleChange = this.handleChange.bind(this)
        this.deleteSelf = this.deleteSelf.bind(this)
    }
    handleChange(event){
        this.setState({exercise: event.target.value})
        this.props.handleExerciseChange(event.target.value, this.props.exerciseNumber)
    }
    deleteSelf(event){
        this.props.deleteExercise(this.props.exerciseNumber)
    }
    render(){
        return(<div>
            
            <input value={this.state.exercise} onChange = {this.handleChange}/>
            <button onClick={this.deleteSelf}>Delete</button>
            </div>)
    }
}

export default Exercise