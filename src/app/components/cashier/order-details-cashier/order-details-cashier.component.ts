import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pedido } from '../../../models/Pedido/IPedido';
import { Domicilio } from '../../../models/Domicilio/IDomicilio';

@Component({
  selector: 'app-order-details-cashier',
  templateUrl: './order-details-cashier.component.html',
  styleUrls: ['./order-details-cashier.component.css']
})
export class OrderDetailsCashierComponent implements OnInit {

  public pedido: Pedido;

  constructor(
    public dialogRef: MatDialogRef<OrderDetailsCashierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.pedido = JSON.parse(JSON.stringify(data['pedido']))
  }

  ngOnInit(): void {
  }
  public formatearDomicilio(domicilio: Domicilio): string {
    return `
    ${domicilio.calle ? domicilio.calle : ""} 
    ${domicilio.manzana ? ('Manzana: ' + domicilio.manzana) : ""} - 
    ${domicilio.numero} / 
    ${domicilio.barrio ? ('Barrio: ' + domicilio.barrio) : ""} 
    ${domicilio.localidad.denominacion}`
  }

}
