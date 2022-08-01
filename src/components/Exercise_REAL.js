import React from 'react'


class Exercise extends React.Component{
    constructor(props){
        super(props)
        this.state={
            value: this.props.value
        }
        this.handleChange=this.handleChange.bind(this)
    }
    handleChange(event){
        this.setState({value: event.target.value})
    }
    render(){
        return(<input value={this.state.value}  onChange={this.handleChange}></input>)
    }
}

export default Exercise