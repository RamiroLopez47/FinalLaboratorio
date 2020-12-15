import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pedido } from '../../../models/Pedido/IPedido';
import { Domicilio } from '../../../models/Domicilio/IDomicilio';
import { FacturaService } from '../../../services/facturacion/factura.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  public pedido: Pedido;
  public emailCliente: string;
  public enviandoFactura: boolean = false;

  constructor(public dialogRef: MatDialogRef<OrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private facturaService: FacturaService) {
    this.pedido = JSON.parse(JSON.stringify(data['pedido']))
    this.emailCliente = JSON.parse(JSON.stringify(data['email']))
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

  public validarTipoTarjeta(pedido: Pedido): string {
    if (pedido.formaPago.hasOwnProperty('tipoDeTarjeta')) {
      return pedido.formaPago.tipoDeTarjeta;
    } else {
      return "No Aplica"
    }
  }

  public salir(): void {
    this.dialogRef.close();
  }

  public enviarFactura(): void {
    this.enviandoFactura = true;
    this.facturaService.enviarFactura(this.pedido.factura.id, this.emailCliente).subscribe(data => {
      data ? alert("Factura Enviada Exitosamente") : alert("Fallo Al Enviar Factura")
    }, err => {
      console.info("Ha ocurrio un error")
    }, () => this.enviandoFactura = false);
  }

  public descargarFactura(): void {
    this.facturaService.descargarFactura(this.pedido.factura).subscribe(blob => {
      let newBlob = new Blob([blob], { type: "application/pdf" })
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      const data = window.URL.createObjectURL(newBlob);
      let link = document.createElement('a');
      link.href = data;
      link.download = "Factura El Buen Sabor.pdf"
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    })
  }
}
