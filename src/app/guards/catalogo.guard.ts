import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../services/authentication/auth-service.service';
import { UsuarioService } from '../services/authentication/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogoGuard implements CanActivate {

  constructor(private authService: AuthServiceService, private router: Router,
    private usuarioService: UsuarioService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, rejects) => {
      this.authService.afService.onAuthStateChanged(user => {
        if (user) {
          this.usuarioService.getCurrentUserData().subscribe(datos => {
            if (datos.rol.denominacion.toLocaleLowerCase() == "cliente") {
              resolve(true)
            } else {
              resolve(false)
              this.router.navigate(['/home'])
            }
          })
        } else {
          resolve(true)
        }
      })
    });
  }

}
