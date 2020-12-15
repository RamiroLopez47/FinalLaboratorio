import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../services/authentication/auth-service.service';
import { Observable } from 'rxjs';
import { Router} from '@angular/router';
import { UsuarioService } from '../../../services/authentication/usuario.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  public estaLogueado: boolean = true;
  public user$: Observable<any> = this.authService.afService.user;
  public terminoBuscado: string = '';
  public currentRol: string = "";
  public timer: number = 0;

  constructor(private authService: AuthServiceService,
    private router: Router,
    private service: UsuarioService) {

    this.user$.subscribe(data =>
      this.getCurrentUserRol()
    )
  }

  ngOnInit(): void {
    this.authService.afService.user
  }

  public salir(): void {
    this.authService.logOut();
    this.currentRol = "";
  }
  public estaAutenticado() {
    this.authService.isAuthenticated()
      .then((data) => console.log(data))
      .catch(data => console.log("err", data))
  }

  public buscar(termino: string) {
    this.terminoBuscado = termino;
    this.router.navigate(['/menu', { termino: termino }]);
  }

  public validarRuta(): boolean {
    return !(
      this.router.url.includes('menu') ||
      this.router.url.includes('manager') ||
      this.router.url.includes('chef') ||
      this.router.url.includes('cashier') ||
      this.router.url.includes('delivery') ||
      this.currentRol.toLocaleLowerCase() != 'cliente'
    );
  }

  public getCurrentUserRol(): void {
    //Este metodo se ejecuta cada vez que se cambia el estado de logueo, 
    // Por lo que es util para obtener el rol constantemente
    setTimeout(() => {
      if (!this.currentRol && this.user$) {
        this.service.loadCurrentRol().subscribe(data => {
          if (data) {
            this.currentRol = data;
          }
        })
      }
      this.timer = 500;
      this.getCurrentUserRol();
    }, this.timer);
  }
}
