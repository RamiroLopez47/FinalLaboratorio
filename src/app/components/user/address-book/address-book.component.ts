import { Component, OnInit } from '@angular/core';
import { Departamento } from '../../../models/Domicilio/IDepartamento';
import { Localidad } from '../../../models/Domicilio/ILocalidad';
import { DepartamentoService } from '../../../services/domicilio/departamento.service';
import { LocalidadService } from '../../../services/domicilio/localidad.service';
import { UsuarioService } from '../../../services/authentication/usuario.service';
import { Usuario } from '../../../models/Persona/IUsuario';
import { Domicilio } from '../../../models/Domicilio/IDomicilio';
import { ClienteService } from '../../../services/authentication/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit {
  // ==============================
  // A L T A 
  // ==============================
  public agregandoNuevo: boolean = false;
  public nuevoDomicilio: Domicilio = this.getNullDomicilio();

  // ==============================
  // E D I C I O N 
  // ==============================
  public departamentos: Departamento[] = [];
  public localidades: Localidad[] = [];
  public currentUser: Usuario = {
    nombre: null,
    apellido: null,
    email: null,
    rol: {
      denominacion: null,
      id: null,
    },
    telefono: null,
    domicilios: []
  };
  public domicilioEditando: Domicilio = null;
  public editando: boolean = false;
  public indice: number = null;


  constructor(private departamentoService: DepartamentoService,
    private localidadService: LocalidadService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar) {
    this.llenarDepartamentos();
    this.cargarDatosUsuario();
  }

  ngOnInit(): void {
  }

  // public establecerComoPrincipal(id: number) {
  //   this.direccionPrincipal = id;
  // }

  // public esPrincipal(id: number): boolean {
  //   return id == this.direccionPrincipal;
  // }

  public activarEdicion(direccion: Domicilio, i: number) {
    this.indice = i;
    this.editando = true;
    this.localidadService.getLocalidadByDepartamentoId(direccion.localidad.departamento.id).subscribe(data => {
      if (data) {
        this.localidades = data;
      }
    })
    this.domicilioEditando = JSON.parse(JSON.stringify(direccion));

  }

  public guardar() {

    // TODA LA LOGICA DE ACTUALIZACIÓN    
    this.currentUser.domicilios[this.indice] = this.domicilioEditando;
    this.clienteService.put(this.currentUser.id, this.currentUser).subscribe(data => {
      this.mostrarMensaje("Actualizado correctamente")
    }, err => console.error("Ha ocurrido un error", err));

    //RESETEO 
    this.editando = false;
    this.domicilioEditando = null
  }

  public llenarDepartamentos(): void {
    this.departamentoService.getAll(0, 100).subscribe(data => {
      this.departamentos = data;
    })
  }

  public departamentoSeleccionado(id: number) {
    this.localidadService.getLocalidadByDepartamentoId(id).subscribe(data => {
      this.localidades = data;
    })
    this.domicilioEditando.localidad.id = -1;
  }

  public localidadSeleccionada(id: number): void {
    const localidad = this.localidades.filter(loc => { return loc.id == id })[0];
    this.domicilioEditando.localidad = localidad;
  }

  public cargarDatosUsuario(): void {
    this.usuarioService.getCurrentUserData().subscribe(data => {
      this.currentUser = data;
    })
  }

  public mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, "ok", {
      duration: 1500,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    })
  }

  public eliminar(i: number) {
    if (confirm("¿Desea Eliminar Esta Dirección?")) {
      this.currentUser.domicilios[i].status = false;
      console.log(this.currentUser)
      this.clienteService.put(this.currentUser.id, this.currentUser).subscribe(data => {
        if (data) {
          this.mostrarMensaje("Eliminación Exitosa")
        }
      }, err => {
        console.error(err)
        this.mostrarMensaje("No se ha podito eliminar")
      })
    }
  }

  // ================================================================================
  // M E T O D O S    P A R A    E L    A L T A 
  // ================================================================================

  public onChangeNuevoDepartamento(id: number): void {
    this.localidadService.getLocalidadByDepartamentoId(id).subscribe(data => {
      this.localidades = data;
    })
  }

  public onChangeNuevaLocalidad(id: number): void {
    this.nuevoDomicilio.localidad = this.localidades.filter(loc => { return loc.id == id })[0];
  }

  public agregarNuevoDomicilio(forma: NgForm): void {
    this.usuarioService.getCurrentUserData().subscribe(data => {
      if (data) {
        this.currentUser = data;
        this.nuevoDomicilio.calle = forma.value.Ncalle;
        this.nuevoDomicilio.barrio = forma.value.Nbarrio;
        this.nuevoDomicilio.manzana = forma.value.Nmanzana;
        this.nuevoDomicilio.numero = forma.value.Nnumero;
        this.nuevoDomicilio.piso = forma.value.Npiso;
        this.nuevoDomicilio.puerta = forma.value.Npuerta;
        this.nuevoDomicilio.status = true;
        // Pusheamos el nuevo domicilio al usuario corriente 
        this.currentUser.domicilios.push(JSON.parse(JSON.stringify(this.nuevoDomicilio)));

        // postemos el nuevo usuario 

        this.clienteService.post(this.currentUser).subscribe(data => {
          if (data) {
            // actualizamos informacion 
            this.currentUser.domicilios.splice(this.currentUser.domicilios.length - 1, 1);
            this.currentUser.domicilios.push(data.domicilios[data.domicilios.length - 1]);
            // this.cargarDatosUsuario();
            // cerramos el formulario de agregar nuevo 
            this.agregandoNuevo = false;
            // reseteamos el nuevo domicilio 
            this.nuevoDomicilio = this.getNullDomicilio()
            // notificamos el exito 
            this.mostrarMensaje("Agregado Correctamente")
          }
        }, err => {
          this.mostrarMensaje("Ha ocurrido un error");
          // this.currentUser.domicilios.splice(this.currentUser.domicilios.length - 1, 1);
        })
      }
    })
  }

  private getNullDomicilio(): Domicilio {
    let objeto: Domicilio = {
      barrio: null,
      calle: null,
      localidad: {
        id: null,
        denominacion: null,
        departamento: {
          id: null,
          denominacion: null
        }
      },
      manzana: null,
      numero: null,
      piso: null,
      puerta: null
    }
    return objeto;
  }
}
