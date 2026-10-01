import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthServiceTs } from '../../core/services/auth.service';
import { SweetAlertService } from '../../core/services/sweet-alert.service';
import { Router } from '@angular/router';

const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {

  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!newPassword || !confirmPassword) {
    return null
  }

  return newPassword === confirmPassword ? null : { passwordMismatch: true };

};


@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthServiceTs);
  private readonly sweetAlert = inject(SweetAlertService);
  private readonly router = inject(Router);

  isPasswordModalOpen = false;
  isSubmitting = false;

  currentUser = this.authService.getCurrentUser();

  passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: ['', Validators.required],

      newPassword: ['', [
        Validators.required,
        Validators.minLength(9),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_]).{9,}$/
        ),
      ],
      ],

      confirmPassword: ['',
        Validators.required,
      ],
    },
    {
      validators: passwordMatchValidator
    }
  );

  openPasswordModal(): void {
    this.passwordForm.reset();
    this.isSubmitting = false;
    this.isPasswordModalOpen = true;
  }

  closePasswordModal(): void {
    this.passwordForm.reset();
    this.isSubmitting = false;
    this.isPasswordModalOpen = false;
  }

  changePassword(): void {

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const {
      currentPassword,
      newPassword,
    } = this.passwordForm.getRawValue();

    this.isSubmitting = true;

    this.authService.changePassword({
      currentPassword,
      newPassword,
    }).subscribe({

      next: (response) => {

        this.isSubmitting = false;
        this.closePasswordModal();
        this.sweetAlert.success(response.message).then(() => {

          this.authService.logout();

          this.router.navigate(['/login'])
        });

      },

      error: (error) => {

        this.isSubmitting = false;
        this.sweetAlert.error(error?.error?.message ?? 'No se pudo cambiar la contraseña.');

      }
    });
  }
}
