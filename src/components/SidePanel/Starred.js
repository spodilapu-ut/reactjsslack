import React from 'react';
import {connect} from 'react-redux';
import {setCurrentChannel, setPrivateChannel} from '../../actions';
import firebase from '../../firebase';
import {Menu, Icon} from 'semantic-ui-react';

class Starred extends React.Component {
    state = {
        user: this.props.currentUser,
        starredChannels: [],
        activeChannel: '',
        usersRef: firebase.database().ref('users')
    }

    componentDidMount() {
        this.addListeners(this.state.user.uid)
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    removeListeners = () => {
        this.state.usersRef.child(`${this.state.user.uid}/starred`).off();
    }

    addListeners = userId => {
        this.state.usersRef
            .child(userId)
            .child('starred')
            .on('child_added', snap=>{
                const starredChannel = {id:snap.key, ...snap.val()};
                this.setState({starredChannels:[...this.state.starredChannels, starredChannel]});
            })
        this.state.usersRef
            .child(userId)
            .child('starred')
            .on('child_removed', snap=>{
                const channelToRemove = {id:snap.key, ...snap.val()};
                this.setState({starredChannels:[...this.state.starredChannels, channelToRemove]});
                const filterredChannels = this.state.starredChannels.filter(channel => {
                    return channel.id !==channelToRemove.id
                });
                this.setState({starredChannels: filterredChannels});
            })
    }
    setActiveChannel = channel => {
        this.setState({activeChannel: channel.id});
    }
    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
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
    render() {
        const {starredChannels} = this.state;
        return(
            <React.Fragment>
                <Menu.Menu className="menu">
                    <Menu.Item>
                        <span>
                            <Icon name="star"/> STARRED
                        </span>{" "}
                        ({ starredChannels.length })
                    </Menu.Item>
                    {/* Channels */}
                    {this.displayChannels(starredChannels)}
                </Menu.Menu>
            </React.Fragment>
        );
    }
}

export default connect(null, {setCurrentChannel, setPrivateChannel})(Starred);