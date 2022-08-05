import React from 'react';
import styled from 'styled-components';
import AWS from 'aws-sdk'
import DayInput from '../components/DayInput';
import {Alert,Modal,Button, Popover } from 'react-bootstrap'
import CustomSpinner from '../components/CustomSpinner'


// const data = require('./tempSplit.json')
const login_url = 'https://spliticist.auth.us-west-1.amazoncognito.com/login?client_id=16kr7l3gd2uhro89pfnkk77api&response_type=token&scope=email+openid&redirect_uri=https://spliticist.com';

const StyledEditPage = styled.div`
display: flex;
flex-flow: column;
align-items: center
`
const AbContainer = styled(Button)`
border: 2px solid white;
border-radius: 1rem;
padding: 1rem;
display: flex;
justify-content: center;
align-items: center;
flex-flow: column;
margin-top: 5rem;
`
const StyledAb = styled.div`
font-size: 40px;
color: white;


margin-left: auto;
margin-right: auto;

`

const SaveChanges = styled(Button)`

width: 40vw;
display: flex;
justify-content: center;
scroll: none;
opacity: 0.7;
margin: 0rem;
margin-top: 5rem;
`

function postSplit(email, split, lambdaObj, obj){
    obj.setState({popup: 'loading'})
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
        packagedSplit.push(newDict)

      }
    }
    const params = {
        FunctionName: 'arn:aws:lambda:us-west-1:649237903886:function:spliticistBackend', /* required */
        InvocationType: 'RequestResponse',
    
        
        Payload: `{"action":"postUser","email":"${email}", "Split":${JSON.stringify(packagedSplit)}}` /* Strings will be Base-64 encoded on your behalf */,
    
      };  
        
    
    lambdaObj.invoke(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      obj.setState({popup: 'error'})
      if (err.stack.includes('CredentialsError')){
        localStorage.clear()
        window.location.replace(login_url)

    }

    } // an error occurred
    else     {
        console.log(data["Payload"])
        if (data["Payload"].includes('errorMessage')){
          obj.setState({popup: 'error'})
        } else {

          obj.setState({popup: 'success'})
          localStorage.setItem("Split", JSON.stringify(split))
        }

              }          // successful response
  });
}
class EditPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        JSONSplit: [],
        popup: null,
        showSpinner: "false"
    };
    this.saveChanges = this.saveChanges.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleExerciseChange = this.handleExerciseChange.bind(this)
    this.addDay = this.addDay.bind(this)
    this.deleteDay = this.deleteDay.bind(this)
    this.deleteExercise = this.deleteExercise.bind(this)
    this.addExercise = this.addExercise.bind(this)
    this.returnModal = this.returnModal.bind(this)
    this.hideModal=this.hideModal.bind(this)



    }
    componentDidMount(){
      
    //     if (localStorage.getItem("Split")!==null){
    //       this.setState({Split: localStorage.getItem("Split")})
    //     }
    // }

            //localStorage.setItem("Split",'[{"Name":"Push","Exercises":[{"Name":"Bench"},{"Name":"Incline Bench"},{"Name":"Decline Bench"}]},{"Name":"Pull","Exercises":[{"Name":"Pull-ups"},{"Name":"Curls"},{"Name":"Rows"}]},{"Name":"Legs","Exercises":[{"Name":"Squat"}]}]')
            // localStorage.setItem("Split","[]")
            // localStorage.setItem("id_token",'eyJraWQiOiJNRGRoSlgrdmo5dlRYNklBXC9sc2o3ekFFVGdUNktQaFpaUkF2RW5xZmwyRT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoia21oTFJPNW9kNTdCZzEtVHRYMFBvdyIsInN1YiI6IjBjMGFjMTA4LTIwNzUtNDFjYi1iOTYxLWE4YTZiZTcxOTRiOCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0xLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMV9qcmZqT1RaZmciLCJjb2duaXRvOnVzZXJuYW1lIjoiMGMwYWMxMDgtMjA3NS00MWNiLWI5NjEtYThhNmJlNzE5NGI4IiwiYXVkIjoiMTZrcjdsM2dkMnVocm84OXBmbmtrNzdhcGkiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY1OTU2MDE5NCwiZXhwIjoxNjU5NTYzNzk0LCJpYXQiOjE2NTk1NjAxOTQsImp0aSI6IjQ5OTBiNGI5LWUyYTEtNDkwNi1hZDgwLTNkODEzYmYyOGQxYSIsImVtYWlsIjoid2JyYWRmb3JkMjAwMUBnbWFpbC5jb20ifQ.h88D4D6ypfS5rRWDby8nKiuNy5Jx9wKXiU-Q3C8JGO6EojrE0InWFy6-1Sm86iDxZnWx5G7yJBIsD4p_n5lDKLsELzeyPk0_vWwjnI4zkBukw39YKa7i9aGNWD1oYnbhfUo2B6FUEaKJ71fU0hGINQ4tNe_H_qXsdZpretlDDCqp7Rj8_2vTqUmaKQq76e1xV58w9xTqvAQHftWjLuC7cD8HVLqm_zOd3crG9I6VmOogH583ju-R4cgFfHDxRjZOCc4DFCfWPxde0v7_riXuCMb91mpYo85YrkszB-IOa4G0SZI27iR-4FMhcrDVA-u3mwKnI6ZRTRmaJkdAZT3XSw')
           
            if (localStorage.getItem("Split")!==null){
              
                  const stringySplit = localStorage.getItem("Split")
                  
                  const JSONState = (JSON.parse(stringySplit))
                  
                  this.setState({JSONSplit: JSONState})
                  const id_token = localStorage.getItem("id_token")
                

                      
                  // const access_token = localStorage.getItem("access_token")
                  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                      IdentityPoolId: 'us-west-1:3e1e5c4a-c1ae-44e0-a72b-c4ec1b3a791c',
                      Logins: {
                          'cognito-idp.us-west-1.amazonaws.com/us-west-1_jrfjOTZfg':id_token

                      }                
                  }); 
              } 


        
          }
    saveChanges(){
      if (localStorage.getItem("id_token")!==null){
        const email = localStorage.getItem("email")
  
        const lambdaObj = new AWS.Lambda({apiVersion: '2015-03-31'});     
        postSplit(email, this.state.JSONSplit, lambdaObj, this)
      } else {
        window.location.replace(login_url);
      }

    }
    handleTitleChange(newTitle, day){
      let oldSplit = this.state.JSONSplit
      oldSplit[day]["Name"] = newTitle
      this.setState({JSONSplit: oldSplit})

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
      console.log(this.state.JSONSplit)
      

           
    }
    deleteDay(day){
      let oldSplit = this.state.JSONSplit
      
      delete oldSplit[day]
      this.setState({JSONSplit: oldSplit})
      



    }
    deleteExercise(day, exerciseNumber){
      let oldSplit = this.state.JSONSplit
      
      oldSplit[day]["Exercises"][exerciseNumber] = null
     
      delete oldSplit[day]["Exercises"][exerciseNumber]
      this.setState({JSONSplit: oldSplit})
    }

    addExercise(day){
      let oldSplit = this.state.JSONSplit
      oldSplit[day]["Exercises"].push({"Name":"New Exercise"})
      this.setState({JSONSplit: oldSplit})      
    }
      
  hideModal(){
    this.setState({popup: null})
  }
  returnModal(title, body, variant){
    return(
    <Modal show={this.state.popup !==null} onHide={this.hideModal}>
    <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
        <CustomSpinner animation="border" role="status" show ={(title==="Loading")}></CustomSpinner>
    </Modal.Header>
    <Modal.Body>
        <Alert variant = {variant}>
            {body}
        </Alert>
    </Modal.Body>
    <Modal.Footer>
    <Button variant="secondary" onClick={this.hideModal}>
        Ok
    </Button>

    </Modal.Footer>
  </Modal>)
  }
    render() {
      console.log(this.state.JSONSplit)

      const state = this.state.JSONSplit

      let MODAL=(<div></div>)
      if (this.state.popup==='loading'){
         MODAL = this.returnModal("Loading","One moment please","secondary")
      } else if (this.state.popup === 'success'){
         MODAL = this.returnModal("Success","Enjoy your new Split!","success")
      } else if (this.state.popup === 'error'){
         MODAL = this.returnModal("Oops, an error occured!","Please try again later!","danger")
      } 


      return (
        <StyledEditPage>


            {MODAL}




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
              <AbContainer onClick={this.addDay} variant="success">
                <StyledAb  className="material-symbols-outlined">add</StyledAb>
                  <div>Create Day</div>
              </AbContainer>
                <SaveChanges variation = "primary" onClick={this.saveChanges}>Save Changes</SaveChanges>   
        </StyledEditPage>
      );
    }
  }

export default EditPage;