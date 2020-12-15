import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/authentication/usuario.service';
import { Usuario } from '../../../models/Persona/IUsuario';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClienteService } from '../../../services/authentication/cliente.service';
import { Cliente } from '../../../models/Persona/ICliente';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-data',
  templateUrl: './profile-data.component.html',
  styleUrls: ['./profile-data.component.css']
})
export class ProfileDataComponent implements OnInit {

  public soloLectura: boolean = true;
  public currentRol: string = ''
  public usuario: Usuario = {
    id: null,
    nombre: null,
    apellido: null,
    email: null,
    rol: {
      id: null,
      denominacion: null,
    },
    telefono: null,
    domicilios: []
  };
  public imagen: string = null;
  public forma: FormGroup;
  constructor(private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar) {

    usuarioService.loadCurrentRol().subscribe(data => {
      this.currentRol = data;
    })
    this.cargarDatos();
    this.crearFormulario();

  }

  ngOnInit(): void {
  }

  public crearFormulario(): void {
    this.forma = new FormGroup({
      'nombre': new FormControl('', Validators.required),
      'apellido': new FormControl('', Validators.required),
      'telefono': new FormControl('', [Validators.required, Validators.pattern('[0-9]{10,13}')]),
      'email': new FormControl('', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])
    });
  }

  public activarEdicion() {
    this.soloLectura = false;
  }

  public async desactivarEdicion() {

    const objetoAGuardar: Cliente = {
      id: this.usuario.id,
      nombre: this.forma.value.nombre,
      apellido: this.forma.value.apellido,
      telefono: parseInt(this.forma.value.telefono),
      email: this.forma.value.email,
      rol: {
        id: this.usuario.rol.id,
        denominacion: this.usuario.rol.denominacion
      },
      domicilios: this.usuario.domicilios
    }

    await this.usuarioService.getCurrentUserData().subscribe(user => {
      if (user) {
        objetoAGuardar.domicilios = user.domicilios;
        this.clienteService.put(objetoAGuardar.id, objetoAGuardar).subscribe(
          data => {
            if (data) {
              this.cargarDatos();
              this.soloLectura = true;
              this.showMessage("Datos actualizados correctamente")
            }
          }, err => { this.showMessage("Ha ocurrido un error") }
        )
      }
    })


  }

  public cargarDatos(): void {
    this.usuarioService.getCurrentUserData().subscribe(data => {
      if (data) {
        this.usuario = data;
        this.forma.setValue({
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          email: data.email
        })
        this.imagen = data.imagen;
      }
    })
  }

  public showMessage(mensaje: string): void {
    this.snackBar.open(mensaje, "ok", {
      duration: 1500,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    })
  }
}
