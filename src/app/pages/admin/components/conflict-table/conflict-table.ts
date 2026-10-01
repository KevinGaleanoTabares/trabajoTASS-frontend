import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConflictService } from '../../../../core/services/conflict.service';
import { Conflict, Categoria } from '../../../../utils/interface_enums_types';
import { SweetAlertService } from '../../../../core/services/sweet-alert.service';

@Component({
  selector: 'app-conflict-table',
  imports: [DatePipe, FormsModule],
  templateUrl: './conflict-table.html',
  styleUrl: './conflict-table.css',
})
export class ConflictTable implements OnInit {

  private readonly conflictService = inject(ConflictService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly sweetAlert = inject(SweetAlertService);

  selectedConflict: Conflict | null = null;
  showDetailModal = false;
  isResolving = false;

  isDetailModalOpen = false;

  @Input() categoria!: Categoria;

  conflicts: Conflict[] = [];
  filteredConflicts: Conflict[] = [];

  searchTerm = '';
  selectedLevel = '';
  selectedStatus = '';

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadConflicts();
  }

  loadConflicts(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.conflictService.getConflicts().subscribe({

      next: (response) => {

        this.conflicts = response.data.filter(
          conflict => conflict.categoria === this.categoria
        );

        this.filteredConflicts = this.conflicts;
        this.isLoading = false;
        this.changeDetector.markForCheck();

      },

      error: (error) => {

        console.error('Error al cargar los conflictos:', error);

        this.errorMessage = 'No se pudieron cargar los conflictos.';
        this.isLoading = false;
      },
      complete: () => this.changeDetector.markForCheck(),

    }).add(() => {

      this.isLoading = false;
      this.changeDetector.markForCheck();

    });
  }

  applyFilters(): void {
    const search = this.searchTerm.trim().toLocaleLowerCase();

    this.filteredConflicts = this.conflicts.filter((conflict) => {

      const matchesSearch = !search ||
        conflict.codigo.toLowerCase().includes(search) ||
        conflict.descripcion.toLowerCase().includes(search) ||
        conflict.involucrados.some((person) =>
          person.nombre.toLowerCase().includes(search) ||
          person.documento.toLowerCase().includes(search) ||
          person.correo.toLowerCase().includes(search)
        );

      const matchesLevel = !this.selectedLevel || conflict.nivel === this.selectedLevel;
      const matchesStatus = !this.selectedStatus || conflict.estado === this.selectedStatus

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedLevel = '';
    this.selectedStatus = '';

    this.filteredConflicts = this.conflicts;
  }

  openDetailModal(conflict: Conflict): void {
    this.selectedConflict = conflict;
    this.isDetailModalOpen = true;
  }

  closeDetailModal(): void {
    this.selectedConflict = null;
    this.isDetailModalOpen = false;
  }

  openConflictDetail(conflict: Conflict): void {
    this.selectedConflict = conflict;
    this.showDetailModal = true;
  }

  closeConflictDetail(): void {
    this.showDetailModal = false;
    this.selectedConflict = null;
  }

  validateConflict(): void {

    if (!this.selectedConflict) {
      return;
    }

    this.isResolving = true;

    this.conflictService.updateConflictStatus(this.selectedConflict._id, 'RESUELTO').subscribe({

      next: (response) => {

        const updatedConflict = response.data;

        // Actualizar el conflicto dentro de la tabla
        this.conflicts = this.conflicts.map(conflict => conflict._id === updatedConflict._id ? updatedConflict : conflict);

        // Volver a aplicar filtros
        this.applyFilters();

        // Actualizar el conflicto seleccionado
        this.selectedConflict = updatedConflict

        this.isResolving = false;

        this.sweetAlert.success('El conflicto fue validado y resuelto correctamente.');

        this.closeConflictDetail();

      },

      error: (error) => {

        this.isResolving = false;

        this.sweetAlert.error(error?.error?.message ?? 'No se pudo resolver el conflicto.');
      }

    });

  }

}
