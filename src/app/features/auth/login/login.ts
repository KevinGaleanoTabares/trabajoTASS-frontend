import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceTs } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SweetAlertService } from '../../../core/services/sweet-alert-service'

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  ngOnInit(): void {
    localStorage.clear();
    sessionStorage.clear();
  }
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthServiceTs);
  private readonly sweetAlert = inject(SweetAlertService);

  passwordVisible = false;

  loginForm = this.formBuilder.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_!@#$%^&*()]).{9,}$/,
    ),
    ],
    ],
  });

  submit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login({
      correo: this.loginForm.getRawValue().correo ?? '',
      password: this.loginForm.getRawValue().password ?? '',
    }).subscribe({
      next: () => {
        this.sweetAlert.success('Inicio de sesión exitoso');

        const rol = this.authService.getRole();

        if (rol === 'superAdmin') {
          this.router.navigate(['/super-admin']);
        } else if (rol === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      },

      error: (error: HttpErrorResponse) => {

        const mensaje =
          error.error?.message ??
          'Datos no válidos';

        if (error.error?.code === 'ACCOUNT_NOT_ACTIVE') {
          this.sweetAlert.warning(mensaje);
          return;
        }
        this.sweetAlert.error(mensaje);
      }
    });

  }

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);

    return Boolean(control?.invalid && control.touched);
  }

}
