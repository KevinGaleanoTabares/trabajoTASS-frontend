import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { AdminService } from '../../../core/services/admin.service';
import { AdministratorSummary } from '../../../utils/interface_enums_types';

@Component({
  selector: 'app-super-admin-home',
  imports: [MatIconModule],
  templateUrl: './super-admin-home.html',
  styleUrl: './super-admin-home.css',
})
export class SuperAdminHome implements OnInit {
  private readonly adminService = inject(AdminService);

  administrators: AdministratorSummary[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadAdministrators();
  }

  loadAdministrators(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.getAdministrators()
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: response => {
          this.administrators = response.data;
        },
        error: error => {
          this.errorMessage = error?.error?.message
            ?? 'No se pudo cargar la lista de administradores.';
        },
      });
  }
}
