import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MapComponent } from '../map/map.component';
import { Pedido } from '../../../models/Pedido/IPedido';
import { PedidoService } from '../../../services/pedidos/pedido.service';
import { ESTADO } from 'src/app/models/Pedido/IEstado';
import { UsuarioService } from '../../../services/authentication/usuario.service';
import { DeliveryService } from '../../../services/authentication/delivery.service';
import { Delivery } from '../../../models/Persona/IDelivery';
import { EstadoService } from '../../../services/pedidos/estado.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dmain',
  templateUrl: './dmain.component.html',
  styleUrls: ['./dmain.component.css']
})
export class DmainComponent implements OnInit {


  // public enEspera: any = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }]
  public listadoMostrado: number = null;

  //Nuevos delivery
  public currentUser: Delivery = null;
  // public disponible: boolean = false;
  public timer: number = 1000;
  public tabSeleccionado = 0;
  public pedidosEsparandoAsignacion: Pedido[] = [];
  public pedidosEsparandoRepartidor: Pedido[] = [];
  public pedidosEnCamino: Pedido[] = [];
  public pedidosEntregados: Pedido[] = [];


  constructor(public dialog: MatDialog,
    private pedidoService: PedidoService,
    private UsuarioService: UsuarioService,
    private deliveryService: DeliveryService,
    private estadoService: EstadoService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.cargarUsuario();

  }

  public actualizacionAutomatica(): void {
    if (this.router.url.includes('delivery')) {
      setTimeout(() => {
        if (this.currentUser?.estaActivo) {
          console.log("actualizar")
          this.cargarPedidosEsperandoAsignacion();
          this.cargarPedidosEsperandoRepartidor();
          this.cargarPedidosEnCamino();
          this.cargarPedidosEntregados();
          //Llamado a la recursividad
          this.actualizacionAutomatica();
          this.timer = 10000;
        }
      }, this.timer);
    }
  }

  public cargarUsuario(): void {
    this.UsuarioService.getCurrentUserData().subscribe(user => {
      if (user) {
        this.currentUser = user as Delivery;
        this.actualizacionAutomatica();
      }
    })
  }

  //===========================================================
  //LISTA DE GETS 
  //===========================================================
  public cargarPedidosEsperandoRepartidor(): void {
    this.UsuarioService.getCurrentUserData().subscribe(user => {
      this.pedidoService.getByEstadoAndEmailDelivery(user.email, ESTADO.ESPERANDO_REPARTIDOR).subscribe(pedidos => {
        if (pedidos) {
          this.pedidosEsparandoRepartidor = pedidos
        }
      })
    })
  }

  public cargarPedidosEnCamino(): void {
    this.UsuarioService.getCurrentUserData().subscribe(user => {
      this.pedidoService.getByEstadoAndEmailDelivery(user.email, ESTADO.EN_CAMINO).subscribe(pedidos => {
        if (pedidos) {
          this.pedidosEnCamino = pedidos;
        }
      });
    })
  }

  public cargarPedidosEsperandoAsignacion(): void {
    this.pedidoService.getByEstado(ESTADO.ESPERANDO_ASIGNACION).subscribe(data => {
      this.pedidosEsparandoAsignacion = data;
    })
  }

  public cargarPedidosEntregados(): void {
    this.pedidoService.getByEstado(ESTADO.ENTREGADO).subscribe(data => {
      this.pedidosEntregados = data;
    })
  }


  /**
   * Cambia el estado del delivery a disponible 
   * @param e evento 
   */
  public onCambioDeEstado(e) {
    if (e.checked) {
      this.actualizacionAutomatica();
      this.currentUser.estaActivo = true;
    } else {
      this.currentUser.estaActivo = false;
      this.tabSeleccionado = 0;
    }
    this.deliveryService.put(this.currentUser.id, this.currentUser).subscribe(null)
  }
  /**
   * Cambia el tab a la sección de todos los pedidos en espera de asignación
   */
  public verTodos() {
    this.tabSeleccionado = 1;
  }

  /**
   * Muestra los detalles de un pedido seleccionado, desplegandolo sobre MapComponent
   * @param pedido pedido del que se desea conocer los detalles
   */
  public openDialog(pedido: Pedido) {
    this.dialog.open(MapComponent, { data: { pedido: pedido }, panelClass: 'custom-dialog-container' });
  }

  /**
   * Despliega la tabla del pedido para ver sus detalles
   * @param id id del pedido del que se desea conocer la composicion
   */
  public verListado(id: number) {
    this.listadoMostrado = id;
  }

  /**
   * Cambia el estado de un pedido a Esperando_repartidor y le asigna el currentUser 
   * como delivery
   * @param i indice del array pedidosEsperandoAsigacion 
   */
  public tomar(i: number) {
    this.estadoService.getByTermino(ESTADO.ESPERANDO_REPARTIDOR).subscribe(estado => {
      this.pedidosEsparandoAsignacion[i].estado = estado;
      this.pedidosEsparandoAsignacion[i].delivery = this.currentUser;
      this.pedidoService.put(this.pedidosEsparandoAsignacion[i].id, this.pedidosEsparandoAsignacion[i]).subscribe(respuesta => {
        if (respuesta) {
          this.cargarPedidosEsperandoAsignacion();
          this.cargarPedidosEsperandoRepartidor();
        }
      })
    })
  }

  /**
   * Cambia el estado de un pedido a ESPERANDO_ASIGNACION y le setea el delivery a null para que
   * vuelva a la lista de espera
   * @param i indice del array pedidosEsperandoAsignacion
   */
  public rechazar(i: number) {
    this.estadoService.getByTermino(ESTADO.ESPERANDO_ASIGNACION).subscribe(estado => {
      this.pedidosEsparandoRepartidor[i].estado = estado;
      this.pedidosEsparandoRepartidor[i].delivery = null;
      this.pedidoService.put(this.pedidosEsparandoRepartidor[i].id, this.pedidosEsparandoRepartidor[i]).subscribe(respuesta => {
        if (respuesta) {
          this.cargarPedidosEsperandoAsignacion();
          this.cargarPedidosEsperandoRepartidor();
        }
      })
    })
  }

  public entregarPedido(i: number) {
    this.estadoService.getByTermino(ESTADO.ENTREGADO).subscribe(estado => {
      if (estado) {
        this.pedidosEnCamino[i].estado = estado
        this.pedidoService.put(this.pedidosEnCamino[i].id, this.pedidosEnCamino[i]).subscribe(respuesta => {
          if (respuesta) {
            this.cargarPedidosEnCamino();
            this.cargarPedidosEntregados();
          }
        })
      }
    })
  }

  // public asignarPedidoObligatorio() {
  //   this.pedidoService.getLatest().subscribe(pedidoObligatorio => {
  //     if (pedidoObligatorio) {
  //       pedidoObligatorio.delivery = this.currentUser;
  //       this.estadoService.getByTermino(ESTADO.ESPERANDO_REPARTIDOR).subscribe(estado => {
  //         pedidoObligatorio.estado = estado;
  //         this.actualizarPedido(pedidoObligatorio);
  //       })
  //     }
  //   })
  // }

  // public actualizarPedido(pedido: Pedido): void {
  //   this.pedidoService.put(pedido.id, pedido).subscribe(() => {
  //     this.asignandoPedidoAutomatico = false;
  //   })
  // }
}
