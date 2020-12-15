import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { Pedido } from '../../../models/Pedido/IPedido';
import { PedidoService } from '../../../services/pedidos/pedido.service';
import { UsuarioService } from '../../../services/authentication/usuario.service';
import { Usuario } from '../../../models/Persona/IUsuario';
import { registerLocaleData, Location } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { Domicilio } from '../../../models/Domicilio/IDomicilio';
import { DomicilioService } from '../../../services/domicilio/domicilio.service';
import { EstadoService } from '../../../services/pedidos/estado.service';
import { ESTADO } from 'src/app/models/Pedido/IEstado';

registerLocaleData(localeEsAr, 'es-Ar');

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'es-Ar' }]
})
export class CartComponent implements OnInit {


  public currentUser: Usuario = {
    domicilios: [],
    nombre: null,
    apellido: null,
    email: null,
    telefono: null
  };
  public carrito: Pedido = {
    numero: null,
    cliente: null,
    detallesPedido: [],
    estado: null,
    conDelivery: false,
    domicilio: null
  };

  public direccionSeleccionada: Domicilio = null;

  constructor(private pedidoService: PedidoService,
    private usuarioService: UsuarioService,
    private domicilioService: DomicilioService,
    private estadoService: EstadoService,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    this.cargarDatos();
  }


  /**
   * Este metodo decrementa la cantidad hasta un minimo de 1 de los detalles
   * del pedido
   * @param indice posicion del array detalles donde se quiere decrementar la cantidad
   */
  public decrementar(indice: number) {

    if (this.carrito.detallesPedido[indice].cantidad > 1) {
      this.carrito.detallesPedido[indice].cantidad--;
      this.calcularNuevosTotales(indice);
      this.pedidoService.put(this.carrito.id, this.carrito).subscribe(
        () => null,
        err => console.error("Error", err));
    } else {
      //TODO: Realizar validación para el boton decrementar
    }

  }
  /**
   * Incrementa hasta un maximo de 20 la cantidad de un detalle del pedido
   * @param indice Indice posicion dentro del array de detalles del pedido que se quiere eliminar
   */
  public incrementar(indice: number) {
    if (this.carrito.detallesPedido[indice].cantidad < 20) {

      this.carrito.detallesPedido[indice].cantidad++;
      this.calcularNuevosTotales(indice);

      this.pedidoService.put(this.carrito.id, this.carrito).subscribe(
        () => null,
        err => console.error("Error", err));
    } else {
      //TODO: Realizar validación para el boton incrementar
    }
  }

