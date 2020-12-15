import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/authentication/usuario.service';
import { Observable } from 'rxjs';
import { AuthServiceService } from 'src/app/services/authentication/auth-service.service';

@Component({
  selector: 'app-managerscreen',
  templateUrl: './managerscreen.component.html',
  styleUrls: ['./managerscreen.component.css']
})
export class ManagerscreenComponent implements OnInit {

  public valueSelected = 0;
  public user$: Observable<any> = this.authService.afService.user;
  public currentRol: string = "";
  public timer: number = 0;

  constructor(private authService: AuthServiceService,private service: UsuarioService) { }

  ngOnInit(): void {
    this.authService.afService.user
    this.getCurrentUserRol();
    
  }
  public getCurrentUserRol(): void {
    //Este metodo se ejecuta cada vez que se cambia el estado de logueo, 
    // Por lo que es util para obtener el rol constantemente
    setTimeout(() => {
      if (!this.currentRol && this.user$) {
        this.service.loadCurrentRol().subscribe(data => {
          if (data) {
            this.currentRol = data;
            this.redireccionCajero(data);
          }          
        })
      }
      this.timer = 500;
      this.getCurrentUserRol();
    }, this.timer);

  }

public redireccionCajero(string: string):void{
  if (string==="cajero"){
    this.valueSelected = 4;
  }
}

}
