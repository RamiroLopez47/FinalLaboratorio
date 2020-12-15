import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../../services/pedidos/pedido.service';
import { EstadoService } from '../../../services/pedidos/estado.service';
import { Pedido } from 'src/app/models/Pedido/IPedido';
import { ESTADO } from 'src/app/models/Pedido/IEstado';
import { MatDialog } from '@angular/material/dialog';
import { PaymentScreenComponent } from '../payment-screen/payment-screen.component';
import { Router } from '@angular/router';
import { OrderDetailsCashierComponent } from '../order-details-cashier/order-details-cashier.component';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {

  // ESTOS OBJETOS DEBEN IRSE
  public objetos = [];
  public cuarta = [];

  //VARIABLES 
  public timer: number = 0;
  public esperandoAprobacion: Pedido[] = [];
  public esperandoRetiro: Pedido[] = [];
  public enCocina: Pedido[] = [];
  public enReparto: Pedido[] = [];

  constructor(private pedidoService: PedidoService,
    private estadoService: EstadoService,
    private dialog: MatDialog,
    private router: Router) {

  }

  ngOnInit(): void {
    this.actualizarAutomaticamente();
  }

  /**
   * Actualiza todas las columnas cada timer especificado
   */
  private actualizarAutomaticamente(): void {
    if (this.router.url.includes('cashier')) {
      setTimeout(() => {

        this.getEsperandoAprobacion();
        this.getEsperandoRetiro();
        this.getEnCocina();
        this.getEnReparto();

        // recursividad 
        this.actualizarAutomaticamente();
        this.timer = 20000;
      }, this.timer);
    } else {
      console.log("Actualización automatica Desactivada")
    }
  }

  //===================================================================
  // LISTADO DE GETS 
  //===================================================================
  public getEsperandoAprobacion(): void {
    this.pedidoService.getByEstado(ESTADO.ESPERA_APROBACION).subscribe(pedidos => {
      this.esperandoAprobacion = pedidos;
    })
  }

  public getEsperandoRetiro(): void {
    this.pedidoService.getByColumn(2).subscribe(pedidos => {
      this.esperandoRetiro = pedidos;
    })
  }

  public getEnCocina(): void {
    this.pedidoService.getByColumn(3).subscribe(pedidos => {
      this.enCocina = pedidos;
    })
  }

  public getEnReparto(): void {
    this.pedidoService.getByColumn(4).subscribe(pedidos => {
      this.enReparto = pedidos;
    })
  }
  //=====================================================================
  // METODOS COMUNES   
  //=====================================================================
  public verDetalles(pedido : Pedido) : void{
    const ref = this.dialog.open(OrderDetailsCashierComponent, { panelClass: 'custom-dialog-container', data: { pedido: pedido } })
  }


  //=====================================================================
  // METODOS DE LA PRIMER COLUMNA (ESPERANDO APROBACION)
  //=====================================================================

  /**
   * cambia el estado de un pedido a esperando_Asignacion
   * @param i indice de esperandoAprobacion
   */
  public aprobarPedido(i: number): void {
    this.estadoService.getByTermino(ESTADO.COCINA).subscribe(estado => {
      if (estado) {
        this.esperandoAprobacion[i].estado = estado;
        this.pedidoService.put(this.esperandoAprobacion[i].id, this.esperandoAprobacion[i]).subscribe(() => {
          this.getEsperandoAprobacion();
          this.getEnCocina();
        });
      }
    })
  }

  /**
   * Rechaza un pedido cambiandole su estado a rechazado 
   * @param i indice de esperandoAprobacion
   */
  public rechazarPedido(i: number): void {
    this.estadoService.getByTermino(ESTADO.RECHAZADO).subscribe(estado => {
      if (estado) {
        this.esperandoAprobacion[i].estado = estado;
        this.pedidoService.put(this.esperandoAprobacion[i].id, this.esperandoAprobacion[i]).subscribe(() => {
          this.getEsperandoAprobacion();
        });
      }
    })
  }

  //=====================================================================
  // METODOS DE LA SEGUNDA COLUMNA (ESPERA RETIRO)
  //=====================================================================

  /**
   * Cambia el estado del pedido a cobrado dando por finalizado el proceso
   * cuando un cliente retira su pedido por el local
   * @param i posicion del array esperandoRetiro que se quiere cambiar
   */
  public retiroCliente(i: number) {
    const ref = this.dialog.open(PaymentScreenComponent, { panelClass: 'custom-dialog-container', data: { pedido: this.esperandoRetiro[i] } })
    ref.afterClosed().subscribe(data => {
      data?.pagado ? this.getEsperandoRetiro() : null;
    })
  }

  public canceloCliente(i : number) : void{
    this.estadoService.getByTermino(ESTADO.NO_RETIRADO).subscribe(estado => {
      this.esperandoRetiro[i].estado = estado;
      this.pedidoService.put(this.esperandoRetiro[i].id, this.esperandoRetiro[i]).subscribe(
        () => {
          this.getEsperandoRetiro();
        }
      )
    })
  }

  public retiroDelivery(i: number) {
    this.estadoService.getByTermino(ESTADO.EN_CAMINO).subscribe(estado => {
      this.esperandoRetiro[i].estado = estado;
      this.pedidoService.put(this.esperandoRetiro[i].id, this.esperandoRetiro[i]).subscribe(
        () => {
          this.getEsperandoRetiro();
          this.getEnReparto();
        }
      )
    })
  }

  public cancelarRetiro(i: number) {
    this.estadoService.getByTermino(ESTADO.ESPERANDO_ASIGNACION).subscribe(estado => {
      this.esperandoRetiro[i].estado = estado;
      this.esperandoRetiro[i].delivery = null;
      this.pedidoService.put(this.esperandoRetiro[i].id, this.esperandoRetiro[i]).subscribe(
        () => {
          this.getEsperandoRetiro();
        }
      )
    })
  }


  //=====================================================================
  // METODOS DE LA TERCER COLUMNA (EN COCINA)
  //=====================================================================

  public calcularDiferenciaEnMinutos(pedido: Pedido): number {
    let fechaInicio: Date = new Date(pedido.fecha);
    let fechaFin: Date = new Date(pedido.horaEstimadaFin);
    return Math.floor((fechaFin.getTime() - fechaInicio.getTime()) / 60000);
  }

  public calcularRetraso(pedido: Pedido): number {
    let fechaInicio: Date = new Date();
    let fechaFin: Date = new Date(pedido.horaEstimadaFin);
    return Math.floor((fechaFin.getTime() - fechaInicio.getTime()) / 60000);
  }

  //=====================================================================
  // METODOS DE LA CUARTA COLUMNA (EN REPARTO)
  //=====================================================================

  public recibirDineroDelivery(i: number): void {
    const ref = this.dialog.open(PaymentScreenComponent, { panelClass: 'custom-dialog-container', data: { pedido: this.enReparto[i] } })
    ref.afterClosed().subscribe(data => {
      data?.pagado ? this.getEnReparto() : null;
    })
  }


}
