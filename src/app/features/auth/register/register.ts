import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceTs } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthServiceTs);

  registrationComplete = false;
  errorMessage = '';
  isSubmitting = false;
  passwordVisible = false;
  confirmPasswordVisible = false;


  registerForm = this.formBuilder.group({
    nombres: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    tipoDocumento: ['', [Validators.required]],
    numeroDocumento: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{10,}$/)]],
    tipoVinculacion: ['', Validators.required],
    cargo: ['', Validators.required],
    password: [
  '',
  [
    Validators.required,
    Validators.pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{9,}$/,
    ),
  ],
],
    confirmPassword: ['', Validators.required],
  });

  submit(): void{
    this.registrationComplete = false;
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { confirmPassword, ...requestData } = this.registerForm.getRawValue();

    if (requestData.password !== confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.isSubmitting = true;
    this.authService.register({
      nombres: requestData.nombres ?? '',
      apellidos: requestData.apellidos ?? '',
      tipoDocumento: requestData.tipoDocumento ?? '',
      numeroDocumento: requestData.numeroDocumento ?? '',
      correo: requestData.correo ?? '',
      telefono: requestData.telefono ?? '',
      tipoVinculacion: requestData.tipoVinculacion ?? '',
      cargo: requestData.cargo ?? '',
      password: requestData.password ?? '',
      confirmPassword: confirmPassword ?? '',
    }).subscribe({
      next: () => {
        this.registrationComplete = true;
        this.registerForm.reset();
        this.isSubmitting = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message ?? 'No fue posible crear el usuario.';
        this.isSubmitting = false;
      },
    });
  }
  isInvalid(controlName: string): boolean {
  const control = this.registerForm.get(controlName);

  return Boolean(control?.invalid && control.touched);
}
}
