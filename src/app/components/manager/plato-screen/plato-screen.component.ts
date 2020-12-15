import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Plato } from '../../../models/IPlato';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalCabeceraPlatoComponent } from '../../modales/modal-cabecera-plato/modal-cabecera-plato.component';
import { PlatoService } from '../../../services/generales/plato.service';
import { ModalProductoReventaComponent } from '../../modales/modal-producto-reventa/modal-producto-reventa.component';

@Component({
  selector: 'app-plato-screen',
  templateUrl: './plato-screen.component.html',
  styleUrls: ['./plato-screen.component.css']
})
export class PlatoScreenComponent implements OnInit {

  public displayedColumns: string[] = ['denominacion', 'tiempoPreparacion', 'precioVenta', 'categoriaPlato'];
  public dataSource: MatTableDataSource<Plato> = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public sidenavOpened: boolean = false;
  public platoSeleccionado: Plato = null;

  constructor(public dialog: MatDialog, public service: PlatoService) { }

  ngOnInit(): void {
    this.service.getAll(0,1000).subscribe(data => {
      this.dataSource.data = data;
    }); //Esto debe ocurrir antes
    this.dataSource.sort = this.sort; // que esto
    this.dataSource.paginator = this.paginator; // esto luego.f

    //Configuración del filtro
    this.dataSource.filterPredicate =
      (data: Plato, filter: string) =>
        data.denominacion.toLowerCase().trim().indexOf(filter.toLowerCase().trim()) != -1 ||
        data.categoriaPlato.denominacion.toLowerCase().trim().indexOf(filter.toLowerCase().trim()) != -1;;
  }

  public agregarNuevo() {
    const ref = this.dialog.open(ModalCabeceraPlatoComponent, { panelClass: 'custom-dialog-container' })
    ref.afterClosed().subscribe(data => {
      this.refreshData();
    })
  }
  
  public agregarNuevoReventa() {
    const ref = this.dialog.open(ModalProductoReventaComponent, { panelClass: 'custom-dialog-container' })
    ref.afterClosed().subscribe(data => {
      this.refreshData();
    })
  }

  public editar(element: Plato) {
    const ref = this.dialog.open(ModalCabeceraPlatoComponent, { panelClass: 'custom-dialog-container', data: { informacion: element } })
    ref.afterClosed().subscribe(data => {
      this.refreshData();
    })
  }

  public refreshData(): void {
    setTimeout(()=>{
      this.service.getAll(0,1000).subscribe(data => {
      this.dataSource.data = data;
    })
    },500)    
  }

  public eliminar(plato: Plato): void {
    if (confirm(`¿Está seguro que desea eliminar ${plato.denominacion}?`)) {
      this.service.delete(plato.id).subscribe(
        data => this.refreshData(),
        err => alert(`Ha ocurrido un error: ${err}`)
      )
    }
  }

  public verDetalles(elemento: Plato) {
    this.platoSeleccionado = elemento;
    this.sidenavOpened = true;
  }
  public filtrar(valorFiltro: string) {
    valorFiltro = valorFiltro.trim(); // Remueve espacios en blanco
    valorFiltro = valorFiltro.toLowerCase(); // Convierte a minusculas
    this.dataSource.filter = valorFiltro;
    console.log("buscando...")
  }

}
