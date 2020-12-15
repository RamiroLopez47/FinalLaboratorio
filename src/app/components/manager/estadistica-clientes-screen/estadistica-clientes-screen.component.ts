import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Pedido } from '../../../models/Pedido/IPedido';
import { ClienteService } from '../../../services/authentication/cliente.service';
import { Cliente } from 'src/app/models/Persona/ICliente';

@Component({
  selector: 'app-estadistica-clientes-screen',
  templateUrl: './estadistica-clientes-screen.component.html',
  styleUrls: ['./estadistica-clientes-screen.component.css']
})
export class EstadisticaClientesScreenComponent implements OnInit {
  // NOMBRE DE REFERENCIA A COLUMNAS
  public displayedColumns: string[] = ['nombre', 'pedidos.length'];
  //OBJETO DE DATOS DE LA TABLA
  public dataSource: MatTableDataSource<Cliente> = new MatTableDataSource();
  //DEFINICION DE ELEMENTOS DE SORTING
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  forma: FormGroup;
  verTop: boolean = false;
       
  public pedidosFiltrados: Pedido[] = [];
  public pedidosCliente: number;

  constructor(private clienteService:ClienteService) {
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

  public mostrarFechas(){
    this.clienteService.getCantidadPedidosAgrupados(this.forma.get('fechaInicial').value,this.forma.get('fechaFinal').value).subscribe(data=>{
      this.dataSource.data = data;
       ;})   
  }

}
