import React from 'react';
import {Segment, Input, Button} from 'semantic-ui-react';
import firebase from '../../firebase';

class MessagesForm extends React.Component {
    state = {
        message: '',
        channel: this.props.currentChannel,
        loading: false,
        user: this.props.currentUser,
        errors:[]
    }
    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    createMessage = () => {
        const message = {
            content: this.state.message,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            }
        };
        return message;
    }

    sendMessage = () => {
        const {messagesRef} = this.props;
        const {message, channel} = this.state;
        console.log(this.props);
        console.log(this.state);
        if(message) {
            this.setState({loading: true});
            messagesRef
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(()=>{
                    this.setState({loading: false, message:'', errors:[]})
                })
                .catch(err=>{
                    this.setState({errors: this.state.errors.contact(err), loading:false})
                })
        }else {
            this.setState({
                errros: this.state.errors.contact({message: 'Add a message'})
            })
        }

    }
    render(){
        return(
            <Segment className="message__form">
            <Input 
                fluid
                name="message"
                style={{marginBottom: '0.7em'}}
                label={<Button icon={'add'}/>}
                labelPosition="left"
                placeholder="Write your message"
                onChange = {this.handleChange}
            />
            <Button.Group icon widths="2">
                <Button 
                    color="orange"
                    content="Add Reply"
                    labelPosition="left"
                    icon="edit"
                    onClick = {this.sendMessage}
                />
                <Button 
                    color="teal"
                    content="Upload Media"
                    labelPosition="right"
                    icon="cloud upload"
                />
            </Button.Group>
            </Segment>
        )
    }
}

export default MessagesForm;