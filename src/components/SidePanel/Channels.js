import React from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import {connect} from 'react-redux';
import {setCurrentChannel, setPrivateChannel} from '../../actions';
import firebase from '../../firebase';

class Channels extends React.Component {
    state = {
        user: this.props.currentUser,
        channels : [],
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        modal: false,
        firstLoad: true,
        activeChannel : false
    }
    openModal = () => this.setState({modal: true});

    closeModal = () => this.setState({modal: false});

    handleChange = event => {
        this.setState({[event.target.name]:event.target.value});
    }

    componentDidMount() {
        this.addListeners();
    }

    componentWillMount(){
        this.removeListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap=>{
            loadedChannels.push(snap.val());
            // console.log(loadedChannels);
            this.setState({channels:loadedChannels}, ()=> this.setFirstChannel());
        });
    };

    removeListeners = () => {
        this.state.channelsRef.off();
    };

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
        }
        this.setState({firstLoad: false});
    }

    addChannel = () => {
        const {channelsRef, channelName, channelDetails, user} = this.state;
        const key = channelsRef.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy:{
                name:user.displayName,
                avatar: user.photoURL
            }
        }
        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({channelName: '', channelDetails: ''});
                this.closeModal();
                console.log('Channel Saved');
            })
            .catch((err) => {
                console.log(err);
            })

    }

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid(this.state)) {
         this.addChannel();   
        }
    }

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
    }

    setActiveChannel = channel => {
        this.setState({activeChannel: channel.id});
    }

    displayChannels = channels => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={()=> this.changeChannel(channel)}
                name={channel.name}
                style={{opcaity: 0.7}}
                active={channel.id === this.state.activeChannel}
            >
                # {channel.name}
            </Menu.Item>
        ))
    )

    isFormValid = ({channelName, channelDetails}) => channelName && channelDetails;

    render(){
        const {channels, modal} = this.state;
        return(
            <React.Fragment>
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="exchange"/> CHANNELS
                    </span>{" "}
                    ({ channels.length }) <Icon name="add" onClick={this.openModal}/>
                </Menu.Item>
                {/* Channels */}
                {this.displayChannels(channels)}
            </Menu.Menu>

            <Modal basic open={modal} onClose = {this.closeModal}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form onSubmit = {this.handleSubmit}>
                        <Form.Field>
                            <Input 
                                fluid
                                label="Name of the Channel"
                                name="channelName"
                                onChange={this.handleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Input 
                                fluid
                                label="About the channel"
                                name="channelDetails"
                                onChange={this.handleChange}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" inverted onClick={this.handleSubmit}>
                        <Icon name="checkmark"/> Add
                    </Button>
                    <Button color="red" inverted onClick={this.closeModal}>
                        <Icon name="remove"/> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
            </React.Fragment>
        )
    }
}

export default connect(null, {setCurrentChannel, setPrivateChannel})(Channels);