import React from 'react';
import styled from 'styled-components';
import Day from '../components/Day';
import AWS from 'aws-sdk'
import {Alert, Button} from 'react-bootstrap'



const StyledHomePage = styled.div`
  color: black
  
`;

const Title = styled(Alert)`
font-size: 2rem;
width: 100%;
opacity: 0.7;

position: sticky;
top: 8%;
z-index: 1;
margin-left: 3rem;
`
const ButtonContainer = styled.div`
width: 100%;
height: 70vh;
margin: 0;
display: flex;
justify-content: center;
align-items: center;

`
const StyledButton = styled(Button)`

`

AWS.config.region = 'us-west-1';
const login_url = 'https://spliticist.auth.us-west-1.amazoncognito.com/login?client_id=16kr7l3gd2uhro89pfnkk77api&response_type=token&scope=email+openid&redirect_uri=https://spliticist.com';


function getSplit(email, lambdaObj, Obj){
    const params = {
        FunctionName: 'arn:aws:lambda:us-west-1:649237903886:function:spliticistBackend', /* required */
        InvocationType: 'RequestResponse',
    
        Payload: `{"action":"getUser","email":"${email}"}` /* Strings will be Base-64 encoded on your behalf */,
    
      };    
    lambdaObj.invoke(params, function(err, data) {
    if (err) {
        console.log(err)
        console.log(err.stack)

        if (err.stack.includes('CredentialsError')){
            localStorage.clear()

            window.location.replace(login_url)

        }
    } 
    else     {
        let Split=[]
        const TempSplit = JSON.parse(JSON.parse(data["Payload"])["body"])

        for (let day of TempSplit){
            console.log(day)
            const exercises = day["M"]["Exercises"]["L"].map((dict, index)=>{
                return({"Name": dict["M"]["Name"]["S"]})
            })
            Split.push({"Name": day["M"]["Name"]["S"], "Exercises": exercises})
        }

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

        
        //delete me
        // localStorage.setItem("id_token", 'eyJraWQiOiJNRGRoSlgrdmo5dlRYNklBXC9sc2o3ekFFVGdUNktQaFpaUkF2RW5xZmwyRT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoib21aSjUyRm5sVUVuMmxLTXVoLWJldyIsInN1YiI6IjBjMGFjMTA4LTIwNzUtNDFjYi1iOTYxLWE4YTZiZTcxOTRiOCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0xLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMV9qcmZqT1RaZmciLCJjb2duaXRvOnVzZXJuYW1lIjoiMGMwYWMxMDgtMjA3NS00MWNiLWI5NjEtYThhNmJlNzE5NGI4IiwiYXVkIjoiMTZrcjdsM2dkMnVocm84OXBmbmtrNzdhcGkiLCJldmVudF9pZCI6ImEwMmYwYzMyLWU1OGEtNDkwMy05ZGJlLWIwODEwYzRhMGJjMyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjU5Mzk4NDc2LCJleHAiOjE2NTk0MDIwNzYsImlhdCI6MTY1OTM5ODQ3NiwianRpIjoiZjdlMDhmNDItMzIxYi00MjlmLTk3MjctMGZlMmUxMTFjYzk4IiwiZW1haWwiOiJ3YnJhZGZvcmQyMDAxQGdtYWlsLmNvbSJ9.kJAGfyvqxTyQGyzy2WPToCjWCa8q3LFy2herD03uLbs6xq4nR1uoi-udU7P8GUSB_RkUSS0TaQ5418hNzbP2S6YMcwjO8fPNNqUrR3aeBwf3DwILi-WyXJZJadRs1FzdDySbcKk2dTP35sjPiziQr6YvWtfdPd6mZBm3HJAvG6hUdrPF2acz2ZfkO446CjeGVl9WqIzpjX1tQf_ood8LtJWosgFIG8Au6_Ovp2FEHxedNBFuQw7JDFz1dV43yYiEbud1mJRSi7OUHZUC8MOeC6sPGzuHHvgOH4bjy9usa0bKDA0Wmkdp-TVmJMwVCUcXIf9j4GMj0iV-NRIL2_0dCw')
        
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

            let dayDisplays = []
            let i=0
            for (let day of JSONSplit){
                if (day){
                    dayDisplays.push(<Day key={i} title = {day["Name"]} exercises={day["Exercises"]}></Day>)
                    i++
                }
            } 
            if (dayDisplays.length == 0){
                dayDisplays = (<ButtonContainer><StyledButton href="/Edit" variant="success">Create Split</StyledButton></ButtonContainer>)
            }
            return(<StyledHomePage key="keyhere">
                <Title variant="light">
                    Welcome, {this.state.email.split('@')[0]}!
                </Title>
                <div>
                    
                    {dayDisplays}
                </div>
                </StyledHomePage>)
        }
    
    }
}

export default HomePage;