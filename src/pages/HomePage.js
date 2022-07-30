import React from 'react';
import styled from 'styled-components';
import AWS from 'aws-sdk'

const StyledHomePage = styled.div`
  color: blue
`;

AWS.config.region = 'us-west-1';


function getSplit(email, lambdaObj, Obj){
    const params = {
        FunctionName: 'arn:aws:lambda:us-west-1:649237903886:function:spliticistBackend', /* required */
        InvocationType: 'RequestResponse',
    
        Payload: `{"action":"getUser","email":"${email}"}` /* Strings will be Base-64 encoded on your behalf */,
    
      };    
    lambdaObj.invoke(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     {
        let Split = JSON.parse(data["Payload"])["body"]
        console.log(Split)
        Split = Split.slice(1,-1)
        
        localStorage.setItem("Split", Split)
        Obj.setState({split: Split}); 
              }          // successful response
  });
}

class HomePage extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loggedIn: false,
            split: "",
            email: ""
        }

    }
    componentDidMount(){
        
        if (localStorage.getItem("id_token")===null){
            this.setState({loggedIn: false})
        } else {
            this.setState({loggedIn: true})
            const id_token = localStorage.getItem("id_token")
        
        
            const access_token = localStorage.getItem("access_token")
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-west-1:3e1e5c4a-c1ae-44e0-a72b-c4ec1b3a791c',
                Logins: {
                    'cognito-idp.us-west-1.amazonaws.com/us-west-1_jrfjOTZfg': id_token
                }                
            }); 
            const lambdaObj = new AWS.Lambda({apiVersion: '2015-03-31'});
    
                 

            function parseJwt (token) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
            
                return JSON.parse(jsonPayload);
            };
            // const CogUser = parseJwt(id_token)["cognito:username"]
            const Email =  parseJwt(id_token)["email"]
            this.setState({email: Email})
            localStorage.setItem("email", Email)
            getSplit(Email, lambdaObj, this)
        }
              
    }
   
    render(){
        if (this.state.loggedIn === false){
            

            return(<StyledHomePage>
               
                You have NOT logged in
                </StyledHomePage>)
        } else {

                    
            return(<StyledHomePage key="keyhere">
                <div>
                    Welcom, {this.state.email}
                </div>
                Your Split is;{this.state.split}
                </StyledHomePage>)
        }
    
    }
}

export default HomePage;