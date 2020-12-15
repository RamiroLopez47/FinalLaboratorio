import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CategoriaArticulo } from '../../../models/ICategoriaArticulo';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalCategoriaArticuloComponent } from '../../modales/modal-categoria-articulo/modal-categoria-articulo.component';
import { CategoriaArticuloService } from '../../../services/generales/categoria-articulo.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-categoria-articulo-screen',
  templateUrl: './categoria-articulo-screen.component.html',
  styleUrls: ['./categoria-articulo-screen.component.css']
})
export class CategoriaArticuloScreenComponent implements OnInit {

  //VARIABLES FILTRO
  public control = new FormControl('');
  private subscription: Subscription;
  public content: {
    id: number;
    denominacion: string;
    descripcion: string;
    categoriaArticulo: CategoriaArticulo[]
  }[]


  // NOMBRE DE REFERENCIA A COLUMNAS
  public displayedColumns: string[] = ['denominacion', 'descripcion', 'categoriaArticulo'];
  //OBJETO DE DATOS DE LA TABLA
  public dataSource: MatTableDataSource<CategoriaArticulo> = new MatTableDataSource();
  //DEFINICION DE ELEMENTOS DE PAGINACION Y SORTING
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public dialog: MatDialog, private servicio: CategoriaArticuloService) {
  }

  ngOnInit(): void {
    this.referenciarTabla();

    //Configuración del filtro
    this.dataSource.filterPredicate =
      (data: CategoriaArticulo, filter: string) =>
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
    let ref = this.dialog.open(ModalCategoriaArticuloComponent, { panelClass: 'custom-dialog-container' });
    ref.afterClosed().subscribe(data => {
      this.refreshData();
    });
  }

  public editar(categoriaArticulo: CategoriaArticulo) {
    let ref = this.dialog.open(ModalCategoriaArticuloComponent, { panelClass: 'custom-dialog-container', data: { informacion: categoriaArticulo } });
    ref.afterClosed().subscribe(data => {
      this.refreshData();
    });
  }

  public eliminar(categoriaArticulo: CategoriaArticulo) {
    if (confirm(`¿Estas seguro que deseas eliminar ${categoriaArticulo.denominacion}?`)) {
      this.servicio.delete(categoriaArticulo.id).subscribe(
        data => {
          if (data) {
            this.refreshData();
          }
        },
        err => {
          alert(`No puedes eliminar ${categoriaArticulo.denominacion} porque hay articulos que lo tienen asignado`)
        }
      )
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
