import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/authentication/usuario.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  public currentRol: string = "";

  constructor(private router: Router,
    private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarRol();
  }

  public buscar(termino: string) {
    this.router.navigate(['/menu', { termino: termino }]);
  }

  public cargarRol(): void {
    this.usuarioService.getCurrentUserData().subscribe(user => {
      if (user) {
        this.currentRol = user.rol.denominacion.toLocaleLowerCase();
      }
    })
  }
}
