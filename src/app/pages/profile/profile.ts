import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
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
  imports: [MatIconModule, ReactiveFormsModule],
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
  currentPasswordVisible = false;
  newPasswordVisible = false;
  confirmPasswordVisible = false;

  currentUser = this.authService.getCurrentUser();
  initials = this.getInitials();

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
    this.currentPasswordVisible = false;
    this.newPasswordVisible = false;
    this.confirmPasswordVisible = false;
    this.isPasswordModalOpen = false;
  }

  private getInitials(): string {
    const firstName = this.currentUser?.nombres.trim().charAt(0) ?? '';
    const lastName = this.currentUser?.apellidos.trim().charAt(0) ?? '';
    return `${firstName}${lastName}`.toLocaleUpperCase() || 'U';
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
