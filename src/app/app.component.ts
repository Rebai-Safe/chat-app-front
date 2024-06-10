import { Component,ViewChild } from '@angular/core';
import {ElementRef} from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent   {

title = 'angularSpringBootWebSocket';
wsEndPoint : string = 'http://localhost:8080/ws';
topic:string ='/topic/public';
stompClient= null; 
username:string;
messageContent:string;
connected:number;
//reference to the message area dom elment
@ViewChild('MessageArea', {static:false}) messageArea:ElementRef;





connect(){
    // set connection flag used to show connection page
    this.connected=1;
    
    console.log("Initializing WebSocket Connection From appComponent");
   
    //establish a connection with the SockJS server.
    let ws = new SockJS(this.wsEndPoint);
    
    //To create a STOMP client  object,call Stomp.over(url) with the URL corresponding to the server’s WebSocket endpoint
    this.stompClient = Stomp.over(ws);
    console.log("Stomp Client From "+this.stompClient);
   
   //call its connect() method to effectively connect and authenticate to the STOMP server.
     this.stompClient.connect({},()=> {

   // Subscribe to the Public Topic
    this.stompClient.subscribe(this.topic, 
        (payload) => {
            console.log("Payload received : \n "+ payload)
            //JSON.parse() takes a JSON string and transforms it into a JavaScript object
            var message = JSON.parse(payload.body);
           
            console.log("\n Message parsing"+ message)
            console.log("\n Message type "+ message.type)
        
            var messageElement = document.createElement('li');
        
           // sender status to show
            if(message.type === 'JOIN') {
                messageElement.classList.add('event-message');
                message.content = message.sender + ' joined!';
            } else if (message.type === 'LEAVE') {
                messageElement.classList.add('event-message');
                message.content = message.sender + ' left!';
            } else {
                messageElement.classList.add('chat-message');
        
                // sender name icon
                var avatarElement = document.createElement('i');
                var avatarText = document.createTextNode(message.sender[0]);
                avatarElement.appendChild(avatarText);
                avatarElement.style['background-color'] = this.getAvatarColor(message.sender);
        
                messageElement.appendChild(avatarElement);
        
                var usernameElement = document.createElement('span');
                var usernameText = document.createTextNode(message.sender);
                usernameElement.appendChild(usernameText);
                messageElement.appendChild(usernameElement);
            }
        
            var textElement = document.createElement('p');
            var messageText = document.createTextNode(message.content);
            textElement.appendChild(messageText);
        
            messageElement.appendChild(textElement);
        
            this.messageArea.nativeElement.appendChild(messageElement);
            this.messageArea.nativeElement.scrollTop = this.messageArea.nativeElement.scrollHeight;
        }
        )
   



     // Tell your username to the server
     this.stompClient.send("/app/chat.addUser",
     {},
     JSON.stringify({sender: this.username, type: 'JOIN'})
    )
   
}
    
    
    
    
    ,this.onError);
    
}
  


    



sendMessage() {
    
   
    if(this.messageContent && this.stompClient){
        var chatMessage = {
            sender:this.username,
            content:this.messageContent,
            type: 'CHAT'

        };

        this.stompClient.send("/app/chat.sendMessage",{},JSON.stringify(chatMessage));

}
}

onError(){
    console.log("connection error");
}




//randomly choose the avatar color
getAvatarColor(messageSender) {
    var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}


}
