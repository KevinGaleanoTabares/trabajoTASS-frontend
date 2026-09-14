import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { cargos } from '../../../utils/cargos';

@Component({
  selector: 'app-user-home',
  imports: [ReactiveFormsModule],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css',
})

export class UserHome {

  private readonly fb = inject(FormBuilder);

  isFamilyModalOpen = false;

  cargos = Object.values(cargos)

  familyForm = this.fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    tipoDocumento: ['', Validators.required],
    numeroDocumento: ['', Validators.required],
    tipoVinculo: ['', Validators.required],
    tipoRelacion: ['', Validators.required],
    cargo: ['', Validators.required],
    telefono: ['', Validators.required],
    estado: ['ACTIVO', Validators.required],
    nombreEmpresa: [''],
    nitEmpresa: [''],
  });

  openFamilyModal(): void {
    this.isFamilyModalOpen = true;
  }

  closeFamilyModal(): void {
    this.isFamilyModalOpen = false;
    this.familyForm.reset({
      tipoDocumento: '',
      tipoVinculo: '',
      tipoRelacion: '',
      cargo: '',

    });
  }

  registrarFamiliar(): void {

    if (this.familyForm.invalid) {
      this.familyForm.markAllAsTouched();
      return;
    }

    console.log('Familiar:', this.familyForm.value);
  }

    isInvalid(controlName: string): boolean {
    const control = this.familyForm.get(controlName);
    return Boolean(control?.invalid && control.touched);
  }

}
