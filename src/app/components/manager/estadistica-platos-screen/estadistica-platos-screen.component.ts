import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PlatoService } from 'src/app/services/generales/plato.service';
import { Plato } from '../../../models/IPlato';

@Component({
  selector: 'app-estadistica-platos-screen',
  templateUrl: './estadistica-platos-screen.component.html',
  styleUrls: ['./estadistica-platos-screen.component.css']
})
export class EstadisticaPlatosScreenComponent implements OnInit {
 // NOMBRE DE REFERENCIA A COLUMNAS
 public displayedColumns: string[] = ['denominacion', 'total'];
 //OBJETO DE DATOS DE LA TABLA
 public dataSource: MatTableDataSource<Plato> = new MatTableDataSource();
 //DEFINICION DE ELEMENTOS DE SORTING
 @ViewChild(MatSort, {static: true}) sort: MatSort;
 forma: FormGroup;
 verTop: boolean = false;
  


 constructor(private platoService:PlatoService) {
   this.crearFormulario();
   
 }
 ngOnInit(): void {
  this.dataSource.sort = this.sort;
 }

 mostrarTop() {
   if (this.verTop == false) {
     this.verTop = true;
   } else {
     this.verTop = false;
   }
 }

 public crearFormulario() {
   this.forma = new FormGroup({
     fechaInicial: new FormControl('',Validators.required),
     fechaFinal: new FormControl('',Validators.required)});  
 }

 public mostrarFechas(): void {
   
  this.platoService.findBetweenDates(this.forma.get('fechaInicial').value,this.forma.get('fechaFinal').value).subscribe(data => {
    this.dataSource.data = data; 
    this.dataSource.sort = this.sort;    
  })
  
} 
}
