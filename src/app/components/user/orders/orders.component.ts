import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UsuarioService } from '../../../services/authentication/usuario.service';
import { Pedido } from '../../../models/Pedido/IPedido';
import { ROL } from '../../../models/Persona/IRol';
import { OrderDetailsComponent } from '../order-details/order-details.component';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '../../../models/Persona/IUsuario';



@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {
  public usuario: Usuario;
  public displayedColumns: string[] = ['fecha', 'estado', 'conDelivery', 'total'];
  public dataSource: MatTableDataSource<Pedido> = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //============================
  // VARIABLES 
  //============================


  constructor(private usuarioService: UsuarioService,
    private dialog: MatDialog) {
    this.cargarDatos();
  }


  ngOnInit() {
    this.dataSource.data = []; //Esto debe ocurrir antes
    this.dataSource.sort = this.sort; // que esto
    this.dataSource.paginator = this.paginator; // esto luego.
  }

  public cargarDatos(): void {
    this.usuarioService.getCurrentUserData().subscribe(usuario => {
      this.usuario = usuario;
      if (usuario.rol.denominacion == ROL[ROL.CLIENTE]) {
        this.dataSource.data = usuario.pedidos;
      }
    })
  }

  public verDetalles(pedido: Pedido): void {
    const ref = this.dialog.open(OrderDetailsComponent, { panelClass: 'custom-dialog-container', data: { pedido: pedido, email: this.usuario.email } })
  }

}
