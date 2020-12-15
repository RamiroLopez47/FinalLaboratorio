import { Component, OnInit } from '@angular/core';
import { Articulo } from 'src/app/models/IArticulo';
import { ArticuloService } from '../../../services/generales/articulo.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Plato } from '../../../models/IPlato';
import { CategoriaPlato } from '../../../models/ICategoriaPlato';
import { CategoriaPlatoService } from '../../../services/generales/categoria-plato.service';
import { MatDialogRef } from '@angular/material/dialog';
import { PlatoService } from '../../../services/generales/plato.service';

@Component({
  selector: 'app-modal-producto-reventa',
  templateUrl: './modal-producto-reventa.component.html',
  styleUrls: ['./modal-producto-reventa.component.css']
})
export class ModalProductoReventaComponent implements OnInit {

  public titulo: string = "Publicar Artículo de Reventa"
  public articulos: Articulo[] = [];
  public categoriaPlatos: CategoriaPlato[] = [];
  public forma: FormGroup;
  public platoListo: Plato = {
    categoriaPlato: {
      categoriaPlato: null,
      denominacion: "",
      descripcion: null,
      id: null
    },
    denominacion: null,
    detallePlato: [{
      articulo: {
        categoriaArticulo: null,
        denominacion: null,
        descripcion: null,
        esInsumo: null,
        id: null,
        imagen: null,
        medidaArticulo: null,
        precioCompra: null,
        stockActual: null,
        stockMax: null,
        stockMin: null,
        precioVenta: null
      },
      cantidad: 1,
    }],
    imagen: null,
    precioVenta: null,
    receta: "No Aplica",
    tiempoPreparacion: 0,
  };
  public articuloSeleccionado: Articulo;


  constructor(private articuloService: ArticuloService,
    private categoriaPlatoService: CategoriaPlatoService,
    public dialogRef : MatDialogRef<ModalProductoReventaComponent>, 
    private platoService : PlatoService) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.preCargarData();
  }

  public preCargarData(): void {
    this.articuloService.getArticuloReventa().subscribe(data => {
      this.articulos = data;
    })
    this.categoriaPlatoService.getAll(0, 1000).subscribe(data => {
      this.categoriaPlatos = data;
    })
  }

  public crearFormulario(): void {
    this.forma = new FormGroup({
      'categoria': new FormControl(this.platoListo.categoriaPlato, Validators.required),
      'articulo': new FormControl(this.platoListo.detallePlato[0].articulo, Validators.required),
      'denominacion': new FormControl(this.platoListo.denominacion, Validators.required),
      'precioVenta': new FormControl(this.platoListo.precioVenta, [Validators.required, Validators.min(0)])
    });
  }

  public seleccionarArticulo(articulo: Articulo): void {
    this.articuloSeleccionado = articulo;
    this.forma.controls.denominacion.setValue(articulo.denominacion);
    this.forma.controls.precioVenta.setValue(articulo.precioVenta);
    this.refrescarPlato();
  }

  public refrescarPlato(): void {
    this.platoListo = {
      categoriaPlato: this.forma.value.categoria,
      denominacion: this.forma.value.denominacion,
      detallePlato: [{
        articulo: this.articuloSeleccionado,
        cantidad: 1,
      }],
      imagen: this.articuloSeleccionado.imagen,
      precioVenta: this.forma.value.precioVenta,
      receta: "No Aplica",
      tiempoPreparacion: 0,
    }
  }

  public agregarReventa(): void {
    this.platoService.post(this.platoListo).subscribe(data => {     
        this.dialogRef.close();   
    })
  }

  public cancelar(): void {
    this.dialogRef.close();
  }


}


