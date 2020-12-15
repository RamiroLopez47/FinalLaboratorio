import { Domicilio } from "../../../models/Domicilio/IDomicilio";
import { EmpleadoService } from "./../../../services/authentication/empleado.service";
import { LocalidadService } from "./../../../services/domicilio/localidad.service";
import { DepartamentoService } from "./../../../services/domicilio/departamento.service";
import { UserManagementComponent } from "./../../manager/user-management/user-management.component";
import { Component, OnInit, Inject } from "@angular/core";
import { Usuario } from "../../../models/Persona/IUsuario";
import { Rol } from "../../../models/Persona/IRol";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { Empleado } from "../../../models/Persona/IEmpleado";
import { Departamento } from "../../../models/Domicilio/IDepartamento";
import { Localidad } from "../../../models/Domicilio/ILocalidad";
import { RolService } from "../../../services/authentication/rol.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
})
export class UsersComponent implements OnInit {
  public mostrarPass: boolean = false;
  public tipo: string = "password";
  public user: Usuario;
  public id: number;
  // INFORMACION PREDEFINIDA PARA EL FORMULARIO
  public listaDepartamentos: Departamento[];
  public listaLocalidades: Localidad[];
  public roles: Rol[];
  // DEFINICION DE LA FORMA
  public forma: FormGroup;
  public forma2: FormGroup;
  // OBJETO POR DEFECTO PARA LOS VALORES DE NUEVOS Y EDITAR
  public defaultObject: Empleado = {
    id: null,
    nombre: null,
    apellido: null,
    email: null,
    password: null,
    telefono: null,
    rol: null,
    domicilios: [],
    dni: null,
    fechaIngresoEmpleado: null,
    estaActivo: null,
  };

  constructor(
    public service: EmpleadoService,
    public dialogRef: MatDialogRef<UserManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private departamentoService: DepartamentoService,
    private localidadService: LocalidadService,
    private rolService: RolService,
    public dialog: MatDialog
  ) {    
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.llenarInformacioPredefinida();    
  }

  public llenarInformacioPredefinida(): void {
    this.departamentoService.getAll(0, 1000).subscribe((data) => {
      this.listaDepartamentos = data;
    });
    this.localidadService.getAll(0, 1000).subscribe((data) => {
      this.listaLocalidades = data;
    });
    this.rolService.getAll(0, 1000).subscribe((data) => {
      this.roles = data;
    });
  }

  public alterVerPass() {
    this.mostrarPass = !this.mostrarPass;
    this.mostrarPass ? (this.tipo = "text") : (this.tipo = "password");
  }

  public crearFormulario() {
    this.forma = new FormGroup({      
      nombre: new FormControl(this.defaultObject.nombre, Validators.required),
      apellido: new FormControl(this.defaultObject.apellido, Validators.required),
      email: new FormControl(this.defaultObject.email, [Validators.required, Validators.email]),
      password: new FormControl(this.defaultObject.password,[Validators.required,Validators.minLength(6), Validators.maxLength(10)]),
      telefono: new FormControl(this.defaultObject.telefono,[Validators.required, Validators.pattern('[0-9]{10,15}')]),
      rol: new FormControl(this.defaultObject.rol, Validators.required),
      dni: new FormControl(this.defaultObject.dni, [Validators.required, Validators.pattern('[0-9]{1,8}')]),
      fechaIngresoEmpleado: new FormControl(this.defaultObject.fechaIngresoEmpleado,Validators.required),
      estaActivo: new FormControl(this.defaultObject.estaActivo,Validators.required),
    });
    this.forma2 = new FormGroup({
      barrio: new FormControl('', Validators.required),
      calle: new FormControl('', Validators.required),
      numero: new FormControl('', [Validators.required,Validators.min(0)]),
      manzana: new FormControl('', Validators.required),
      piso: new FormControl('', [Validators.required,Validators.min(0)]),
      puerta: new FormControl('', Validators.required),
      localidad: new FormControl('', Validators.required),
    });
  }
 

  public crearNuevo(): void {
    const objetoAGuardar: Empleado = this.forma.value;
    objetoAGuardar.domicilios = this.defaultObject.domicilios;
    this.service.postRol(objetoAGuardar);
    this.onNoClick();
  } 

  agregarDireccion() {
    let domicilio: Domicilio = this.forma2.value;
    this.defaultObject.domicilios.push(domicilio);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
