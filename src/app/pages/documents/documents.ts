import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { ConflictService } from '../../core/services/conflict.service';
import { SweetAlertService } from '../../core/services/sweet-alert.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents {

  isGenerating = false;
  private readonly changeDetector = inject(ChangeDetectorRef);

  constructor(
    private conflictService: ConflictService,
    private sweetAlert: SweetAlertService

  ) {}

  generatePdf(): void {

    this.isGenerating = true;

    this.conflictService.generateReport('pdf')
      .pipe(finalize(() => {
        this.isGenerating = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: (blob) => {
          this.downloadFile(
            blob,
            'reporte-conflictos.pdf'
          );

          this.sweetAlert.success(
            'El reporte PDF fue generado correctamente.'
          );

        },
        error: () => {
          this.sweetAlert.error(
            'No se pudo generar el reporte PDF.'
          );
        }
      });
  }


  generateExcel(): void {

    this.isGenerating = true;

    this.conflictService.generateReport('excel')
      .pipe(finalize(() => {
        this.isGenerating = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: (blob) => {
          this.downloadFile(
            blob,
            'reporte-conflictos.xlsx'
          );

          this.sweetAlert.success(
            'El reporte Excel fue generado correctamente.'
          );
        },
        error: () => {
          this.sweetAlert.error(
            'No se pudo generar el reporte Excel.'
          );
        }
      });
  }


  private downloadFile(
    blob: Blob,
    fileName: string
  ): void {

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;

    link.click();

    window.URL.revokeObjectURL(url);
  }

}
