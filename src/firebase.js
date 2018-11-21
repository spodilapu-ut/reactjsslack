import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
 
var config = {
apiKey: "AIzaSyAVc3xkI7HTR-HBq-202Zl5f9HpD7bgxl8",
authDomain: "react-slack-clone-sam.firebaseapp.com",
databaseURL: "https://react-slack-clone-sam.firebaseio.com",
projectId: "react-slack-clone-sam",
storageBucket: "react-slack-clone-sam.appspot.com",
messagingSenderId: "371092494855"
};
firebase.initializeApp(config);

export default firebase;