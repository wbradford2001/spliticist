import React from 'react';
import styled from 'styled-components';
import Day from '../components/Day';
import AWS from 'aws-sdk'

const StyledHomePage = styled.div`
  color: black
`;

AWS.config.region = 'us-west-1';

const f_id_token = 'eyJraWQiOiJNRGRoSlgrdmo5dlRYNklBXC9sc2o3ekFFVGdUNktQaFpaUkF2RW5xZmwyRT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoibFg2Q09DckhjXzBHSHVIZXpYeVgydyIsInN1YiI6Ijg1MTA5NjBkLTcyMzctNGI2OS05YzVhLTg4ZjQwZjAzYWQwYiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0xLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMV9qcmZqT1RaZmciLCJjb2duaXRvOnVzZXJuYW1lIjoiODUxMDk2MGQtNzIzNy00YjY5LTljNWEtODhmNDBmMDNhZDBiIiwiYXVkIjoiMTZrcjdsM2dkMnVocm84OXBmbmtrNzdhcGkiLCJldmVudF9pZCI6IjQ0OTRkYzgwLTQzM2UtNGNkYi04YjA4LThkODJiN2RlZTExNCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjU5Mzc5OTM3LCJleHAiOjE2NTkzODM1MzcsImlhdCI6MTY1OTM3OTkzNywianRpIjoiODNmMmY5MjAtOTVlYy00M2Q3LWJmYzUtMWY2OTVmZjY5YTlkIiwiZW1haWwiOiJ3YnJhZGZvcmQyMDAxQGdtYWlsLmNvbSJ9.S9RkXkrOITmvkiAUhjnQAVfpyQ9Y1OB5lszMLHPX-G9Mj9TLNfcnV1dJRR53quQ-RxXEz7C8qt_buNy3hzcjE_f46vgi4QjYMYMZ7RImj5MVpV44QQNFmAYbPnCUb1F9mnO5RnKeJ79LTaiyLrCYbrCRIMM_l1BSFMDcmIdPEXuy-fyOXF34xXISrgbuj4nQziEakYD1TrgiTbf7RWSaWYjN_-Ng2TKmiYfRwmtBMccx6-58X4kXf8NYLP_FiQxvLqen4BbuFXVCr1p8DoQRc3BSKRfUBBchZ7BmCf3cTPPBUKbfC3DGwuIps1mrZBjc7aPYSDBXyJETRBjMnXE4hg'
const f_email = 'wbradford2001@gmail.com'
function getSplit(email, lambdaObj, Obj){
    const params = {
        FunctionName: 'arn:aws:lambda:us-west-1:649237903886:function:spliticistBackend', /* required */
        InvocationType: 'RequestResponse',
    
        Payload: `{"action":"getUser","email":"${email}"}` /* Strings will be Base-64 encoded on your behalf */,
    
      };    
    lambdaObj.invoke(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     {
        let Split=[]
        const TempSplit = JSON.parse(JSON.parse(data["Payload"])["body"])
        console.log(TempSplit)
        for (let day of TempSplit){
            console.log(day)
            const exercises = day["M"]["Exercises"]["L"].map((dict, index)=>{
                return({"Name": dict["M"]["Name"]["S"]})
            })
            Split.push({"Name": day["M"]["Name"]["S"], "Exercises": exercises})
        }
        console.log(Split)
        Obj.setState({split: Split}); 

        localStorage.setItem("Split", JSON.stringify(Split))        
              }          // successful response
  });
}

class HomePage extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loggedIn: false,
            split: [],
            email: null
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
            const JSONSplit = this.state.split
            console.log(typeof(JSONSplit))
                    
            return(<StyledHomePage key="keyhere">
                <div>
                    Welcom, {this.state.email}
                </div>
                <div>
                Your Split
                </div>
                <div>
                    
                    {JSONSplit.map((day,index)=>{
                        // return(<div>{Day["Name"]}</div>)
                        return(<Day key={index} title = {day["Name"]} exercises={day["Exercises"]}></Day>)
                    })}
                </div>
                </StyledHomePage>)
        }
    
    }
}

export default HomePage;