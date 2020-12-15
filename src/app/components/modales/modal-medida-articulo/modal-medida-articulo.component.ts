import { Component, OnInit, Inject } from '@angular/core';
import { MedidaArticulo } from '../../../models/IMedidaArticulo';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MedidaArticuloService } from '../../../services/generales/medida-articulo.service';

@Component({
  selector: 'app-modal-medida-articulo',
  templateUrl: './modal-medida-articulo.component.html',
  styleUrls: ['./modal-medida-articulo.component.css']
})
export class ModalMedidaArticuloComponent implements OnInit {

  // TITULO DEL CUADRO
  public titulo: string = "NUEVA MEDIDA ARTICULO"
  // INFORMACION PREDEFINIDA PARA EL FORMULARIO 
  public medidaArticulos: MedidaArticulo[] = [];
  // DEFINICION DE LA FORMA
  public forma: FormGroup;
  // OBJETO POR DEFECTO PARA LOS VALORES DE NUEVOS Y EDITAR
  public defaultObject: MedidaArticulo = {
    denominacion: null,
    id: null,
  }

  constructor(
    public service: MedidaArticuloService,
    public dialogRef: MatDialogRef<ModalMedidaArticuloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    if (data) {
      this.titulo = "EDITAR MEDIDA ARTICULO"
      this.defaultObject = JSON.parse(JSON.stringify(data['informacion']))
    }
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.llenarMedidas();
  }


  private crearFormulario(): void {
    this.forma = new FormGroup({
      'denominacion': new FormControl(this.defaultObject.denominacion, Validators.required),
    });
  }

  private llenarMedidas(): void {
    this.service.getAll(0,1000).subscribe(data => {
      this.medidaArticulos = data;
    })
  }

  public guardarCambios() {
    if (this.defaultObject.id) {
      this.actualizar();
    } else {
      this.crearNuevo();
    }
    this.dialogRef.close();
  }

  private crearNuevo() {
    this.service.post(this.forma.value).subscribe(data => {
      console.log("servidor responde", data)
    })
  }

  private actualizar() {
    let objetoAGuardar: MedidaArticulo = {
      id: this.defaultObject.id,
      denominacion: this.forma.value.denominacion,
      status : true
    }
    this.service.put(this.defaultObject.id, objetoAGuardar).subscribe(data => {
      console.log("el servidor responde", data)
    })

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
