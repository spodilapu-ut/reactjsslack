import React from 'react';
import {Segment, Comment} from 'semantic-ui-react';

import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Message from './Message';

class Messages extends React.Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        privateMessagesRef: firebase.database().ref('privateMessages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages:[],
        messageLoading: false,
        numUniqueUsers:'',
        searchTerm: '',
        searchLoading:false,
        searchResults:[],
        privateChannel: this.props.isPrivateChannel
    }
    componentDidMount() {
        const {channel, user} = this.state;
        if(channel && user) {
            this.addListeners(channel.id);
        }
    }

    componentWillUnmount(){
        this.removeListeners();
    }

    removeListeners = () => {
        const {channel, user} = this.state;
        if(channel && user) {
            this.getMessagesRef().child(channel.id).off();
        }
    };

    getMessagesRef = () => {
        const {messagesRef, privateMessagesRef, privateChannel} = this.state;
        return privateChannel ? privateMessagesRef : messagesRef;
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
        
    };

    addMessageListener = channelId => {
        let loadedMessages = [];
        this.getMessagesRef().child(channelId).on('child_added', snap=>{
            loadedMessages.push(snap.val());
            this.setState({messages:loadedMessages, 'messageLoading':false} );
            this.countUniqueUsers(loadedMessages);
        });
    };

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message)=>{
            if(!acc.includes(message.user.name)){
                acc.push(message.user.name);
            }
            return acc;
        },[]);
        const numUniqueUsers = `${uniqueUsers.length} users`;
        this.setState({numUniqueUsers: numUniqueUsers});
    }

    displayMessages = messages => (
        messages.length > 0 && messages.map(message => (
            <Message 
                key={message.timestamp}
                message={message}
                user = {this.state.user}
                
            />
        ))
    )

    displayChannelName = channel => {
        return channel?`${this.state.privateChannel? '@':'#'}${channel.name}`:'';

    };
    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        },
        ()=> {this.handleSearchMessages()})
    }
    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc, message)=>{
            // eslint-disable-next-line
            if(message.content && message.content.match(regex) || message.user.name.match(regex)){
                acc.push(message);
            }
            return acc;
        },[]);
        this.setState({searchResults});
        setTimeout(()=>{this.setState({searchLoading: false});}, 1000);
    }
    render(){
        const {messagesRef, messages, channel, user, numUniqueUsers, searchTerm, searchResults, searchLoading, privateChannel} = this.state;
        return(
            <React.Fragment>
                <MessagesHeader 
                    channelName = {this.displayChannelName(channel)}
                    numUniqueUsers = {numUniqueUsers}
                    handleSearchChange = {this.handleSearchChange}
                    searchLoading = {searchLoading}
                    privateChannel = {privateChannel}
                />
                <Segment>
                    <Comment.Group className='messages'>
                        {/* Messages */}
                        {searchTerm ? this.displayMessages(searchResults): this.displayMessages(messages)}
                    </Comment.Group> 
                </Segment>
                <MessagesForm 
                    messagesRef={messagesRef}
                    currentChannel = {channel}
                    currentUser = {user}
                    privateChannel = {privateChannel}
                    getMessagesRef = {this.getMessagesRef}
                />
            </React.Fragment>
        );
    }
}

export default Messages;