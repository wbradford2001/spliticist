import React from 'react';
import styled from 'styled-components';
import Day from '../components/Day';
import AWS from 'aws-sdk'
import {Alert, Button} from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel';
import LeftBackground from '../images/spliticist_dumbell.jpeg'
import RightBackground from '../images/spliticist_pic2.webp'




const StyledHomePage = styled.div`
  color: black;

  
`;

const Title = styled(Alert)`
font-size: 2rem;
width: 80%;

opacity: 0.7;
display: flex;
align-items: center;
position: sticky;
top: 8%;
z-index: 1;
margin-left: auto;
margin-right: auto;
`

const DayContainer = styled.div`
display: flex;
justify-content: center;
width: 100vw;
flex-wrap: wrap;
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
const CustomCarousel = styled(Carousel)`
border: 1px solid black;
`
const StyledImg = styled.img`
width: 100vw;
height: 100vh;
object-fit: cover;
filter: brightness(40%)
`

const MINWIDTH = 600
const BulletPoints = styled.div`
margin: 3rem;
color: white;
display: flex;
justify-content: left;
flex-flow: column;
font-size: 3rem;

@media screen and (max-width: ${MINWIDTH}px){
    font-size: 2rem;
    }
`

const CustomeCheckMark = styled.span`
color: green;
font-size: 3rem;
margin: 2rem;
@media screen and (max-width: ${MINWIDTH}px){
    margin: 1rem;
    margin-left: 0rem;
    }
`







const BottomDiv = styled.div`

`
const LeftBackDivStyle = styled.div`
    background-image: url("${LeftBackground}");
    height: 50vh;
    width: 50vw;
    background-size: cover;
    opacity: 0.5;
    position: absolute;
    left: 0;
    z-index: 1;
    @media screen and (max-width: ${MINWIDTH}px){
        width: 100vw;
        position: static;

        }    
`
const LeftFrontDivStyle =styled.div`
    z-index: 2;
    position: absolute;
    height: 50vh;
    left: 0;
    width: 50vw;
    display: flex;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: ${MINWIDTH}px){
        width: 100vw;



        }      
`
const RightBackDivStyle = styled.div`
    background-image: url("${RightBackground}");
    height: 50vh;
    width: 50vw;
    background-size: cover;
    opacity: 0.3;    
    position: absolute;
    z-index: 1;
    right: 0;
    @media screen and (max-width: ${MINWIDTH}px){
        width: 100vw;

        }       
`
const RightFrontDivStyle = styled.div`
    z-index: 2;
    position: absolute;
    height: 50vh;
    width: 50vw;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: ${MINWIDTH}px){
        width: 100vw;
        position: relative;
        top: -700px;

        }      
`

const BottomButton = styled(Button)`

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
        // localStorage.setItem("id_token", 'eyJraWQiOiJNRGRoSlgrdmo5dlRYNklBXC9sc2o3ekFFVGdUNktQaFpaUkF2RW5xZmwyRT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiNm5ERkd2ZkRTTEUzZzFRci1RNjBYUSIsInN1YiI6IjBjMGFjMTA4LTIwNzUtNDFjYi1iOTYxLWE4YTZiZTcxOTRiOCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0xLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMV9qcmZqT1RaZmciLCJjb2duaXRvOnVzZXJuYW1lIjoiMGMwYWMxMDgtMjA3NS00MWNiLWI5NjEtYThhNmJlNzE5NGI4IiwiYXVkIjoiMTZrcjdsM2dkMnVocm84OXBmbmtrNzdhcGkiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY1OTY2MTkyOCwiZXhwIjoxNjU5NjY1NTI4LCJpYXQiOjE2NTk2NjE5MjksImp0aSI6ImNmY2EwNjExLTA1ODMtNDNiMi04M2MxLTE4NDdhZTZmMzg3YSIsImVtYWlsIjoid2JyYWRmb3JkMjAwMUBnbWFpbC5jb20ifQ.ieSBAHLM-O5oJY36N7gqOvAt_uNmVCHhOqkmU5i4jvxMiIeviCP_lD8A0V5YoMz-gotSFPwdD95qsijYj_yj9fMF3gQMMx6F0bg5oSdHwKHcx_SB-7uPvZupAQsPHApyvnjv0rTN4lvfgvEEsdXcgpFRgfxUr0llroZ37pKnXBvjsmLdLvavh-2K8EQeLh0ePfO4C4UzXLoTr9e4UfjUcdbaJMJFJUD5yz1xsPIYhw9dxyztw18N9fkGtLK9F-SrpbH8kvbp3mPK8s1JgoJWVv6LPZFtpwXK-Cd9X1KtI96qoFJ1lQmfXN-CsDm7JMO-K1ak_CoGag-jN5wmLJ9S1g')
        
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
            const Bullets = ["Create", "Update", "Delete", "Any Time", "Any Place"]

            return(<StyledHomePage>
               
                <div>
                    <CustomCarousel>
                        <Carousel.Item>
                            <StyledImg
                            className="d-block w-100"
                            src={require('../images/sweat.jpeg')}
                            alt="First slide"
                            />
                            <Carousel.Caption>
                            <h3>Spliticist</h3>
                            <p>The easiest way to track your workout splits.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <StyledImg
                            className="d-block w-100"
                            src={require('../images/spliticist5.jpeg')}
                            alt="Second slide"
                            />

                            <Carousel.Caption>
                            <h3>Super Convenient</h3>
                            <p>Easy Create and update workoutes</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <StyledImg
                            className="d-block w-100"
                            src={require('../images/spliticist_pic_1.webp')}
                            alt="Third slide"
                            />

                            <Carousel.Caption>
                            <h3>At your fingertips</h3>
                            <p>
                                Any time, any place.
                            </p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </CustomCarousel>

                </div>

                <BulletPoints>
                
                {Bullets.map((bullet, index)=>{
                    return(
                    <div key={index}>
                        <CustomeCheckMark className="material-symbols-outlined">
                            done_outline
                        </CustomeCheckMark>
                        {bullet}
                    </div>)
                })}
                </BulletPoints>




                <BottomDiv>

                    <LeftBackDivStyle >
                    </LeftBackDivStyle>
                    <LeftFrontDivStyle>
                            <BottomButton  href = {login_url}>Login</BottomButton>
                    </LeftFrontDivStyle>                

                    <RightBackDivStyle>
                    </RightBackDivStyle>
                    <RightFrontDivStyle>
                            <BottomButton  href = {'Edit'}>Create Split</BottomButton>
                    </RightFrontDivStyle>
                </BottomDiv>
               
                
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
                <DayContainer>
                    
                    {dayDisplays}
                </DayContainer>
                </StyledHomePage>)
        }
    
    }
}

export default HomePage;