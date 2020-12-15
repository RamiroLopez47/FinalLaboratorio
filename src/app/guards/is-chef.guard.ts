import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/authentication/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class IsChefGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Observable<boolean>(sub => {
      this.usuarioService.getCurrentUserData().subscribe(user => {
        if (user.rol.denominacion.toLocaleLowerCase() == "cocinero" ||
        user.rol.denominacion.toLocaleLowerCase() == "gerente") {
          sub.next(true)
        } else {
          switch (user.rol.denominacion.toLocaleLowerCase()) {
            case 'delivery':
              this.router.navigate(['/delivery'])
              break;
            case 'cajero':
              this.router.navigate(['/cashier'])
              break;
            case 'cliente':
              this.router.navigate(['/home'])
              break;
            default:
              this.router.navigate(['/home'])
              break;
          }
          sub.next(false)
        }
      })
    })

  }

}
