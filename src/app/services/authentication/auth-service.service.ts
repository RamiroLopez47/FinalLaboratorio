import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
// import { auth } from 'firebase';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ClienteService } from './cliente.service';
import { Cliente } from '../../models/Persona/ICliente';
import * as fbase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {


  constructor(public afService: AngularFireAuth, private router: Router, private clienteService: ClienteService) {
    this.getCurrentUser();
  }

  /**
   * 
   * Registra al usuario con su email y contrasenia
   */
  public async registerWithEmail(cliente: Cliente) {
    try {
      const respuesta = await this.afService.createUserWithEmailAndPassword(cliente.email, cliente.password)
      if (respuesta.additionalUserInfo.isNewUser) {
        // guardamos el nuevo cliente en la base de datos
        this.clienteService.guardarNuevoCliente(cliente).subscribe(() => null);
      }
    } catch (err) {
      alert(`${cliente.email} ya se encuentra registrado`);
      console.log(err)
    }


  }
  /**
   * Registra el usuario con su cuenta de google
   */
  public async registerWithGoogle() {
    try {
      const respuesta: fbase.auth.UserCredential = await this.afService.signInWithPopup(new fbase.auth.GoogleAuthProvider)
      if (respuesta.additionalUserInfo.isNewUser) {
        // guardamos el nuevo cliente en la base de datos 
        this.clienteService.postearUsuarioGoogle(respuesta);
      }
    }
    catch (err) {
      console.log("ha ocurrido un error", err)
    }

  }
  /**
   * Cierra la sesión
   */
  public logOut() {
    this.afService.signOut()
      .then(() => {
        // renavegacion a login 
        this.router.navigate(['/user/login'])
      })
      .catch((err) => console.log(err))
  }

  /**
   * Loguea a un usario con su usuario y contrasenia  
   * @param email string
   * @param password string
   */
  public login(email: string, password: string) {
    this.afService.signInWithEmailAndPassword(email, password)
      .then(() => {
        // renavegamos a home 
        this.redireccionar()
      })
      .catch(err => {
        // Captura del eror en caso de usuario incorrecto o contraseña invalida 
        if (err.code == 'auth/user-not-found') {
          alert('El usuario ingresado no existe')
        } else {
          alert('contraseña invalida')
        }
      })
  }

  /**
   * Devuelve en un momento dado el Estado de la autentificacion
   * Use este metodo para saber en este preciso momento esa informacion
   */
  public isAuthenticated(): Promise<boolean> {
    return new Promise((resolve, rejects) => {
      this.afService.onAuthStateChanged(user => {
        user ? resolve(true) : resolve(false)
      })
    });
  }

  /**
   * Retorna un Observable<boolean> al cual subcribirse y mantener una 
   * propiedad constantemente actualizada con respecto al estado
   * de autentificacion del usuario 
   */
  public onChangeAuthenticated(): Observable<boolean> {
    return new Observable(subscriber => {
      this.afService.onAuthStateChanged(auth => {
        if (auth) {
          subscriber.next(true)
        } else {
          console.log("no hay logueado")
          subscriber.next(false)
        }
      });
    });

  }
  /**
   * Redirecciona al home
   */
  private redireccionar(): void {
    this.router.navigate(['/home']);
  }
  /**
   * Devuelve una Promesa con el User Actual, que identifica firebase como logueado
   * en caso de no haber un usuario logueado devuelve null
   */

  public getCurrentUser(): Promise<firebase.User> {
    return new Promise((resolve, rejects) => {
      this.afService.onAuthStateChanged(
        data => resolve(data),
        err => rejects(err)
      )
    });
  }


}
