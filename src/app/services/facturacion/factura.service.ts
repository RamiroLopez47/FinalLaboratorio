import { Injectable } from '@angular/core';
import { BaseServiceService } from '../generales/base.service';
import { Factura } from '../../models/Pedido/IFactura';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaService extends BaseServiceService<Factura>{

  constructor(http: HttpClient, private conexion: HttpClient) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/factura";
  }

  public enviarFactura(idFactura: number, email: string): Observable<boolean> {
    const asunto = "Factura El Buen Sabor"
    const mensaje = "Muchas gracias por elegir nuestros productos. \n En el siguiente link encontraras tu factura"
    return this.conexion.post<boolean>(`http://localhost:9001/api/v1/factura/enviar?destinatario=${email}&asunto=${asunto}&mensaje=${mensaje}&idFactura=${idFactura}&nombreArchivo=no`, null)
  }

  public descargarFactura(factura: Factura): Observable<Blob> {
    return this.conexion.get(` http://localhost:9001/api/v1/pdf/test/?idFactura=${factura.id}`, { responseType: 'blob' });
  }

}