  /**
   * Carga todos los datos del carrito de compras y de usuario
   */
  public cargarDatos(): void {
    // obtener el carrito del cliente 
    this.usuarioService.getCurrentUserData().subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.pedidoService.getCarritoByEmail(user.email).subscribe(carrito => {
          this.carrito = carrito;
          this.calcularTotalYFinal();
          this.pedidoService.calcularHoraEstimada(this.carrito)
            .then(fecha => {
              this.carrito.horaEstimadaFin = fecha;
              this.pedidoService.put(this.carrito.id, this.carrito).subscribe(() => null);
            })
        })
      }
    })
  }
  /**
   * Re calcula los nuevos subtotales, totales, y finales cada vez que ocurre un cambio en un item
   * @param indice Posicion del array de detalles que se quiere recalcular
   */
  public calcularNuevosTotales(indice: number): void {
    // clacular el nuevo subtotal
    this.carrito.detallesPedido[indice].subTotal = this.carrito.detallesPedido[indice].cantidad * this.carrito.detallesPedido[indice].plato.precioVenta
    //calcular el nuevo total
    this.calcularTotalYFinal();
    // calcular hora estimada de finalizacion
    this.pedidoService.calcularHoraEstimada(this.carrito)
      .then(fecha => {
        this.carrito.horaEstimadaFin = fecha;
      })

  }
  /**
   * Cambia el tipo de entrega recalculando la nueva hora de entrega y recalcula el nuevo precio 
   * final debido al decremento del 10% para entregas por local
   * @param e evento de cambio tipo boolean
   */
  public cambioTipoEntrega(e: Event): void {
    if (this.carrito.conDelivery) {
      this.carrito.precioFinal = this.carrito.total
    } else {
      this.carrito.precioFinal = this.carrito.total * 0.9;
    }

    this.pedidoService.calcularHoraEstimada(this.carrito)
      .then(fecha => {
        this.carrito.horaEstimadaFin = fecha;
        this.pedidoService.put(this.carrito.id, this.carrito).subscribe(() => null)
      })
  }
  /**
   * postea una nueva direccion para dejar linkeado el pedido para siempre
   * luego llama al metodo de cerrar carrito
   */
  public finalizarPedido(): void {

    //buscar estado de cocina en enum y cambiarlo
    if (this.carrito.conDelivery) {

      // le asignamos esa nueva direccion al pedido 
      this.carrito.domicilio = this.direccionSeleccionada;
      this.cerrarCarritoYObtenerNuevo();

    } else {
      //pedidos con retiro en el local no generan nuevas direcciones
      this.cerrarCarritoYObtenerNuevo();
    }

  }
  /**
   * Cierra el carrito cambiandole el estado a "en espera aprobacion", y lo actualiza
   * 
   */
  public cerrarCarritoYObtenerNuevo(): void {
    //Le almacenamos la nueva fecha
    this.carrito.fecha = new Date();
    // Obtenemos el estado "esperando_aprobacion" desde la base de datos para poder asignarlo al pedido 
    this.estadoService.getByTermino(ESTADO.ESPERA_APROBACION).subscribe(nuevoEstado => {
      if (nuevoEstado) {
        this.carrito.estado = nuevoEstado;
        this.pedidoService.put(this.carrito.id, this.carrito).subscribe(data => {
          alert("Pedido enviado para aprobación");
          this.cargarDatos();
        }, err => alert("Ha ocurrido un error"))
      }
    })
  }
  /**
   * Valida que el boton de finalizar solo se habilite cuando
   * ConDelivery? los detalles del pedido sean mas de 0 y haya una direccion seleccionada
   * SinDelivery? Los detalles del pedido sean mayor a 0
   */
  public validarBoton(): boolean {
    if (this.carrito.conDelivery) {
      return this.carrito.detallesPedido?.length > 0 && this.direccionSeleccionada != null
    } else {
      return this.carrito.detallesPedido?.length > 0;
    }

  }
  /**
   * Elimina un item del carrito y recalcula los costos
   * @param indice posicin que se desea eliminar
   */
  public eliminarItem(indice: number) {
    this.carrito.detallesPedido.splice(indice, 1);
    this.calcularTotalYFinal();

    this.pedidoService.calcularHoraEstimada(this.carrito)
      .then(estimado => {
        this.carrito.horaEstimadaFin = estimado
        this.pedidoService.put(this.carrito.id, this.carrito).subscribe(() => null)
      })
  }

  public goBack() {
    this.location.back();
  }

  /**
   * Recalcula los precios finales y totales 
   * usese cada vez que se realice un cambio en las cantidades o items.
   */
  public calcularTotalYFinal(): void {
    //calcular el nuevo total
    this.carrito.total = this.pedidoService.calcularTotal(this.carrito);
    if (this.carrito.conDelivery) {
      this.carrito.precioFinal = this.carrito.total
    } else {
      this.carrito.precioFinal = this.carrito.total * 0.9;
    }
  }

  public validarHorario(): boolean {
  /*  Este return permite utilizar el carrito sin limitación horaria. */
    // return true
    
    const fechaActual = new Date();
    return (fechaActual.getHours() >= 20 && fechaActual.getHours() <= 23) ||
      (
        (fechaActual.getDay() == 0 || fechaActual.getDay() == 6) &&
        (fechaActual.getHours() >= 11 && fechaActual.getHours() <= 14)
      )
  }

}
