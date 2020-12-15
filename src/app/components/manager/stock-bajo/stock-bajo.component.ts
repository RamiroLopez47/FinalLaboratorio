import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { ArticuloService } from '../../../services/generales/articulo.service';
import { Articulo } from '../../../models/IArticulo';

@Component({
  selector: 'app-stock-bajo',
  templateUrl: './stock-bajo.component.html',
  styleUrls: ['./stock-bajo.component.css']
})
export class StockBajoComponent implements OnInit {

  //VARIABLES FILTRO
  public control = new FormControl('');  

  // NOMBRE DE REFERENCIA A COLUMNAS
  public displayedColumns: string[] = ['denominacion', 'stockMin', 'stockActual', 'stockMax'];
  //OBJETO DE DATOS DE LA TABLA
  public dataSource: MatTableDataSource<Articulo> = new MatTableDataSource();
  //DEFINICION DE ELEMENTOS DE PAGINACION Y SORTING
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private servicio: ArticuloService) { }

  ngOnInit(): void {
    this.referenciarTabla();
    //Configuración del filtro
    this.dataSource.filterPredicate = 
      (data: Articulo, filter: string) =>
        data.denominacion.toLowerCase().trim().indexOf(filter.toLowerCase().trim()) != -1;
  }

  public referenciarTabla(): void {
    this.servicio.stockBajo().subscribe(data => {
      this.dataSource.data = data;      
    })
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  } 

  public filtrar(valorFiltro: string) {
    valorFiltro = valorFiltro.trim(); // Remueve espacios en blanco
    valorFiltro = valorFiltro.toLowerCase(); // Convierte a minusculas
    this.dataSource.filter = valorFiltro;
    console.log("buscando...")
  }

}
