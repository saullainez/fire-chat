import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../interfaces/mensaje.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];
  public usuario : any = {};

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe( user => {
      if(!user){return;}
      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
      this.usuario.photoURL = user.photoURL;
    });
  }

  login(proveedor:string) {
    switch (proveedor){
      case 'google':
        this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        break;
      case 'facebook':
        this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
        break;
      case 'github':
        this.afAuth.signInWithPopup(new firebase.auth.GithubAuthProvider);
        break;
      default: 
        return
    }
    
  }

  logout() {
    this.usuario = {};
    this.afAuth.signOut();
  }

  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5) );
    return this.itemsCollection.valueChanges().pipe(map((mensajes:Mensaje[]) => {
      this.chats = [];
      for (let mensaje of mensajes){
        this.chats.unshift(mensaje);
      }
      return this.chats;
    }))
  }

  agregarMensaje(texto:string){
    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid,
      photoURL: this.usuario.photoURL
    }

    return this.itemsCollection.add(mensaje);
  }
}
