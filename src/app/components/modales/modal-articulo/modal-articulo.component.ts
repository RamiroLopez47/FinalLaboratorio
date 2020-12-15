import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Articulo } from 'src/app/models/IArticulo';
import { CategoriaArticulo } from '../../../models/ICategoriaArticulo';
import { MedidaArticulo } from '../../../models/IMedidaArticulo';
import { CategoriaArticuloService } from '../../../services/generales/categoria-articulo.service';
import { ArticuloService } from '../../../services/generales/articulo.service';
import { MedidaArticuloService } from '../../../services/generales/medida-articulo.service';

@Component({
  selector: 'app-modal-articulo',
  templateUrl: './modal-articulo.component.html',
  styleUrls: ['./modal-articulo.component.css']
})
export class ModalArticuloComponent implements OnInit {
  // DEFINICIOND DE TITULO 
  public titulo: string = "NUEVO ARTICULO"
  //DATOS DEFINIDOS PARA EL FORMULARIO
  public categoriaArticulos: CategoriaArticulo[];
  public unidadesDeMedida: MedidaArticulo[];
  // DEFINICION DE LA FORMA
  public forma: FormGroup;
  // OBJETO POR DEFECTO PARA LOS VALORES DE NUEVOS Y EDITAR
  public defaultObject: Articulo = {
    denominacion: null,
    categoriaArticulo: null,
    descripcion: null,
    esInsumo: null,
    id: null,
    imagen: null,
    medidaArticulo: null,
    precioCompra: null,
    stockActual: null,
    stockMax: null,
    stockMin: null,
    precioVenta: null,
    status : null
  }

  constructor(
    public service: ArticuloService,
    public dialogRef: MatDialogRef<ModalArticuloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public categoriaService: CategoriaArticuloService,
    public unidadDeMedidaService: MedidaArticuloService
  ) {
    if (data) {
      this.titulo = "EDITAR CATEGORIA ARTICULO"
      this.defaultObject = JSON.parse(JSON.stringify(data['informacion']))
    }
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.llenarInformacioPredefinida();
  }

  crearFormulario(): void {
    this.forma = new FormGroup({
      'denominacion': new FormControl(this.defaultObject.denominacion, Validators.required),
      'stockMin': new FormControl(this.defaultObject.stockMin,  [Validators.required, Validators.min(0)]),
      'stockMax': new FormControl(this.defaultObject.stockMax, [Validators.required]),
      'esInsumo': new FormControl(this.defaultObject.esInsumo, Validators.required),
      'precioCompra': new FormControl(this.defaultObject.precioCompra, [Validators.required, Validators.min(0)]),
      'precioVenta': new FormControl(this.defaultObject.precioVenta, [Validators.min(0), Validators.pattern('[0-9]{1,8}')]),
      'descripcion': new FormControl(this.defaultObject.descripcion, Validators.required),
      'stockActual': new FormControl(this.defaultObject.stockActual, [Validators.required, Validators.min(0)]),
      'imagen': new FormControl(this.defaultObject.imagen, Validators.required),
      'categoriaArticulo': new FormControl(this.defaultObject.categoriaArticulo, Validators.required),
      'medidaArticulo': new FormControl(this.defaultObject.medidaArticulo, Validators.required),
    });
  }

  

  private llenarInformacioPredefinida(): void {
    this.categoriaService.getAll(0,1000).subscribe(data => {
      this.categoriaArticulos = data;
    })
    this.unidadDeMedidaService.getAll(0,1000).subscribe(data => {
      this.unidadesDeMedida = data;
    })
  }

  public guardarCambios() {
    this.forma.setValidators(StockValidator);
    this.forma.updateValueAndValidity();
    if(this.forma.valid){
      if (this.defaultObject.id) {
        this.actualizar();
      } else {
        this.crearNuevo();
      }
      this.dialogRef.close();
    }else{
      alert("Cantidad Maxima tiene que ser mas alto que cantidad minima ")
    }
  }

  public crearNuevo(): void {
    this.service.post(this.forma.value).subscribe(
      data => console.log("El servidor responde", data),
      err => console.log("ocurrio un error", err)
    )
  }

  public actualizar(): void {
    let objetoAGuardar = this.forma.value as Articulo;
    objetoAGuardar.status = true;
    this.service.put(this.defaultObject.id, objetoAGuardar).subscribe(
      data => console.log("El servidor responde", data),
      err => console.log("ocurrio un error", err)
    )
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

function StockValidator(control: FormGroup): { 
  [key: string]: any } | null {
  
  if(control.get("stockMin").value>control.get("stockMax").value){
    return { 'StockValidator': true}
  }else{
    return null;
  }
}