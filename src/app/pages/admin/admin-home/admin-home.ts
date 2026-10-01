import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ConflictService } from '../../../core/services/conflict.service';
import { DashboardStats, Conflict } from '../../../utils/interface_enums_types';

@Component({
  selector: 'app-admin-home',
  imports: [],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css',
})
export class AdminHome implements OnInit {

  private readonly conflictsService = inject(ConflictService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  conflicts: Conflict[] = [];

  employeeConflicts: Conflict[] = [];
  administrativeConflicts: Conflict[] = [];
  directorConflicts: Conflict[] = [];
  providerConflicts: Conflict[] = [];

  filteredConflicts: Conflict[] = [];

  isLoadingConflicts = true;
  conflictsErrorMessage = '';

  stats: DashboardStats | null = null;

  isLoading = true;
  errorMessage = '';

  isDetecting = false;
  detectionMessage = '';

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadConflicts();
  }

  loadDashboardStats(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.conflictsService.getDashboardStats().subscribe({
      next: (response) => {
        this.stats = response.data;
        this.isLoading = false;
        this.changeDetector.markForCheck();
      },

      error: (error) => {
        console.error('Error al cargar las estadísticas: ', error);
        this.errorMessage = 'No se pudieron cargar las estadísticas.';
        this.isLoading = false;

      },

      complete: () => this.changeDetector.markForCheck(),

    }).add(() => {

      this.isLoading = false;
      this.changeDetector.markForCheck();

    });
  }

  loadConflicts(): void {
    this.isLoadingConflicts = true;
    this.conflictsErrorMessage = '';

    this.conflictsService.getConflicts().subscribe({
      next: (response) => {

        this.conflicts = response.data;

        this.employeeConflicts = this.conflicts.filter(conflict => conflict.categoria === 'EMPLEADO');
        this.administrativeConflicts = this.conflicts.filter(conflict => conflict.categoria === 'ADMINISTRATIVO');
        this.directorConflicts = this.conflicts.filter(conflict => conflict.categoria === 'DIRECTIVO');
        this.providerConflicts = this.conflicts.filter(conflict => conflict.categoria === 'PROVEEDOR');

        this.filteredConflicts = response.data;
        this.isLoadingConflicts = false;

        this.changeDetector.markForCheck();

      },

      error: (error) => {

        console.error('Error al cargar los conflcitos:', error);
        this.conflictsErrorMessage = 'No se pudieron cargar los conflictos';
        this.isLoadingConflicts = false;
        this.changeDetector.markForCheck();

      },

      complete: () => {
        this.changeDetector.markForCheck();
      }
    });
  }

  detectConflicts():void {
    this.isDetecting = true;
    this.detectionMessage = '';

    this.conflictsService.detectConflicts().subscribe({
      next: (response) => {
        this.detectionMessage = `Detección finalizada. Conflictos nuevos: ${response.total}`;

        this.isDetecting = false;

        this.loadDashboardStats();
        this.loadConflicts();

      },

      error: (error) => {
        console.error('Error al detectar conflictos: ', error);

        this.detectionMessage = 'No se pudieron detectar los conflictos.';

        this.isDetecting = false;
      }, complete: () => this.changeDetector.markForCheck(),
    }).add(() => {
      this.isLoading = false;
      this.changeDetector.markForCheck();
    });
  }


}
