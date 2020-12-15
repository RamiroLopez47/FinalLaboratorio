import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MedidaArticulo } from '../../../models/IMedidaArticulo';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MedidaArticuloService } from '../../../services/generales/medida-articulo.service';
import { ModalMedidaArticuloComponent } from '../../modales/modal-medida-articulo/modal-medida-articulo.component';

@Component({
  selector: 'app-medida-articulo-screen',
  templateUrl: './medida-articulo-screen.component.html',
  styleUrls: ['./medida-articulo-screen.component.css']
})
export class MedidaArticuloScreenComponent implements OnInit {
  // NOMBRE DE REFERENCIA A COLUMNAS
  public displayedColumns: string[] = ['denominacion'];
  //OBJETO DE DATOS DE LA TABLA
  public dataSource: MatTableDataSource<MedidaArticulo> = new MatTableDataSource();
  //DEFINICION DE ELEMENTOS DE PAGINACION Y SORTING
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public dialog: MatDialog, private servicio: MedidaArticuloService) {
  }

  ngOnInit(): void {
    this.referenciarTabla();

    //Configuración del filtro
    this.dataSource.filterPredicate =
      (data: MedidaArticulo, filter: string) =>
        data.denominacion.toLowerCase().trim().indexOf(filter.toLowerCase().trim()) != -1
  }

  public referenciarTabla(): void {
    this.servicio.getAll(0,1000).subscribe(data => {
      this.dataSource.data = data;
    })
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public agregarNuevo() {
    let ref = this.dialog.open(ModalMedidaArticuloComponent, { panelClass: 'custom-dialog-container' });
    ref.afterClosed().subscribe(data => {
      this.refreshData();
    });
  }

  public editar(medidaArticulo: MedidaArticulo) {
    let ref = this.dialog.open(ModalMedidaArticuloComponent, { panelClass: 'custom-dialog-container', data: { informacion: medidaArticulo } });
    ref.afterClosed().subscribe(data => {
      this.refreshData();
    });
  }

  public eliminar(medidaArticulo: MedidaArticulo) {
    if (confirm(`¿Esta seguro que desea eliminar ${medidaArticulo.denominacion}?`)) {
      this.servicio.delete(medidaArticulo.id).subscribe(data => {
        if (data) {
          this.refreshData();
        }
      }, err => alert(`No puedes eliminar ${medidaArticulo.denominacion} porque hay Articulos asignados`))
    }
  }

  public refreshData(): void {
    this.servicio.getAll(0,1000).subscribe(data => {
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
