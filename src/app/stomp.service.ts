import {Injectable} from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';


@Injectable({
  providedIn: 'root'
})
export class StompService {

  constructor() {}

  socket = new SockJS('http://localhost:8080/sba-websocket');
  stompClient = Stomp.over(this.socket);

  subscribe(topic: string): any {
    this.stompClient.connect({}, (frame: string) => {
      console.log('Connected: ' + frame);
      this.stompClient.subscribe('/topic/prod-cons', (greeting : any) => {
        return greeting.body;
      });
    });
  }


}
