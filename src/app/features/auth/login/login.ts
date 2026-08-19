import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);

  passwordVisible = false;

  loginForm = this.formBuilder.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  registerForm = this.formBuilder.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{9,}$/,
    ),
    ],
    ],
    confirmPassword: ['', Validators.required],
  });

  submit(): void {
    if (this.loginForm.invalid) {
      alert('Formulario inválido. Por favor, corrige los errores antes de enviar.');
      this.loginForm.markAllAsTouched();
      return;
    }
    if (this.loginForm.valid) {
      alert('Formulario enviado con éxito. Ver consola para ver los datos.')
      console.log(this.loginForm.getRawValue());
    }
  }

   isInvalid(controlName: string): boolean {
  const control = this.registerForm.get(controlName);

  return Boolean(control?.invalid && control.touched);
}

}
