import { Component, OnInit, Inject } from '@angular/core';
import { CategoriaArticulo } from '../../../models/ICategoriaArticulo';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoriaArticuloService } from '../../../services/generales/categoria-articulo.service';

@Component({
  selector: 'app-modal-categoria-articulo',
  templateUrl: './modal-categoria-articulo.component.html',
  styleUrls: ['./modal-categoria-articulo.component.css']
})
export class ModalCategoriaArticuloComponent implements OnInit {

  // TITULO DEL CUADRO
  public titulo: string = "NUEVA CATEGORIA ARTICULO"
  // INFORMACION PREDEFINIDA PARA EL FORMULARIO 
  public categoriaArticulos: CategoriaArticulo[] = [];
  // DEFINICION DE LA FORMA
  public forma: FormGroup;
  // OBJETO POR DEFECTO PARA LOS VALORES DE NUEVOS Y EDITAR
  public defaultObject: CategoriaArticulo = {
    denominacion: null,
    descripcion: null,
    id: null,
    categoriaArticulo: [],
  }

  constructor(
    public service: CategoriaArticuloService,
    public dialogRef: MatDialogRef<ModalCategoriaArticuloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    if (data) {
      this.titulo = "EDITAR CATEGORIA ARTICULO"
      this.defaultObject = JSON.parse(JSON.stringify(data['informacion']))
    }
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.llenarCategorias();
  }


  private crearFormulario(): void {
    // Si es edicion se debe desabilitar el modal 
    let esEdicion = this.defaultObject.id != null;
    this.forma = new FormGroup({
      'denominacion': new FormControl(this.defaultObject.denominacion, Validators.required),
      'descripcion': new FormControl(this.defaultObject.descripcion, Validators.required),
      'categoriaArticulo': new FormControl({ value: this.defaultObject.categoriaArticulo, disabled: esEdicion }, Validators.required),
    });
  }

  private llenarCategorias(): void {
    this.service.getAll(0,1000).subscribe(data => {
      this.categoriaArticulos = data;
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

    let objetoAGuardar: CategoriaArticulo = {
      denominacion: this.forma.value.denominacion,
      descripcion: this.forma.value.descripcion,
      id: this.defaultObject.id,
      categoriaArticulo: []
    }
    // VALIDACION PARA SABER SI CATEGORIA PADRE ES IGUAL A 0
    if (this.forma.value.categoriaArticulo == 0) {
      console.log("se creo nuevo y es sin padre", objetoAGuardar)
      this.service.post(objetoAGuardar).subscribe(data => {
        console.info("respuesta del servidor", data);
      })

    } else {
      objetoAGuardar.denominacion = this.forma.value.categoriaArticulo.denominacion;
      objetoAGuardar.descripcion = this.forma.value.categoriaArticulo.descripcion;
      objetoAGuardar.id = this.forma.value.categoriaArticulo.id;
      objetoAGuardar.categoriaArticulo = this.forma.value.categoriaArticulo.categoriaArticulo;      
      objetoAGuardar.categoriaArticulo.push({
        denominacion: this.forma.value.denominacion,
        descripcion: this.forma.value.descripcion,
        id: null,
        categoriaArticulo: [],
        status : true
      })
      this.service.post(objetoAGuardar).subscribe(data => {
        console.log("el sevidor responde", data)
      })
    }
  }

  private actualizar() {
    this.defaultObject.denominacion = this.forma.value.denominacion;
    this.defaultObject.descripcion = this.forma.value.descripcion;
    this.service.put(this.defaultObject.id, this.defaultObject).subscribe(data => {
      console.log("el servidor responde", data)
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
