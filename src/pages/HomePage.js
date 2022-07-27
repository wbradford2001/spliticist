import React from 'react';
import styled from 'styled-components';
import AWS from 'aws-sdk'

const StyledHomePage = styled.div`
  color: blue
`;
// const login_url = 'https://spliticist.auth.us-west-1.amazoncognito.com/login?client_id=16kr7l3gd2uhro89pfnkk77api&response_type=token&scope=email+openid&redirect_uri=https://spliticist.com';
// const login_url = 'http://localhost:3000?client_id=16kr7l3gd2uhro89pfnkk77api&response_type=token&scope=email+openid&redirect_uri=https://spliticist.com';



class HomePage extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loggedIn: false
        }
    }
    componentDidMount(){
        console.log(localStorage)
        if (localStorage.getItem("id_token")===null){
            this.setState({loggedIn: false})
        } else {
            this.setState({loggedIn: true})
        }
    }
    
    render(){
        if (this.state.loggedIn === false){
            

            return(<StyledHomePage>You have NOT logged in</StyledHomePage>)
        } else {
            const id_token = localStorage.getItem("id_token")
            const access_token = localStorage.getItem("access_token")
            AWS.config.region = 'us-west-1'; // Region
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-west-1:3e1e5c4a-c1ae-44e0-a72b-c4ec1b3a791c',
                Logins: {
                    'cognito-idp.us-west-1.amazonaws.com/us-west-1_jrfjOTZfg': id_token
                }                
            }); 
            const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();  
            // const params = {
            //     AccessToken: access_token /* required */
            //   };
            cognitoidentityserviceprovider.getUser({AccessToken: access_token}, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
              });                     
            return(<StyledHomePage>You have logged in</StyledHomePage>)
        }
    
    }
}

export default HomePage;