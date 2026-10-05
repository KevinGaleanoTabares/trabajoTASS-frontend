import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { ConflictService } from '../../../../core/services/conflict.service';
import { Conflict, Categoria } from '../../../../utils/interface_enums_types';
import { SweetAlertService } from '../../../../core/services/sweet-alert.service';

@Component({
  selector: 'app-conflict-table',
  imports: [DatePipe, FormsModule, MatIconModule],
  templateUrl: './conflict-table.html',
  styleUrl: './conflict-table.css',
})
export class ConflictTable implements OnInit {

  private readonly conflictService = inject(ConflictService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly sweetAlert = inject(SweetAlertService);

  selectedConflict: Conflict | null = null;
  showDetailModal = false;
  isUpdatingStatus = false;

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

  async changeConflictStatus(estado: 'RESUELTO' | 'PENDIENTE'): Promise<void> {
    if (!this.selectedConflict) {
      return;
    }

    const message = estado === 'RESUELTO'
      ? '¿Estás seguro que deseas resolver el conflicto?'
      : '¿Estás seguro que deseas devolver el conflicto a Pendiente?';
    const confirmation = await this.sweetAlert.confirm(message);

    if (!confirmation.isConfirmed || !this.selectedConflict) {
      return;
    }

    this.isUpdatingStatus = true;

    this.conflictService.updateConflictStatus(this.selectedConflict._id, estado)
      .pipe(finalize(() => {
        this.isUpdatingStatus = false;
      }))
      .subscribe({
      next: (response) => {
        const updatedConflict = response.data;
        this.conflicts = this.conflicts.map(conflict =>
          conflict._id === updatedConflict._id ? updatedConflict : conflict
        );
        this.applyFilters();
        this.selectedConflict = updatedConflict;
        this.sweetAlert.success(
          estado === 'RESUELTO'
            ? 'El conflicto fue resuelto correctamente.'
            : 'El conflicto volvió al estado Pendiente.'
        );
      },
      error: (error) => {
        this.sweetAlert.error(
          error?.error?.message ?? 'No se pudo actualizar el estado del conflicto.'
        );
      }
    });
  }

}
