import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthServiceService } from '../../../services/authentication/auth-service.service';
import { Cliente } from '../../../models/Persona/ICliente';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public forma: FormGroup;
  public errorCorreoEnUso: boolean = false;

  constructor(public authService: AuthServiceService) {
    this.crearForms();
  }

  ngOnInit(): void {
  }

  public crearForms(): void {
    this.forma = new FormGroup({
      'nombre': new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]),
      'apellido': new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]),
      'telefono' : new FormControl('', [Validators.required, Validators.pattern('[0-9]{10,13}')]),
      'email': new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]),
      'rePass': new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10)])
    });
  }

  public async registerWithEmail() {
    const cliente : Cliente = this.forma.value;
    this.authService.registerWithEmail(cliente)
    // .then(data => console.info("ingreso Correctamente"))
    // .catch((err) => {
    //   alert('El correo ya se encuentra registrado en nuetra plataforma');
    // })
    this.forma.reset()
  }

  public registerWithGoogle(): void {
    this.authService.registerWithGoogle();
  }

}
