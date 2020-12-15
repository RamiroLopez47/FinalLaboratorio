import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pedido } from '../../../models/Pedido/IPedido';

//TRADUCCION DE LA HORA
import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData} from '@angular/common';
registerLocaleData(localeEsAr, 'es-Ar');

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'es-Ar' }]
})
export class MapComponent implements OnInit {

  // coordenadas = {
  //   lat: null,
  //   lng: null
  // }

  // center : google.maps.LatLngLiteral;
  public pedido: Pedido = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MapComponent>) {
    // this.coordenadas.lat = this.data.lat;
    // this.coordenadas.lng = this.data.lon;
    this.pedido = this.data.pedido
  }

  ngOnInit(): void {

  }

  public cerrar(): void {
    this.dialogRef.close();
  }

}
