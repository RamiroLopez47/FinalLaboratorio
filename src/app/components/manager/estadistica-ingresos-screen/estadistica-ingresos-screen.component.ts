
import { PedidoService } from './../../../services/pedidos/pedido.service';
import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Pedido } from '../../../models/Pedido/IPedido';

@Component({
  selector: 'app-estadistica-ingresos-screen',
  templateUrl: './estadistica-ingresos-screen.component.html',
  styleUrls: ['./estadistica-ingresos-screen.component.css']
})

export class EstadisticaIngresosScreenComponent implements OnInit {
  public forma: FormGroup;  
  public pedidosFiltrados: Pedido[] = [];
  total : number = 0;

  constructor(private pedidoService:PedidoService) {
    this.crearFormulario();
  }

  ngOnInit(): void {
  }

  public crearFormulario() {
  this.forma = new FormGroup({
    fechaInicial: new FormControl('',Validators.required),
    fechaFinal: new FormControl('',Validators.required)});  
}
public mostrarFechas(){
  this.pedidoService.findBetweenDates(this.forma.get('fechaInicial').value,this.forma.get('fechaFinal').value).subscribe(pedidos=>{
    this.pedidosFiltrados = pedidos;
    this.calcularIngresos();  
  })  
 } 

 public calcularIngresos(){
   this.total = 0;
   this.pedidosFiltrados.map((res)=>{
    this.total += res.precioFinal;
   })
 }
}
