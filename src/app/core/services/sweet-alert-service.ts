import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  error(mensaje: string) {
    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      confirmButtonText: 'Aceptar'
    });
  }

  success(mensaje: string) {
    return Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: mensaje,
      confirmButtonText: 'Aceptar'
    });
  }

  warning(mensaje: string) {
    return Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: mensaje,
      confirmButtonText: 'Aceptar'
    });
  }
}
