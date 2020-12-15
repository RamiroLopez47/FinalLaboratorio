import { Component, OnInit } from '@angular/core';
import { RolService } from '../../../services/authentication/rol.service';
import { ApiPublicaService } from '../../../services/domicilio/api-publica.service';
import { EstadoService } from '../../../services/pedidos/estado.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public rolService: RolService,
    public apiPublicaService: ApiPublicaService,
    public estadoService: EstadoService) { }

  ngOnInit(): void {
  }

  // public popularBaseDeDatos(): void {
  //   console.log("Base de Datos Populada No vuelva a presionar")
  //   this.rolService.popularBdLocal();
  //   this.apiPublicaService.popularBDLocal();
  //   this.estadoService.popularBd();
  // }

}
