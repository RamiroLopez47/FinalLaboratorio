import { Component, OnInit, Inject } from '@angular/core';
import { CategoriaPlato } from 'src/app/models/ICategoriaPlato';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoriaPlatoService } from '../../../services/generales/categoria-plato.service';

@Component({
  selector: 'app-modal-categoria-plato',
  templateUrl: './modal-categoria-plato.component.html',
  styleUrls: ['./modal-categoria-plato.component.css']
})
export class ModalCategoriaPlatoComponent implements OnInit {

  // TITULO DEL CUADRO
  public titulo: string = "NUEVA CATEGORIA PLATO"
  // INFORMACION PREDEFINIDA PARA EL FORMULARIO 
  public categoriaPlatos: CategoriaPlato[] = [];
  // DEFINICION DE LA FORMA
  public forma: FormGroup;
  // OBJETO POR DEFECTO PARA LOS VALORES DE NUEVOS Y EDITAR
  public defaultObject: CategoriaPlato = {
    denominacion: null,
    descripcion: null,
    id: null,
    categoriaPlato: [],
  }

  constructor(
    public service: CategoriaPlatoService,
    public dialogRef: MatDialogRef<ModalCategoriaPlatoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    if (data) {
      this.titulo = "EDITAR CATEGORIA PLATO"
      this.defaultObject = JSON.parse(JSON.stringify(data['informacion']))
    }
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.llenarCategorias();
  }


  private crearFormulario(): void {
    const esEdicion : boolean = this.defaultObject.id != null;
    this.forma = new FormGroup({
      'denominacion': new FormControl(this.defaultObject.denominacion, Validators.required),
      'descripcion': new FormControl(this.defaultObject.descripcion, Validators.required),
      'categoriaPlato': new FormControl({value : this.defaultObject.categoriaPlato, disabled : esEdicion}, Validators.required),
    });
  }

  private llenarCategorias(): void {
    this.service.getAll(0,1000).subscribe(data => {
      this.categoriaPlatos = data;
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

    let objetoAGuardar: CategoriaPlato = {
      denominacion: this.forma.value.denominacion,
      descripcion: this.forma.value.descripcion,
      id: this.defaultObject.id,
      categoriaPlato: []
    }
    // VALIDACION PARA SABER SI CATEGORIA PADRE ES IGUAL A 0
    if (this.forma.value.categoriaPlato == 0) {
      this.service.post(objetoAGuardar).subscribe(data => {
        console.info("respuesta del servidor", data);
      })

    } else {
      objetoAGuardar.denominacion = this.forma.value.categoriaPlato.denominacion;
      objetoAGuardar.descripcion = this.forma.value.categoriaPlato.descripcion;
      objetoAGuardar.id = this.forma.value.categoriaPlato.id;
      objetoAGuardar.categoriaPlato = this.forma.value.categoriaPlato.categoriaPlato;
      objetoAGuardar.categoriaPlato.push({
        denominacion: this.forma.value.denominacion,
        descripcion: this.forma.value.descripcion,
        id: null,
        categoriaPlato: [],
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
