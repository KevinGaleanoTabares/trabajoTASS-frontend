import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { cargos } from '../../../utils/cargos';
import { FamilyService } from '../../../core/services/family.service';
import { FamilyRelationship } from '../../../utils/interface_enums_types';
import { SweetAlertService } from '../../../core/services/sweet-alert-service';

@Component({
  selector: 'app-user-home',
  imports: [ReactiveFormsModule],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css',
})

export class UserHome implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly familyService = inject(FamilyService);
  private readonly sweetAlert = inject(SweetAlertService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  familyRelationships: FamilyRelationship[] = [];

  isFamilyModalOpen = false;

  isLoading = true;

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

  ngOnInit(): void {

    this.loadFamilyRelationship();
  }

  private loadFamilyRelationship(): void {
    this.isLoading = true;

    this.familyService.getFamilyRelationships().subscribe({
      next: (response) => {
        this.familyRelationships = response.data;
        console.log('Familiares:', this.familyRelationships);
        this.changeDetector.markForCheck();
      },

      error: (error) => {
        console.error('Error obteniendo familiares:', error);
      },

      complete: () => this.changeDetector.markForCheck(),
    }).add(() => {
      this.isLoading = false;
      this.changeDetector.markForCheck();
    });
  }

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

      this.sweetAlert.error('Por favor completa todos los campos obligatorios.');
      return;
    }

    const data = {
      tipoDocumento: this.familyForm.value.tipoDocumento!,
      numeroDocumento: this.familyForm.value.numeroDocumento!,
      parentesco: this.familyForm.value.tipoVinculo!,
    };

    this.familyService.createFamilyRelationship(data).subscribe({

      next: (response) => {

        this.sweetAlert.success(response.message || 'Familiar registrado correctamente.');

        this.closeFamilyModal();

        this.loadFamilyRelationship();
      },

      error: (error) => {

        console.error('Error registrando familiar:', error);

        const message = error?.error?.message || 'Datos incorrectos por favor verifica.';

        this.sweetAlert.error(message);

      },
    });
  }

    isInvalid(controlName: string): boolean {
    const control = this.familyForm.get(controlName);
    return Boolean(control?.invalid && control.touched);
  }

}
