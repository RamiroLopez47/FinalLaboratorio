import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pedido } from '../../../models/Pedido/IPedido';
import { FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { Tarjeta } from 'src/app/models/Pedido/ITarjeta';
import { TarjetaService } from '../../../services/cobros/tarjeta.service';
import { EfectivoService } from '../../../services/cobros/efectivo.service';
import { PedidoService } from '../../../services/pedidos/pedido.service';
import { EstadoService } from '../../../services/pedidos/estado.service';
import { ESTADO } from 'src/app/models/Pedido/IEstado';
import { Efectivo } from 'src/app/models/Pedido/IEfectivo';
import { FacturaService } from '../../../services/facturacion/factura.service';
import { Factura } from '../../../models/Pedido/IFactura';

@Component({
  selector: 'app-payment-screen',
  templateUrl: './payment-screen.component.html',
  styleUrls: ['./payment-screen.component.css']
})
export class PaymentScreenComponent implements OnInit {

  // Pedido en Cuestion 
  public pedido: Pedido;
  // FORMULARIOS 
  public formaCredito: FormGroup;
  public formaDebito: FormGroup;
  public formaEfectivo: FormGroup;

  constructor
    (
      public dialogRef: MatDialogRef<PaymentScreenComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private tarjetaService: TarjetaService,
      private efectivoService: EfectivoService,
      private PedidoService: PedidoService,
      private estadoService: EstadoService,
      private facturaService: FacturaService
    ) {
    this.pedido = JSON.parse(JSON.stringify(data['pedido']))
  }

  ngOnInit(): void {
    this.generarFormularioCredito();
    this.generarFormularioDebito();
    this.generarFormularioEfectivo();
  }

  public generarFormularioCredito(): void {
    this.formaCredito = new FormGroup({
      'numeroDeTarjeta': new FormControl('', [Validators.required,Validators.min(1000000000000000),Validators.max(9999999999999999)]),
      'cvv': new FormControl('', [Validators.required,Validators.min(100),Validators.max(9999)]),
      'dni': new FormControl('', [Validators.required,Validators.min(1000000),Validators.max(99999999)]),
      'cuotas': new FormControl('1', [Validators.required, Validators.min(1)])
    })
  }

  public generarFormularioDebito(): void {
    this.formaDebito = new FormGroup({
      'numeroDeTarjeta': new FormControl('', [Validators.min(1000000000000000),Validators.max(9999999999999999)] ),
      'cvv': new FormControl('', [Validators.required, Validators.min(100),Validators.max(9999)]),
      'dni': new FormControl('', [Validators.required, Validators.min(1000000),Validators.max(99999999)]),
      'cuotas': new FormControl('1', [Validators.required, Validators.min(1)]),
      'pin': new FormControl('', [Validators.required, Validators.min(1000),Validators.max(9999)])
    })
  }

  public generarFormularioEfectivo(): void {
    this.formaEfectivo = new FormGroup({
      'suPago': new FormControl(this.preCargarMonto(), [Validators.required, Validators.min(0)])
    })
  }

  public preCargarMonto(): number {
    return this.pedido.conDelivery ? this.pedido.precioFinal : null;
  }

  /**
   * Cambia el estado del pedido a "Cobrado", 
   * Postea un nuevo pago y lo linkea con el pedido
   */
  public aceptarCredito(): void {
    let objetoAGuardar: Tarjeta = {
      cantidadPagado: this.pedido.precioFinal,
      numeroDeTarjeta: this.formaCredito.value.numeroDeTarjeta,
      numeroDocumento: this.formaCredito.value.dni,
      tipoDeTarjeta: "CREDITO",
      pin : 0,
      cvv: this.formaCredito.value.cvv,
      cantidadCuotas: parseFloat(this.formaCredito.value.cuotas)
    }
    this.guardarPedido(objetoAGuardar);

  }

  public aceptarDebito(): void {
    let objetoAGuardar: Tarjeta = {
      cantidadPagado: this.pedido.precioFinal,
      numeroDeTarjeta: this.formaDebito.value.numeroDeTarjeta,
      numeroDocumento: this.formaDebito.value.dni,
      tipoDeTarjeta: "DEBITO",
      cvv: this.formaDebito.value.cvv,
      pin: parseFloat(this.formaDebito.value.pin)
    }
    this.guardarPedido(objetoAGuardar);
  }

  public aceptarEfectivo(): void {
    let objetoAGuardar: Efectivo = {
      cantidadPagado: this.formaEfectivo.value.suPago
    }
    let factura: Factura = {
      numero: this.pedido.id,
      descuento: 0,
      fecha: new Date,
      total: this.pedido.precioFinal,
    }
    this.efectivoService.post(objetoAGuardar).subscribe(pago => {
      this.estadoService.getByTermino(ESTADO.COBRADO).subscribe(estado => {
        this.facturaService.post(factura).subscribe(factura => {
          this.pedido.estado = estado;
          this.pedido.formaPago = pago;
          this.pedido.factura = factura;
          this.enviarFactura(factura)
          this.PedidoService.put(this.pedido.id, this.pedido).subscribe(data => {
            if (data) {
              this.dialogRef.close({ pagado: true });
            }
          })
        })
      })
    })
  }

  public cancelar(): void {
    this.dialogRef.close({ pagado: false })
  }

  private guardarPedido(pago: Tarjeta): void {
    let factura: Factura = {
      numero: this.pedido.id,
      descuento: 0,
      fecha: new Date,
      total: this.pedido.precioFinal,
    }
    this.tarjetaService.post(pago).subscribe(pago => {
      this.estadoService.getByTermino(ESTADO.COBRADO).subscribe(estado => {
        this.facturaService.post(factura).subscribe(factura => {
          //seteos de datos
          this.pedido.formaPago = pago;
          this.pedido.estado = estado;
          this.pedido.factura = factura;
          this.enviarFactura(factura);
          //Actualizar pedido para que quede linkeado
          this.PedidoService.put(this.pedido.id, this.pedido).subscribe(data => {
            data ? this.dialogRef.close({ pagado: true }) : null;
          })
        })
      })
    })
  }

  public enviarFactura(factura: Factura): void {
    this.facturaService.enviarFactura(factura.id, this.pedido.cliente.email).subscribe();
  }  
}

