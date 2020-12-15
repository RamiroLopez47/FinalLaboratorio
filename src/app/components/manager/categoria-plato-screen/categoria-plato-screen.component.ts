import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CategoriaPlato } from '../../../models/ICategoriaPlato';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalCategoriaPlatoComponent } from '../../modales/modal-categoria-plato/modal-categoria-plato.component';
import { CategoriaPlatoService } from '../../../services/generales/categoria-plato.service';

@Component({
  selector: 'app-categoria-plato-screen',
  templateUrl: './categoria-plato-screen.component.html',
  styleUrls: ['./categoria-plato-screen.component.css']
})
export class CategoriaPlatoScreenComponent implements OnInit {

  // NOMBRE DE REFERENCIA A COLUMNAS
  public displayedColumns: string[] = ['denominacion', 'descripcion', 'categoriaPlato'];
  //OBJETO DE DATOS DE LA TABLA
  public dataSource: MatTableDataSource<CategoriaPlato> = new MatTableDataSource();
  //DEFINICION DE ELEMENTOS DE PAGINACION Y SORTING
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public dialog: MatDialog, private servicio: CategoriaPlatoService) {
  }

  ngOnInit(): void {
    this.referenciarTabla();

      //Configuración del filtro
      this.dataSource.filterPredicate =
      (data: CategoriaPlato, filter: string) =>
        data.denominacion.toLowerCase().trim().indexOf(filter.toLowerCase().trim()) != -1 ||
        data.descripcion.toLowerCase().trim().indexOf(filter.toLowerCase().trim()) != -1;;

  }

  public referenciarTabla(): void {
    this.servicio.getAll(0,1000).subscribe(data => {
      this.dataSource.data = data;
    })
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public agregarNuevo() {
    const ref = this.dialog.open(ModalCategoriaPlatoComponent, { panelClass: 'custom-dialog-container' });
    ref.afterClosed().subscribe(data => {
      this.refreshData();
    });
  }

  public editar(categoriaPlato: CategoriaPlato) {
    const ref = this.dialog.open(ModalCategoriaPlatoComponent, { panelClass: 'custom-dialog-container', data: { informacion: categoriaPlato } });
    ref.afterClosed().subscribe(data => {
      this.refreshData();
    });
  }

  public eliminar(categoriaPlato: CategoriaPlato) {
    if (confirm(`¿Desea Eliminar ${categoriaPlato.denominacion}?`)) {
      this.servicio.delete(categoriaPlato.id).subscribe(data => {
        if (data) {
          this.refreshData();
        }
      }, err => {
        alert(`No puedes eliminar ${categoriaPlato.denominacion} porque hay Platos que lo tienen asignado`)
      })
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
