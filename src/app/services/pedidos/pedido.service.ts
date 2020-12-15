import { Injectable } from '@angular/core';
import { BaseServiceService } from '../generales/base.service';
import { Pedido, DatosCocina } from '../../models/Pedido/IPedido';
import { HttpClient } from '@angular/common/http';
import { Plato } from '../../models/IPlato';
import { UsuarioService } from '../authentication/usuario.service';
import { Observable } from 'rxjs';
import { DetallePedido } from '../../models/Pedido/IDetallePedido';
import { ESTADO } from '../../models/Pedido/IEstado';

@Injectable({
  providedIn: 'root'
})
export class PedidoService extends BaseServiceService<Pedido>{

  constructor(http: HttpClient,
    private conexion: HttpClient,
    private usuarioService: UsuarioService) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/pedido"
  }
  /**
   * Agrega elementos al carrito de compras
   * @param plato Plato que se desea agregar al carrito
   */
  public agregarAlCarrito(plato: Plato): Promise<boolean> {
    return new Promise((resolve, rejects) => {
      this.usuarioService.getCurrentUserData().subscribe(user => {
        // Buscamos el carrito del sujeto 
        if (user) {
          this.getCarritoByEmail(user.email).subscribe(carrito => {
            carrito = this.validarCarrito(carrito, plato);
            this.put(carrito.id, carrito).subscribe(respuesta => {
              if (respuesta) {
                resolve(true)
              }
            }, err => rejects(false))

          }, err => rejects(false))
        }

      }, err => rejects(false))
    });
  }

  /**
   * Obtiene el carrito del clieente segun su email
   * @param email Email a buscar en la base de datos local
   */
  public getCarritoByEmail(email: string): Observable<Pedido> {
    return this.conexion.get<Pedido>(this.miUrl + `/carrito?email=${email}`);
  }


  /**
   * Este metodo verifica que el plato exista en el carrito, si existe le suma uno a la cantidad
   * sino existe: agrega un nuevo elemento al carrito
   * Retorna el carrito
   * @param carrito Carrito del cliente 
   * @param plato Objeto que se quiere agregar al carrito
   */
  private validarCarrito(carrito: Pedido, plato: Plato): Pedido {

    // validar que exista un elemento en el carrito con el mismo id
    if (carrito.detallesPedido.find(item => item.plato.id == plato.id)) {
      //Si hay coincidencia con los id entonces hay que aumentar la cantidad de ese detalle en uno
      carrito.detallesPedido = carrito.detallesPedido.map(data => {
        // incrementa la cantidad siempre y cuando sea menor a 20
        if (data.plato.id == plato.id && data.cantidad < 20) {
          data.cantidad++;
          data.subTotal = data.cantidad * data.plato.precioVenta
        }
        return data
      })

    } else {
      //Si no hay concidencia hay que agregar ese nuevo detalle 
      let nuevoDetallePedido: DetallePedido = {
        cantidad: 1,
        plato: plato,
        subTotal: plato.precioVenta,
      };
      carrito.detallesPedido.push(nuevoDetallePedido);
    }
    carrito.total = this.calcularTotal(carrito);
    return carrito;
  }

  public calcularTotal(carrito: Pedido): number {
    let total: number = 0;
    carrito.detallesPedido.forEach(element => {
      total += element.subTotal
    });
    return total;
  }

  public async calcularHoraEstimada(carrito: Pedido): Promise<Date> {

    let datosCocina = await this.getDatosCocina();
    return new Promise<Date>((resolve, rejects) => {
      // acumulador de minutos 
      let minutosTotales: number = 0;
      // Sumatoria de tiempos estimado de los articulos solicitados en pedido actual
      carrito.detallesPedido.forEach(element => {
        minutosTotales += element.plato.tiempoPreparacion * element.cantidad;
      })
      //Valida que siemple haya al menos un cocinero activo
      datosCocina.cocinerosActivos == 0 ? datosCocina.cocinerosActivos = 1 : datosCocina.cocinerosActivos;
      // Sumatoria del tiempo estimado de los artículos manufacturados que se encuentran en la cocina / cantidad cocineros
      minutosTotales += datosCocina.tiempoPedidosCocina / datosCocina.cocinerosActivos;
      //10 minutos mas si es con delivery
      carrito.conDelivery ? minutosTotales += 10 : minutosTotales;
      let fecha = new Date();
      fecha.setMinutes(fecha.getMinutes() + minutosTotales);
      resolve(fecha)
    })



  }

  public getByEstado(estado: ESTADO): Observable<Pedido[]> {
    return this.conexion.get<Pedido[]>(this.miUrl + `/estado?estado=${ESTADO[estado]}`);
  }

  public getLatest(): Observable<Pedido> {
    return this.conexion.get<Pedido>(this.miUrl + '/latest');
  }

  public getByEstadoAndEmailDelivery(email: string, estado: ESTADO): Observable<Pedido[]> {
    return this.conexion.get<Pedido[]>(this.miUrl + `/delivery?email=${email}&estado=${ESTADO[estado]}`);
  }

  public getByColumn(posicion: number): Observable<Pedido[]> {
    return this.conexion.get<Pedido[]>(this.miUrl + `/columna/${posicion}`);
  }

  public getDatosCocina(): Promise<DatosCocina> {
    return new Promise<DatosCocina>((resolve, rejects) => {
      this.conexion.get<number[]>(this.miUrl + '/datosCocina').subscribe(respuesta => {
        const datosCocina: DatosCocina = {
          cocinerosActivos: respuesta[0],
          tiempoPedidosCocina: respuesta[1]
        }
        resolve(datosCocina)
      }, err => rejects(err))
    });

  }

  public findBetweenDates(fechaInicio: String, fechaFin: String): Observable<Pedido[]> {
    return this.conexion.get<Pedido[]>(this.miUrl + `/entre?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  /**
   * Obtiene la cantidad de pedidos que realizó un cliente segun su id
   * @param id Id a buscar en la base de datos local
   */
  public getPedidosCliente(id: number): Observable<number> {
    return this.conexion.get<number>(this.miUrl + `/pedidosCount?id=${id}`);
  }

}
