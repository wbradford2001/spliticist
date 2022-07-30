import React from 'react';
import styled from 'styled-components';
import AWS from 'aws-sdk'

const StyledEditPage = styled.div`
  color: purple
`;
const login_url = 'https://spliticist.auth.us-west-1.amazoncognito.com/login?client_id=16kr7l3gd2uhro89pfnkk77api&response_type=token&scope=email+openid&redirect_uri=https://spliticist.com';


function postSplit(email, split, lambdaObj, Obj){
   
    
    const params = {
        FunctionName: 'arn:aws:lambda:us-west-1:649237903886:function:spliticistBackend', /* required */
        InvocationType: 'RequestResponse',
    
        Payload: `{"action":"postUser","email":"${email}", "Split":"${split}"}` /* Strings will be Base-64 encoded on your behalf */,
    
      };    
    lambdaObj.invoke(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     {
        console.log("function called")
        localStorage.setItem("Split", split)

              }          // successful response
  });
}
class EditPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        split: ""
    };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({split: event.target.value});
      
    }
  
    handleSubmit(event) {
        if (localStorage.getItem("email")!==null){
            const Email = localStorage.getItem("email")
            event.preventDefault();
            const lambdaObj = new AWS.Lambda({apiVersion: '2015-03-31'});
            postSplit(Email, this.state.split, lambdaObj, this)
        } else {
            event.preventDefault();
            window.location.replace(login_url);
        }

    }
    componentDidMount(){
        if (localStorage.getItem("Split")!==null){
            this.setState({split: localStorage.getItem("Split")})
            const id_token = localStorage.getItem("id_token")
          
                
                
            const access_token = localStorage.getItem("access_token")
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-west-1:3e1e5c4a-c1ae-44e0-a72b-c4ec1b3a791c',
                Logins: {
                    'cognito-idp.us-west-1.amazonaws.com/us-west-1_jrfjOTZfg': id_token
                }                
            }); 
        }
    }
    render() {
      return (
        <StyledEditPage>
            <form onSubmit={this.handleSubmit}>
            <label>
                Name:
                <input type="text" value={this.state.split} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
            </form>
        </StyledEditPage>
      );
    }
  }

export default EditPage;