import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plato } from '../../../models/IPlato';
import { CategoriaPlato } from '../../../models/ICategoriaPlato';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../../../services/authentication/auth-service.service';
import { PlatoService } from '../../../services/generales/plato.service';
import { CategoriaPlatoService } from '../../../services/generales/categoria-plato.service';
import { PedidoService } from '../../../services/pedidos/pedido.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  // CATEGORIA SELECCIONADA 
  public selected = 0;
  // para validar la existencia de un usuario logueado 
  public user$: Observable<any> = this.authService.afService.user;
  // Valores mostrados por pantalla
  public categorias: CategoriaPlato[] = [];
  public platos: Plato[] = [];
  //termino de busqueda
  public termino: string = '';
  //muestra o no el sidenav
  public sidenavOpened: boolean = false;

  // ===========================================
  // P A G I N A C I O N 
  // ===========================================
  public page: number = 0;
  public size: number = 10;
  public categoriTermino: string = null;

  constructor(private activeRoute: ActivatedRoute,
    private platoService: PlatoService,
    private categoriaPlatoService: CategoriaPlatoService,
    private authService: AuthServiceService,
    private pedidoService: PedidoService,
    private snackBar: MatSnackBar) {

    let termino = this.activeRoute.snapshot.params['termino'];
    if (termino) {
      this.cargarPlatosPor(termino)
    } else {
      this.cargarPlatos();
    }
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  public cargarPlatosPor(termino: string) {
    this.platoService.getAll(this.page, 1000).subscribe(data => {
      this.platos = data.filter(elemento => {
        if (elemento.denominacion.toLowerCase().includes(termino.toLowerCase()) ||
          elemento.categoriaPlato.denominacion.toLowerCase().includes(termino.toLowerCase())) {
          return true;
        }
        return false;
      });
    })
    this.page = 0;
  }

  public cargarDatos(): void {
    this.categoriaPlatoService.getAll(this.page, this.size).subscribe(data => {
      this.categorias = data;
    })
  }

  public cargarPlatos() {
    this.platoService.getAll(this.page, this.size).subscribe(data => {
      this.platos = data;
    })
  }

  public cambioSeleccion(event) {
    // volver a la pagina 0
    this.page = 0;

    if (event.value != 0) {
      //buscamos el termino a buscar, no usamos id para salvar parcialmente la recursividad
      let categoria = this.categorias.filter(data => { return data.id == event.value });

      // si se encontro un elemento 
      if (categoria.length > 0) {
        this.categoriTermino = categoria[0].denominacion;
        // se realiza la consulta 
        this.getByCategoria();
      }
    } else {
      this.categoriTermino = null;
      // si fue 0 se eligio ver todo 
      this.getAll();
    }
  }

  public siguientePagina(): void {
    this.page++;
    if (this.categoriTermino) {
      this.getByCategoria();
    } else {
      this.getAll()
    }
  }

  public anteriorPagina(): void {
    this.page--;
    if (this.categoriTermino) {
      this.getByCategoria();
    } else {
      this.getAll()
    }
  }

  public getAll() {
    this.platoService.getAll(this.page, this.size).subscribe(data => {
      this.platos = data;
    })
  }

  public getByCategoria() {
    this.platoService.getPlatosByCategoria(this.categoriTermino, this.page, this.size).subscribe(data => {
      this.platos = data;
    });
  }

  public estaDisponible(plato: Plato): boolean {
    for (let i = 0; i < plato.detallePlato.length; i++) {
      if (plato.detallePlato[i].articulo.stockActual < plato.detallePlato[i].articulo.stockMin) {
        return false;
      }
    }
    return true
  }

  // ===========================================================00
  // METODOS DEL CARRITO 
  // ===========================================================00

  public agregarAlCarrito(plato: Plato): void {
    this.pedidoService.agregarAlCarrito(plato)
      .then(() => this.mostrarMensaje(`${plato.denominacion} agregado al carrito`))
      .catch(() => this.mostrarMensaje("Ha ocurrido un error"))
  }

  public mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, "ok", {
      duration: 1500,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    })
  }

}
