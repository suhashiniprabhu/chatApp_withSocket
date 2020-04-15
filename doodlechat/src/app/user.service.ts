import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  serverUrl= 'http://localhost:9000';
  observer: any;
  socketio: Socket;
  constructor( public http: HttpClient,
      private router: Router,

) { }
/**
   *
   * @param token
   * To save user details
   */
  sendToken(token: string) {
    localStorage.setItem('currentUser', token);
  }

  /**
   * To get token
   */
  getToken() {
    return localStorage.getItem('currentUser');
  }

  /**
   * To check user is loggedin or not
   */
  isLoggedIn() {
    return localStorage.getItem('currentUser');
  }

  /**
   * To logout the user
   */
  logout() {
    localStorage.removeItem('currentUser');
      this.router.navigate(['/']);

  }
/**
  * @param form
  * To add user
  */
  register(form) {
    return this.http.post(this.serverUrl + '/api/users' , form);
  }
/**
   * @param form
   * To login user
   */
  loginUser(form) {
    return this.http.post(this.serverUrl + '/auth/local/' , form);
  }
/**
  * @param form
  * To add user
  */
  getallUser() {
    return this.http.get(this.serverUrl + '/api/users/getallUser');
  }
 /**
   * @param message
   * To send message
   */
  sendMessage(message) {
    return this.http.post(this.serverUrl + '/api/messages' , message);
  }
  
  /**
   * @param data
   * To get Chat
   */
  getMessages(data) {
    return this.http.get(this.serverUrl + '/api/messages/getMessages/' + data);
  }

   /**
   * @param users
   * To create group
   */
  createGroup(users) {
    return this.http.post(this.serverUrl + '/api/groups' , users);
  }

  /**
   * @param id
   * To get all group
   */
  getAllGroups(id) {
    return this.http.get(this.serverUrl + '/api/groups/' + id);
  }

  /**
   * To get new message
   */
  newMessage() {
    const observable = new Observable<any>(observer => {
      this.socketio.on('messageCreate', (data) => {
                console.log(data)

        observer.next(data);
      });
    });
    return observable;
  }

    // Socket connection
  Connectsocket(type): Observable<number> {
    this.observer = new Observable();
    if (type.type === 'connect') {
      this.socketio = socketIo(this.serverUrl);
      this.socketio.emit('info', type.email);
    }
    if (type.type === 'disconnect') {
      this.socketio.emit('onDisconnect', '');
    }
    return this.createObservable();
  }
  // create an observerable
  createObservable(): Observable<number> {
    return new Observable<number>(observer => {
      this.observer = observer;
    });
  }
}

export interface Socket {
  _callbacks: any;
  on(event: string, callback: (data: any) => void );
  emit(event: string, data: any);
  disconnect();
  removeAllListeners(event: string);
}