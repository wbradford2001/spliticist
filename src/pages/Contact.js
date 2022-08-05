import React from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

import CustomSpinner from '../components/CustomSpinner';
import AWS from 'aws-sdk';

import credentials from '../credentials';
// Create promise and SNS service object
const publishTextPromise = new AWS.SNS(credentials)

// Handle promise's fulfilled/rejected states
function sendEm(obj, message){
    const params = {
        
        Message: message, /* required */
        Subject: "spliticist inquiry",
        TopicArn: 'arn:aws:sns:us-west-1:649237903886:webresume'
    };        
    publishTextPromise.publish(params).promise().then(
        function(data) {
            obj.showModal(false);
            obj.setState({showSpinner: false})   
    }).catch(
            function(err) {

                obj.setState({modalText: "Oops, an error occured, please try again later!"})
                obj.showModal(true)  
                obj.setState({showSpinner: false})                  
                console.error(err, err.stack);
    });
}

class ContactPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            emailVal: "",
            messageVal: "",
            modal: false,
            modalTitle: "Success!",
            modalVariant: "success",
            modalText: "We will be in touch soon!",
            showSpinner: "false"
        }
        this.emailChange = this.emailChange.bind(this);
        this.messageChange = this.messageChange.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.showModal = this.showModal.bind(this)
    }
    validateForm(){
        if (this.state.emailVal === ""){
            return "Please Enter a Valid Email Address";
        }
        if (!this.state.emailVal.includes("@")){
            return "Please Enter a Valid Email Address(Must include '@' symbol)";
        }
        if (this.state.messageVal===""){
            return "Please Enter a Valid Message";
        }
        return "success";
    }
    showModal(errorFlag){
        if (errorFlag===false){
            this.state.modalTitle = "We will be in touch soon!";

            this.state.modalVariant = "success";
            this.state.modalText = "Thank you for reaching out"
            this.state.showSpinner="false"
        } else if (errorFlag===true){
            this.state.modalTitle = "Error";
            this.state.modalVariant = "danger";
            this.state.showSpinner="false" 
         
        } else if (errorFlag==="load"){
            this.state.modalTitle = "Loading";
            this.state.modalVariant = "secondary";            
            this.state.modalText = "One moment please!";
          
            this.state.showSpinner="true";
        }
        this.setState({modal: true})
    }
    hideModal(){
        this.setState({modal: false})
    }
    sendPost(){

        // let xhr = new XMLHttpRequest();
        // xhr.open("POST", "https://vlmtpqo1pe.execute-api.us-west-1.amazonaws.com/default/webresumeemail");
        // xhr.setRequestHeader("Accept", "application/json");
        // xhr.setRequestHeader("Content-Type", "application/json");



        // xhr.addEventListener(
        //     'load', ()=>
        //         {

        //             this.showModal(false)
        //         }
        // ) 
        // xhr.addEventListener(
        //     'error', ()=>
        //         {
        //             this.state.modalText = "Oops, an error occured, please try again later!"
        //             this.showModal(true)
        //         }
        // )                  

        // let data = `{"username": "${this.state.emailVal}","mes": "${this.state.messageVal}"}`;
        // let data = '{"username": "Usy","mes": "Messy"}';

       // xhr.send(data);


        // AWS.config.update([{ "accessKeyId":"AKIAZOKMYHIHFH2SM2O3", "secretAccessKey": "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", "region": "us-west-1" }])
        sendEm(this, `email: ${this.state.emailVal}, message: ${this.state.messageVal}`)    
        
    }
    sendEmail(event){
        event.preventDefault();

        const temp = this.validateForm()
        this.state.modalText= temp
        if (this.state.modalText === "success"){
            this.showModal("load")
            this.sendPost();
            
            
        } else {
            this.setState({showSpinner: false})
            this.showModal(true)

        }
    }
    emailChange(event){

        this.setState({emailVal: event.target.value})
        
    }
    messageChange(event){
        this.setState({messageVal: event.target.value})
    }    

    render(){
        const ContactForm ={

            backgroundColor: "rgba(30, 30, 30, 0.1)",
            
            height: "80vh",
            width: "90vw",
            border: "1px solid grey",
            borderRadius: "2rem",
            margin: "2rem",
            padding:"1rem",
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: "500px",
        
        }

        
            const EmailInput={
                margin: "0",
                border: "1px solid grey",
                borderRadius: "1rem",
                marginTop: "1rem"
            }
            const TextInput ={
                border: "1px solid grey",
                height: "50vh",
                padding: "1rem",
                width: "100%",
                margin: "0",
                borderRadius: "1rem",
                marginTop: "1rem",
                marginBottom: "1rem"
            }

            const SubmitButton={
                borderRadius: "1rem",
                width: "100%"
            }
        return (
            <div>
                <Modal show={this.state.modal} onHide={this.hideModal}>
                        <Modal.Header closeButton>
                        <Modal.Title>{this.state.modalTitle}</Modal.Title>
                            <CustomSpinner animation="border" role="status" show ={this.state.showSpinner}></CustomSpinner>
                        </Modal.Header>
                        <Modal.Body>
                            <Alert variant = {this.state.modalVariant}>
                                {this.state.modalText}
                            </Alert>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={this.hideModal}>
                            Ok
                        </Button>

                        </Modal.Footer>
                </Modal>
                <div className = "ContactForm" style = {ContactForm}>
                    {/* <FloatingLabel
                        controlId="floatingInput"
                        label="Email address"
                        className="mb-3"
                    > */}
                    <Form.Control style = {EmailInput} value={this.state.emailVal}  onChange={this.emailChange} type="email" placeholder="name@example.com" />
                    {/* </FloatingLabel> */}
                    {/* <FloatingLabel
                        controlId="floatingInput"
                        label="Message"
                        className="mb-3"
                    > */}
                    <Form.Control style = {TextInput}value={this.state.messageVal} onChange={this.messageChange}as = "textarea" required type="textinput" placeholder="My Message" />
                    {/* </FloatingLabel>                     */}
                    <Button  style = {SubmitButton} variant="primary" type="submit" onClick ={this.sendEmail}>
                        Submit
                    </Button>
                </div>
            </div>
        )
    }
}


export default ContactPage;