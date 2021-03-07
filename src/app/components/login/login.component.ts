import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {

  constructor(public chatService : ChatService) { }

  ingresar(proveedor : string){
    this.chatService.login(proveedor);
  }

}
