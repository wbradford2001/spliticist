import React from 'react';
import styled from 'styled-components';
import Exercise from './Exercise';



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
padding: 1rem;
font-size: 1rem;
width: 90%;
display: flex;
flex-flow: column
`


class DayInput extends React.Component{
    constructor(props){
        super(props)
        
        this.titleRef = React.createRef();
        this.Bodys = []
        this.state={
            title: this.props.title,
            day: this.props.day,
            length: (Object.keys(this.props.day)).length
        }
        for (let i =0; i< this.state.length; i++){
            this.Bodys[i] = React.createRef();
        }
        this.generateData = this.generateData.bind(this)
        this.onChangeHandler=this.onChangeHandler.bind(this)
    }
    onChangeHandler(event){
        this.setState({title: event.target.value})
        

        
    }
    generateData(){ 
                let returnObj = {}
                const tit = this.titleRef.current.value
                returnObj[tit]={}
        
                for (let ref of this.Bodys){
        
                    const key = ref.current.state.value
                    const newObj = {}
                    newObj[key]={}
                    returnObj[tit] = Object.assign(returnObj[tit], newObj)
                }
                return(returnObj)
    }
    render(){
        
        return(
        <StyledDay>
            <input ref = {this.titleRef}value={this.state.title} onChange={this.onChangeHandler}></input>
            <DayBody >
                {Object.keys(this.state.day).map((key, index)=>{
                    const newEx = <Exercise ref={this.Bodys[index]} key={index} value={key}></Exercise>
                    return(newEx)
                })}
            </DayBody>
        </StyledDay>)
    }
}
export default DayInput;