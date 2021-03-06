let chatBox;
let roomName;
let socket = io();

//initialize nedb
// let Datastore = require('nedb');
// let db = new Datastore('stories.db');
// db.loadDatabase();

window.addEventListener('load', function () {

    //Open and connect socket to private namespace
    let socket = io('/private');
    //Listen for confirmation of connection
    socket.on('connect', function () {
        console.log("Connected");
    });

    //Get room name
    //let roomName = document.getElementById('roomName');
    //let roomName = window.prompt("create a new haiku");
    //console.log(roomName);

    //Check if a name was entered
    //if (roomName) {
    //let roomNameOnPage = document.getElementById('roomName');
    //roomNameOnPage.innerHTML = roomName;
    //Emit Msg to join the room
    socket.emit('room', {
        "room": "main-room"
    });
    // } else {
    // alert("Please refresh and enter a room name");
    // }

    /* --- Code to RECEIVE a socket message from the server --- */
    chatBox = document.getElementById('chat-box-msgs');

    //Listen for the 'joined' msg from the server
    socket.on('joined', function (data) {
        //console.log("A new user has joined the chat!");
        console.log(data);
        //Set a boolean to manage if this is a welcome msg
        data.newUser = true;
        addMsgToPage(data);
    });

    //Listen for messages named 'msg' from the server
    socket.on('msg', function (data) {
        console.log("Message arrived!");
        console.log(data);
        addMsgToPage(data);
        //db.insert(data);
    });

    /* --- Code to SEND a socket message to the Server --- */
    let nameInput = document.getElementById('username-input')
    let msgInput = document.getElementById('msg-input');
    let sendButton = document.getElementById('send-button');

    sendButton.addEventListener('click', function () {
        let curName = nameInput.value;
        let curMsg = msgInput.value;
        let msgObj = {
            "name": curName,
            "msg": curMsg
        };

        //Send the message object to the server
        socket.emit('msg', msgObj);

    });
    sendButton.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            //event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("myBtn").click();
        }
    });
});

function addMsgToPage(obj) {
    //Create a message string and page element
    let receivedMsg;
    if (obj.newUser) {
        receivedMsg = obj.msg;
    } else {
        receivedMsg = obj.name + ": " + obj.msg;
    }
    let msgEl = document.createElement('p');
    msgEl.innerHTML = receivedMsg;

    //Add the element with the message to the page
    chatBox.appendChild(msgEl);
    //Add a bit of auto scroll for the chat box
    chatBox.scrollTop = chatBox.scrollHeight;



}
