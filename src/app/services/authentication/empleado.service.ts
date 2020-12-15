import { Injectable } from '@angular/core';
import { CajeroService } from './cajero.service';
import { CocineroService } from './cocinero.service';
import { DeliveryService } from './delivery.service';
import { GerenteService } from './gerente.service';
import { Empleado } from 'src/app/models/Persona/IEmpleado';
import { Cajero } from '../../models/Persona/ICajero';
import { Cocinero } from 'src/app/models/Persona/ICocinero';
import { Delivery } from 'src/app/models/Persona/IDelivery';
import { Gerente } from 'src/app/models/Persona/IGerente';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

 public empleado : Empleado;

  constructor(
    public cajeroService: CajeroService,
    public cocineroService: CocineroService,
    public deliveryService: DeliveryService,
    public gerenteService: GerenteService,
  ) { }

public postRol(empleado:Empleado){
let texto = empleado.rol.denominacion.toString().toLowerCase();

switch (texto) {
  case "cajero":
    const objetoCajero: Cajero = empleado;      
    this.cajeroService.post(objetoCajero).subscribe(data => {
      console.log("EmplService posteo |Cajero| ->", data)
    })
    break;

  case "cocinero":
    const objetoCocinero: Cocinero = empleado;      
    this.cocineroService.post(objetoCocinero).subscribe(data => {
      console.log("EmplService posteo |Cocinero| ->", data)
    })
    break;

    case "delivery":
      const objetoDelivery: Delivery = empleado;      
    this.deliveryService.post(objetoDelivery).subscribe(data => {
      console.log("EmplService posteo |Delivery| ->", data)
    })
      break;

    case "gerente":
      const objetoGerente: Gerente = empleado;      
    this.gerenteService.post(objetoGerente).subscribe(data => {
      console.log("EmplService posteo |Gerente| ->", data)
    })
      break;
  
  default:
    console.log("Ocurrió un error en POST (empleadoService line59)");
    break;
}
}
public putRol(id:number,empleado:Empleado){
  let texto = empleado.rol.denominacion.toString().toLowerCase();
  
  switch (texto) {
    case "cajero":
      const objetoCajero: Cajero = empleado;      
      this.cajeroService.put(id, objetoCajero).subscribe(data => {
        console.log("EmplService put |Cajero| ->", data)
      })
      break;
  
    case "cocinero":
      const objetoCocinero: Cocinero = empleado;      
      this.cocineroService.put(id, objetoCocinero).subscribe(data => {
        console.log("EmplService put |Cocinero| ->", data)
      })
      break;
  
      case "delivery":
        
        console.log("BREAK 1 put |Delivery| ->", empleado)
        const objetoDelivery: Delivery = empleado;          
        console.log("BREAK 2 put |Delivery| ->", empleado)    
      this.deliveryService.put(id, objetoDelivery).subscribe(data => {
        console.log("EmplService put |Delivery| ->", data)
      })
        break;
  
      case "gerente":
        const objetoGerente: Gerente = empleado;      
      this.gerenteService.put(id, objetoGerente).subscribe(data => {
        console.log("EmplService put |Gerente| ->", data)
      })
        break;
    
    default:
      console.log("Ocurrió un error en PUT (empleadoService line96)");
      break;
  }
  }

}
