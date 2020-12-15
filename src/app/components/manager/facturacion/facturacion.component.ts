import { Component, OnInit, ViewChild } from '@angular/core';
import { FacturaService } from '../../../services/facturacion/factura.service';
import { Factura } from 'src/app/models/Pedido/IFactura';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {

  public displayedColumns: string[] = ['cliente','fecha','numero','total','descargar'];
  public dataSource: MatTableDataSource<Factura> = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private facturaService:FacturaService) { } 

  ngOnInit(): void {
    this.facturaService.getAll(0,1000).subscribe(data => {
      this.dataSource.data = data; 
    }); //Esto debe ocurrir antes
    this.dataSource.sort = this.sort; // que esto
    this.dataSource.paginator = this.paginator; // esto luego.f

    //Configuración del filtro
    this.dataSource.filterPredicate =
      (data: Factura, filter: string) =>
      
        data.numero.toString().toLowerCase().trim().indexOf(filter.toLowerCase().trim()) != -1 ||
        data.pedido.cliente.nombre.toLowerCase().trim().indexOf(filter.toLowerCase().trim()) != -1 ||
        data.pedido.cliente.apellido.toLowerCase().trim().indexOf(filter.toLowerCase().trim()) != -1 ||
        data.total.toString().toLowerCase().trim().indexOf(filter.toLowerCase().trim()) != -1;;
      }
  
      public filtrar(valorFiltro: string) {
        valorFiltro = valorFiltro.trim(); // Remueve espacios en blanco
        valorFiltro = valorFiltro.toLowerCase(); // Convierte a minusculas
        this.dataSource.filter = valorFiltro;
        console.log("buscando...");
      }


      public verFactura(factura:Factura){        
        let url: string = "http://localhost:9001/api/v1/pdf/test/?idFactura="+factura.id;
          window.open(url, "_blank");   
      }
}
