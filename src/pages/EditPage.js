import React from 'react';
import styled from 'styled-components';
import AWS from 'aws-sdk'
import DayInput from '../components/DayInput';
import { isLabelWithInternallyDisabledControl } from '@testing-library/user-event/dist/utils';

// const data = require('./tempSplit.json')
const login_url = 'https://spliticist.auth.us-west-1.amazoncognito.com/login?client_id=16kr7l3gd2uhro89pfnkk77api&response_type=token&scope=email+openid&redirect_uri=https://spliticist.com';


function postSplit(email, split, lambdaObj){
    console.log(split)
    const packagedSplit = []
    for (let Day of split){
      if (Day){
        let exercises = []
        for (let exercise of Day["Exercises"]){
          if (exercise){

            exercises.push({"M" : {"Name": {"S": exercise["Name"]}}})
          }
        }
        const newDict = 
        {
          "M": 
            {
              "Name": {"S": Day["Name"]},
              "Exercises": {"L": exercises}
            }
        }
        console.log(newDict)
        packagedSplit.push(newDict)

      }
    }
    const params = {
        FunctionName: 'arn:aws:lambda:us-west-1:649237903886:function:spliticistBackend', /* required */
        InvocationType: 'RequestResponse',
    
        
        Payload: `{"action":"postUser","email":"${email}", "Split":${JSON.stringify(packagedSplit)}}` /* Strings will be Base-64 encoded on your behalf */,
    
      };  
        
    
    lambdaObj.invoke(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     {
        console.log(data["Payload"])
        localStorage.setItem("Split", split)

              }          // successful response
  });
}
class EditPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        JSONSplit: []
    };
    this.saveChanges = this.saveChanges.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleExerciseChange = this.handleExerciseChange.bind(this)
    this.addDay = this.addDay.bind(this)
    this.deleteDay = this.deleteDay.bind(this)
    this.deleteExercise = this.deleteExercise.bind(this)
    this.addExercise = this.addExercise.bind(this)
    }
    componentDidMount(){
    //     if (localStorage.getItem("Split")!==null){
    //       this.setState({Split: localStorage.getItem("Split")})
    //     }
    // }
            if (localStorage.getItem("Split")!==null){
                  const stringySplit = localStorage.getItem("Split")
                  const JSONState = (JSON.parse(stringySplit))
                  this.setState({JSONSplit: JSONState})
                  const id_token = localStorage.getItem("id_token")
                
                      
                      
                  // const access_token = localStorage.getItem("access_token")
                  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                      IdentityPoolId: 'us-west-1:3e1e5c4a-c1ae-44e0-a72b-c4ec1b3a791c',
                      Logins: {
                          'cognito-idp.us-west-1.amazonaws.com/us-west-1_jrfjOTZfg': id_token
                      }                
                  }); 
              }
        
          }
    saveChanges(){
      if (localStorage.getItem("id_token")!==null){
        const email = localStorage.getItem("email")
  
        const lambdaObj = new AWS.Lambda({apiVersion: '2015-03-31'});     
        postSplit(email, this.state.JSONSplit, lambdaObj)
      } else {
        window.location.replace(login_url);
      }

    }
    handleTitleChange(newTitle, day){
      let oldSplit = this.state.JSONSplit
      oldSplit[day]["Name"] = newTitle
      this.setState({JSONSplit: oldSplit})
      console.log(this.state.JSONSplit)

    }
    handleExerciseChange(day, exerciseNumber, newVal){
      let oldSplit = this.state.JSONSplit
      oldSplit[day]["Exercises"][exerciseNumber]["Name"] = newVal
      this.setState({JSONSplit: oldSplit})
    }
    addDay(){
      let oldSplit = this.state.JSONSplit
      oldSplit.push({"Name": "New Day",
      "Exercises": [
      ]
      })
      this.setState({JSONSplit: oldSplit})
    }
    deleteDay(day){
      let oldSplit = this.state.JSONSplit
      
      delete oldSplit[day]
      this.setState({JSONSplit: oldSplit})

    }
    deleteExercise(day, exerciseNumber){
      let oldSplit = this.state.JSONSplit
      console.log(oldSplit[day]["Exercises"][exerciseNumber])
      oldSplit[day]["Exercises"][exerciseNumber] = null
      console.log(oldSplit[day]["Exercises"][exerciseNumber])
      delete oldSplit[day]["Exercises"][exerciseNumber]
      this.setState({JSONSplit: oldSplit})
    }

    addExercise(day){
      let oldSplit = this.state.JSONSplit
      oldSplit[day]["Exercises"].push({"Name":""})
      this.setState({JSONSplit: oldSplit})      
    }
    render() {

      const state = this.state.JSONSplit


      return (
        <div>
              {state.map((day, index)=>{
                const name=day["Name"]
                return(<DayInput 
                  deleteDay = {this.deleteDay}
                  handleExerciseChange = {this.handleExerciseChange}
                  handleTitleChange={this.handleTitleChange} 
                  key = {index} 
                  day = {index}
                  title ={name} 
                  exercises={day["Exercises"]}
                  deleteExercise = {this.deleteExercise}
                  addExercise = {this.addExercise}
                  ></DayInput>)
              })}   
              <button onClick={this.addDay}>+</button>
              <button onClick={this.saveChanges}>Save Changes</button>       
        </div>
      );
    }
  }

export default EditPage;