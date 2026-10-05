import { HttpErrorResponse } from '@angular/common/http';
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
          if (!blob.size) {
            this.sweetAlert.error('El PDF se recibió vacío. Intenta nuevamente.');
            return;
          }
          this.downloadFile(
            blob,
            'reporte-conflictos.pdf'
          );

          this.sweetAlert.success(
            'El reporte PDF fue generado correctamente.'
          );

        },
        error: (error: HttpErrorResponse) => {
          void this.showReportError(error, 'No se pudo generar el reporte PDF.');
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
          if (!blob.size) {
            this.sweetAlert.error('El archivo Excel se recibió vacío. Intenta nuevamente.');
            return;
          }
          this.downloadFile(
            blob,
            'reporte-conflictos.xlsx'
          );

          this.sweetAlert.success(
            'El reporte Excel fue generado correctamente.'
          );
        },
        error: (error: HttpErrorResponse) => {
          void this.showReportError(error, 'No se pudo generar el reporte Excel.');
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

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  }

  private async showReportError(error: HttpErrorResponse, fallback: string): Promise<void> {
    const responseBody: unknown = error.error;
    let message = fallback;

    if (responseBody instanceof Blob) {
      const text = await responseBody.text();
      try {
        const parsed = JSON.parse(text) as { message?: string };
        message = parsed.message ?? message;
      } catch {
        if (text.trim()) {
          message = text;
        }
      }
    } else if (
      typeof responseBody === 'object' &&
      responseBody !== null &&
      'message' in responseBody &&
      typeof responseBody.message === 'string'
    ) {
      message = responseBody.message;
    }

    await this.sweetAlert.error(message);
  }

}
