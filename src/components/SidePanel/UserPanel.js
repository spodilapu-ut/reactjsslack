import React from 'react';
import firebase from '../../firebase';

import {Grid, Header, Icon, Dropdown} from 'semantic-ui-react';

class UserPanel extends React.Component {

    dropDownOptions = () => [{
        key: "user",
        text: <span>Signed in as <strong>User</strong></span>,
        disabled: true
    },
    {
        key: "avatar",
        text: <span>Change Avatar</span>
    },
    {
        key: "signout",
        text: <span onClick={this.handleSignOut}>Signout</span>
    }
    ];

    handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log('signed out') )
            .catch((err) => console.log(err))
    }
    render(){
        return(
            <Grid style={{background : '#4c3c4c'}}>
                <Grid.Column>
                    <Grid.Row style={{padding: '1.2rem', margin:0}}>
                        {/* Main Application Header*/}
                        <Header inverted floated="left" as="h2">
                            <Icon name="code"/>
                            <Header.Content>
                                DevChat
                            </Header.Content>
                        </Header>
                    </Grid.Row>
                    {/* User DropDown */}
                    <Header style={{padding: ".25em"}} as="h4" inverted>
                        <Dropdown trigger={
                            <span>User</span>
                        } options={this.dropDownOptions()} />
                    </Header>
                </Grid.Column>
            </Grid>
        )
    }
}

export default UserPanel;