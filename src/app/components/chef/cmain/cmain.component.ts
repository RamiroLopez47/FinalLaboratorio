import { CocineroService } from './../../../services/authentication/cocinero.service';
import { EstadoService } from './../../../services/pedidos/estado.service';
import { Plato } from './../../../models/IPlato';
import { ESTADO } from './../../../models/Pedido/IEstado';
import { Component, OnInit } from '@angular/core';
import { PedidoService } from './../../../services/pedidos/pedido.service';
import { Pedido } from 'src/app/models/Pedido/IPedido';
import { Cocinero } from '../../../models/Persona/ICocinero';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ArticuloService } from '../../../services/generales/articulo.service';

@Component({
  selector: 'app-cmain',
  templateUrl: './cmain.component.html',
  styleUrls: ['./cmain.component.css']
})
export class CmainComponent implements OnInit {

  public timer: number = 1000;
  public pedidosPendientes: Pedido[];
  public pedidosTomados: Pedido[] = [];
  public itemSeleccionado: any = null;
  public sidenavOpened: boolean = false;
  public cocineros: Cocinero[] = [];
  public displayedColumns: string[] = ['nombre', 'apellido', 'estaActivo'];
  public dataSource: MatTableDataSource<Cocinero> = new MatTableDataSource();
  constructor(private pedidoService: PedidoService,
    private cocineroService: CocineroService,
    private estadoService: EstadoService,
    private router: Router,
    private articuloService: ArticuloService) { }

  ngOnInit(): void {
    this.actualizacionAutomatica();

  }

  public actualizacionAutomatica(): void {
    if (this.router.url.includes('chef')) {
      setTimeout(() => {
        this.getPedidosPendientes();
        this.getPedidosTomados();
        //Llamado a la recursividad
        this.actualizacionAutomatica();
        this.timer = 10000;
      }, this.timer);
    }
  }

  public getPedidosPendientes(): void {
    this.pedidoService.getByEstado(ESTADO.COCINA).subscribe(pedidos => {
      this.pedidosPendientes = pedidos;
    })
  }

  public getPedidosTomados(): void {
    this.pedidoService.getByEstado(ESTADO.PREPARANDO).subscribe(pedidos => {
      this.pedidosTomados = pedidos;
    })
  }
  public calcularRetraso(pedido: Pedido): number {
    let fechaInicio: Date = new Date();
    let fechaFin: Date = new Date(pedido.horaEstimadaFin);
    return Math.floor((fechaFin.getTime() - fechaInicio.getTime()) / 60000);
  }

  public tomarPedido(i: number): void {

    this.estadoService.getByTermino(ESTADO.PREPARANDO).subscribe(estado => {
      if (estado) {
        console.log("cambiando estado a -->", estado);
        this.pedidosPendientes[i].estado = estado;
        this.pedidoService.put(this.pedidosPendientes[i].id, this.pedidosPendientes[i]).subscribe(() => {
          this.getPedidosTomados();
          this.getPedidosPendientes();
          console.log("Pedido Tomado")
        });
      }
    })
  }

  public verReceta(plato: Plato): void {
    this.itemSeleccionado = plato;
  }

  public demorarPedido(pedido: Pedido): void {
    let fechaNueva: Date = new Date(pedido.horaEstimadaFin);
    fechaNueva.setMinutes(fechaNueva.getMinutes() + 10);
    pedido.horaEstimadaFin = fechaNueva;
    this.pedidoService.put(pedido.id, pedido).subscribe(data => {
      console.log("el plato fue demorado")
    })
  }

  public entregarPedido(pedido: Pedido, i: number) {

    this.reCalcularStock(i).then(() => {
      if (this.pedidosTomados[i].conDelivery) {
        this.estadoService.getByTermino(ESTADO.ESPERANDO_ASIGNACION).subscribe(estado => {
          if (estado) {
            this.pedidosTomados[i].estado = estado;
          }
          this.pedidoService.put(this.pedidosTomados[i].id, this.pedidosTomados[i]).subscribe(() => {
            this.getPedidosTomados();
            this.getPedidosPendientes();
          });
        });
      } else {
        this.estadoService.getByTermino(ESTADO.ESPERANDO_CLIENTE).subscribe(estado => {
          if (estado) {
            this.pedidosTomados[i].estado = estado;
          }
          this.pedidoService.put(this.pedidosTomados[i].id, this.pedidosTomados[i]).subscribe(() => {
            this.getPedidosTomados();
            this.getPedidosPendientes();
          });
        });
      }
    })
  }

  public reCalcularStock(indice: number): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      let pedido: Pedido = JSON.parse(JSON.stringify(this.pedidosTomados[indice]));
      //RECORRE TODOS LOS PLATOS DEL PEDIDO
      for (let index = 0; index < pedido.detallesPedido.length; index++) {
        // RECORRE TODOS LOS ARTICULOS DE LOS PLATOS 
        for (let j = 0; j < pedido.detallesPedido[index].plato.detallePlato.length; j++) {
          pedido.detallesPedido[index].plato.detallePlato[j].articulo.stockActual -=
            (pedido.detallesPedido[index].plato.detallePlato[j].cantidad * // cantidad que lleva de ese articulo
              pedido.detallesPedido[index].cantidad // cantidad de platos pedidos 
            )
          //put
          this.articuloService.put(pedido.detallesPedido[index].plato.detallePlato[j].articulo.id, pedido.detallesPedido[index].plato.detallePlato[j].articulo)
            .subscribe(() => console.log("actualiza articulo"))
        }
      }
      resolve(true)
    })
  }


  public getCocineros() {
    this.cocineroService.getAll(0, 1000).subscribe(res => {
      console.log("lista cocineros", res);
      this.dataSource.data = res;
      this.sidenavOpened = true;
    });
  }

  public guardarCocineros(cocinero: Cocinero) {

    if (cocinero.estaActivo != true) {
      cocinero.estaActivo = true;
    } else {
      cocinero.estaActivo = false;
    }
    this.cocineroService.put(cocinero.id, cocinero).subscribe(data => {
      console.log("estaActivoActualizado -->", data)
    })

  }
  public cierraSidenav() {
    this.sidenavOpened = false;
  }
}
