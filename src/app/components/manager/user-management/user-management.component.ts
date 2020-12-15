import { UsuarioService } from './../../../services/authentication/usuario.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UsersComponent } from '../../modales/users/users.component';
import { Usuario } from 'src/app/models/Persona/IUsuario';
import { Empleado } from '../../../models/Persona/IEmpleado';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  public displayedColumns: string[] = ['nombre', 'email','rol', 'telefono','domicilio'];
  public dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public dialog: MatDialog,
              private service: UsuarioService) { }

  ngOnInit(): void {
    this.service.getAll(0,1000).subscribe(data => {
      this.dataSource.data = data; }); //esto debe ocurrir antes

    this.dataSource.sort = this.sort; // que esto

    this.dataSource.paginator = this.paginator; // y esto luego.

    this.dataSource.filterPredicate =
      (data: Usuario, filter: string) =>
        data.nombre.toLowerCase().trim().indexOf(filter.toLowerCase().trim()) != -1 ||
        data.apellido.toLowerCase().trim().indexOf(filter.toLowerCase().trim()) != -1 ||
        data.email.toLowerCase().trim().indexOf(filter.toLowerCase().trim()) != -1 ||
        data.telefono.toString().toLowerCase().trim().indexOf(filter.toLowerCase().trim()) != -1;;
  }

  public agregarNuevo() {
    this.dialog.open(UsersComponent, { panelClass: 'custom-dialog-container' })
  }

  public editar(empleado: Empleado) {
    const ref = this.dialog.open(UsersComponent, { panelClass: 'custom-dialog-container', data: { informacion: empleado } })
    ref.afterClosed().subscribe(data => {
      this.refreshData();
    })
  }

  public eliminar(element: Empleado) {
    if (confirm(`¿Esta seguro que desea eliminar ${element.nombre }${ element.apellido}?`)) {
      this.service.delete(element.id).subscribe(data => {
        if (data) {
          this.refreshData();
        }
      }, err => {
        alert(`No puede eliminarse este elemento`)
      }
      )
    }
  }
  public refreshData() {
    this.service.getAll(0,1000).subscribe(data => {
      this.dataSource.data = data;
    })
  }

  public filtrar(valorFiltro: string) {
    valorFiltro = valorFiltro.trim(); // Remueve espacios en blanco
    valorFiltro = valorFiltro.toLowerCase(); // Convierte a minusculas
    this.dataSource.filter = valorFiltro;
    console.log("buscando...")
  }
  
}
