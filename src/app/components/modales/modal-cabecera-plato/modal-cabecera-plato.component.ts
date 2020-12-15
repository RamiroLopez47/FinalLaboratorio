import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Plato } from '../../../models/IPlato';
import { CategoriaPlato } from '../../../models/ICategoriaPlato';
import { Articulo } from '../../../models/IArticulo';
import { DetallePlato } from '../../../models/IDetallePlato';
import { PlatoService } from '../../../services/generales/plato.service';
import { CategoriaPlatoService } from '../../../services/generales/categoria-plato.service';
import { ArticuloService } from '../../../services/generales/articulo.service';


@Component({
  selector: 'app-modal-cabecera-plato',
  templateUrl: './modal-cabecera-plato.component.html',
  styleUrls: ['./modal-cabecera-plato.component.css']
})
export class ModalCabeceraPlatoComponent implements OnInit {

  // TITULO DEL CUADRO
  public titulo: string = "NUEVO PLATO"
  // INFORMACION PREDEFINIDA PARA EL FORMULARIO 
  public categoriPlatos: CategoriaPlato[];
  public articulos: Articulo[];
  // DEFINICION DE LA FORMA
  public forma: FormGroup;
  public forma2: FormGroup;
  // OBJETO POR DEFECTO PARA LOS VALORES DE NUEVOS Y EDITAR
  public defaultObject: Plato = {
    id: null,
    denominacion: null,
    categoriaPlato: null,
    detallePlato: [],
    imagen: null,
    precioVenta: null,
    tiempoPreparacion: null,
    receta: null,
  }



  constructor(
    public service: PlatoService,
    public dialogRef: MatDialogRef<ModalCabeceraPlatoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoriaPlatoService: CategoriaPlatoService,
    private articuloService: ArticuloService,
    public dialog: MatDialog
  ) {

    if (data) {
      this.titulo = "EDITAR PLATO"
      this.defaultObject = JSON.parse(JSON.stringify(data['informacion']))
    }
    this.crearFormulario();
  }

  ngOnInit() {
    this.llenarInformacioPredefinida();
  }

  public llenarInformacioPredefinida(): void {
    this.categoriaPlatoService.getAll(0, 1000).subscribe(data => {
      this.categoriPlatos = data;
    })
    this.articuloService.getArticuloInsumos().subscribe(data => {
      this.articulos = data;
    })
  }


  public crearFormulario() {
    this.forma = new FormGroup({
      'categoriaPlato': new FormControl(this.defaultObject.categoriaPlato, Validators.required),
      'denominacion': new FormControl(this.defaultObject.denominacion, Validators.required),
      'precioVenta': new FormControl(this.defaultObject.precioVenta, [Validators.required, Validators.min(0)]),
      'tiempoPreparacion': new FormControl(this.defaultObject.tiempoPreparacion, [Validators.required, Validators.min(0)]),
      'imagen': new FormControl(this.defaultObject.imagen, Validators.required),
      'receta': new FormControl(this.defaultObject.receta, Validators.required)
    });

    this.forma2 = new FormGroup({
      'articulo': new FormControl('', Validators.required),
      'cantidad': new FormControl('', [Validators.required, Validators.min(0)]),
    });

  }

  public guardarCambios() {
    if (this.defaultObject.id) {
      this.actualizar();
    } else {
      this.crearNuevo();
    }
    this.dialogRef.close();
  }

  public crearNuevo(): void {
    const objetoAGuardar: Plato = this.forma.value;
    objetoAGuardar.detallePlato = this.defaultObject.detallePlato;
    this.service.post(objetoAGuardar).subscribe(data => {
      console.log("el servidor responde", data)
    })
  }

  public actualizar(): void {
    const objetoAGuardar: Plato = this.forma.value;
    objetoAGuardar.detallePlato = this.defaultObject.detallePlato;
    objetoAGuardar.status = true;
    this.service.put(this.defaultObject.id, objetoAGuardar).subscribe(data => {
      console.log("el servidor responde", data)
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  agregarDetallePlato() {
    let detalleNuevo: DetallePlato = this.forma2.value;
    console.log(detalleNuevo.articulo.id)

    if (this.defaultObject.detallePlato.find(detalle => detalle.articulo.id == detalleNuevo.articulo.id)) {
      this.defaultObject.detallePlato = JSON.parse(JSON.stringify(this.defaultObject.detallePlato.map(data => {        
        if (data.articulo.id == detalleNuevo.articulo.id) {
          
          data.cantidad += this.forma2.value.cantidad;   
        }
        return data;
      })))
    } else {
      this.defaultObject.detallePlato.push(detalleNuevo);
    }

    this.forma2.reset();

  }

  eliminarDetallePlato(indice: number) {
    this.defaultObject.detallePlato.splice(indice, 1);
  }
}
