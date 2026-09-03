import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthServiceTs } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { SweetAlertService } from '../../../core/services/sweet-alert-service';
import { CompanyService } from '../../../core/services/company.service';
import { cargos } from '../../../utils/cargos';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthServiceTs);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly alert = inject(SweetAlertService);
  private readonly companyService = inject(CompanyService);
  isSubmitting = false;
  passwordVisible = false;
  confirmPasswordVisible = false;
  empresaEncontrada = '';
  authorizationError = '';

  cargos = Object.values(cargos)

  registerForm = this.formBuilder.group({
    nombres: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    tipoDocumento: ['', [Validators.required]],
    numeroDocumento: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{10,}$/), Validators.minLength(10)]],
    tipoVinculacion: ['', Validators.required],
    empresaProveedora: [''],
    empresaProveedoraId: [''],
    cargo: ['', Validators.required],
    password: [
  '',
  [
    Validators.required,
    Validators.pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_!@#$%^&*()]).{9,}$/,
    ),
  ],
],
    confirmPassword: ['', Validators.required],
  },
  {
    validators: passwordMatchValidator,
  },
);

  constructor() {
    const vinculacionControl = this.registerForm.get('tipoVinculacion');
    const empresaControl = this.registerForm.get('empresaProveedora');
    const tipoDocumentoControl = this.registerForm.get('tipoDocumento');
    const numeroDocumentoControl = this.registerForm.get('numeroDocumento');

    vinculacionControl?.valueChanges.subscribe((value) => {

      if (value === 'proveedor') {
        empresaControl?.setValidators([
          Validators.required,
          Validators.pattern(/^\d+$/),
        ]);
      } else {
        empresaControl?.clearValidators();
        empresaControl?.setValue('');
      }

      empresaControl?.updateValueAndValidity();
    })


    tipoDocumentoControl?.valueChanges.subscribe((tipo) => {

      this.authorizationError = '';

      if (tipo === 'PASAPORTE') {

        numeroDocumentoControl?.setValidators([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]+$/),
        ]);

      } else {

        numeroDocumentoControl?.setValidators([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(20),
          Validators.pattern(/^\d+$/),
        ]);

      }

  numeroDocumentoControl?.updateValueAndValidity();
});
  numeroDocumentoControl?.valueChanges.subscribe(() => {
  this.authorizationError = '';
  });
  }

  submit(): void {
  console.log('SUBMIT EJECUTADO');

  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    this.cdr.markForCheck();
    return;
  }

  const { confirmPassword, ...requestData } =
    this.registerForm.getRawValue();

  this.isSubmitting = true;
  this.cdr.markForCheck();

  this.authService.register({
    nombres: requestData.nombres ?? '',
    apellidos: requestData.apellidos ?? '',
    tipoDocumento: requestData.tipoDocumento ?? '',
    numeroDocumento: requestData.numeroDocumento ?? '',
    correo: requestData.correo ?? '',
    telefono: requestData.telefono ?? '',
    tipoVinculacion: requestData.tipoVinculacion ?? '',
    empresaProveedora: requestData.empresaProveedoraId || undefined,
    cargo: requestData.cargo ?? '',
    password: requestData.password ?? '',
    confirmPassword: confirmPassword ?? '',
  }).subscribe({
    next: () => {
      this.isSubmitting = false;
      this.registerForm.reset();

      this.alert.success(
        'Usuario creado correctamente. La cuenta está pendiente de activación.'
      );

      this.cdr.markForCheck();
    },

    error: (error: HttpErrorResponse) => {
      this.isSubmitting = false;

      // Validaciones que vienen del backend
      if (error.error?.code === 'VALIDATION_ERROR') {
        const fieldErrors = error.error.details?.fieldErrors;

        // Limpiar el error anterior de autorización
        this.authorizationError = '';

        if (fieldErrors) {

          const authorizationMessage = 'Los datos de autorización no son válidos. Por favor, verifica la información ingresada.';
          const isAuthorizationError = Object.values(fieldErrors).includes(authorizationMessage);

          if(isAuthorizationError) {
            this.authorizationError = authorizationMessage;
          } else {
            Object.keys(fieldErrors).forEach((field) => {
              const control = this.registerForm.get(field);

              if (control) {
                control.setErrors({
                  ...control.errors,
                  backend: fieldErrors[field]
                });

                control.markAsTouched();
              }
            });
          }
        }

        this.cdr.markForCheck();
        return;
      }

     const mensaje =
    error.error?.message ??
    'No fue posible crear el usuario';

      this.alert.error(mensaje);
      this.cdr.markForCheck();
    }
  });
}
  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return Boolean(control?.invalid && control.touched);
  }

  getErrorMessage(controlName: string): string {
  const control = this.registerForm.get(controlName);

  if (!control || !control.errors || !control.touched) {
    return '';
  }

  if (control.hasError('required')) {
    return 'Este campo es obligatorio.';
  }

  if (control.hasError('minlength')) {
    return `Debe tener mínimo ${control.errors['minlength'].requiredLength} caracteres.`;
  }

  if (control.hasError('maxlength')) {
    return `Debe tener máximo ${control.errors['maxlength'].requiredLength} caracteres.`;
  }

  if (control.hasError('pattern')) {
    return 'El formato ingresado no es válido.';
  }

  if (control.hasError('email')) {
    return 'Ingresa un correo electrónico válido.';
  }

  if (control.hasError('passwordMismatch')) {
    return 'Las contraseñas no coinciden.';
  }

  if (control.hasError('backend')) {
    return control.errors['backend'];
  }

  return 'Revisa bien la información ingresada.';
}

  buscarEmpresa(): void {

  const nit =
    this.registerForm.get('empresaProveedora')?.value;

  if (!nit) return;

  this.companyService.findByNit(nit).subscribe({

    next: (response) => {

      this.empresaEncontrada = response.data.nombre;

      this.registerForm.patchValue({
        empresaProveedoraId: response.data._id
      });

      const control =
        this.registerForm.get('empresaProveedora');

      if (control?.hasError('backend')) {
        const { backend, ...errors } = control.errors!;
        control.setErrors(
          Object.keys(errors).length ? errors : null
        );
      }

    },

    error: () => {

      this.empresaEncontrada = '';

      this.registerForm.patchValue({
        empresaProveedoraId: ''
      });

      this.registerForm.get('empresaProveedora')?.setErrors({
          backend: 'No existe una empresa con ese NIT.'
        });

    }

  });

}
}

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;

  if (!password || !confirm) {
    return null;
  }

  return password === confirm
    ? null
    : { passwordMismatch: true };
};
