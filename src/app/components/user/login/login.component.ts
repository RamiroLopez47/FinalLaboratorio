import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthServiceService } from '../../../services/authentication/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public forma: FormGroup;

  constructor(private authService: AuthServiceService) {
    this.crearFormulario();    
  }

  ngOnInit(): void {
  }

  public crearFormulario(): void {
    this.forma = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      'pass': new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]),
    })
  }

  public ingresarPorEmail() {
    this.authService.login(this.forma.value.email, this.forma.value.pass)
  }

  public registerWithGoogle(): void {
    this.authService.registerWithGoogle();
  }
}
