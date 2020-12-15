import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departamento } from '../../models/Domicilio/IDepartamento';
import { Localidad } from '../../models/Domicilio/ILocalidad';

@Injectable({
  providedIn: 'root'
})
export class ApiPublicaService {



  constructor(private http: HttpClient) {
    // Descomentar Esta linea cuando haya que popular la base de datos con las localidades 
    // y departamentos de mendoza ->

    // this.popularBDLocal();
  }

  public getAllDepartamentos(): Observable<Departamento[]> {
    // generar un observable para devolver los datos 
    return new Observable<Departamento[]>(sub => {
      // realizar la consulta 
      this.http.get<Departamento>('https://apis.datos.gob.ar/georef/api/municipios?provincia=50&max=30')
        // inscribirse a la respuesta 
        .subscribe(res => {
          // obtejer el array dentro del objeto respuesta 
          sub.next(res['municipios']
            // mapear cada uno de los resultados para cumplir el formato 
            .map(municipio => {
              return {
                id: municipio.id,
                denominacion: municipio.nombre
              }
            }))
        })
    });
  }

  public getLocalidadByDepartamentoId(id: number): Observable<Localidad[]> {
    // generar un observable para devolver los datos 
    return new Observable<Localidad[]>(sub => {
      // realizar la consulta 
      this.http.get<Localidad>(`https://apis.datos.gob.ar/georef/api/localidades?municipio=${id}&max=30`)
        // inscribirse a la respuesta 
        .subscribe(res => {
          // obtejer el array dentro del objeto respuesta 
          sub.next(res['localidades']
            // mapear cada uno de los resultados para cumplir el formato 
            .map(localidad => {
              return {
                id: localidad.id,
                denominacion: localidad.nombre
              }
            }))
        })
    });
  }

  /**
   * Llena la base de datos con los departamentos y sus distritos
   * Ejecutese una unica vez para llenar la tabla cuando esta este vacía
   */
  public popularBDLocal(): void {
    this.getAllDepartamentos().subscribe(departamentos => {
      setTimeout(() => {


        if (departamentos) {
          departamentos.map(departamento => {
            this.http.post<Departamento>("http://localhost:9001/api/v1/departamento/", departamento).subscribe(nuevoDptoGuardado => {

              // a cada localidad le asignamos el departamento que corresponde 

              this.getLocalidadByDepartamentoId(departamento.id).subscribe(localidades => {

                setTimeout(() => {
                  if (localidades) {
                    localidades.map(localidad => {
                      localidad.departamento = nuevoDptoGuardado;
                      this.http.post<Localidad>("http://localhost:9001/api/v1/localidad/", localidad).subscribe(nuevaLocalidad => {
                        console.log(nuevaLocalidad)
                      })
                    })
                  }
                }, 1000);

              })

            })
          })
        }


      }, 2000);
    })
  }



}
