import { Injectable } from '@angular/core'
import Swal from 'sweetalert2'

@Injectable({ providedIn: 'root' })
export class Utils {
  public showConfirm(message: string, callback: Function) {
    Swal.fire({
      title: message,
      showCancelButton: true,
      confirmButtonText: 'Da',
      cancelButtonText: 'Ne',
      icon: 'question',
    }).then((rsl) => {
      if (rsl.isConfirmed) callback()
    })
  }

  public showError(message: string) {
    Swal.fire({
      title: 'Doslo je do greske!',
      confirmButtonText: 'U redu',
      text: message,
      icon: 'error',
    })
  }

  public showAlert(message: string) {
    Swal.fire({
      titleText: message,
      icon: 'info',
    })
  }

  public showLoading() {
    Swal.fire({
      title: 'Samo momenat',
      text: 'Prikupljamo podatke sa servera',
      didOpen: () => Swal.showLoading(),
    })
  }

  public getImage(url: string) {
    return `https://toy.pequla.com${url}`
  }

  public hasAuth() {
    if (localStorage.getItem('active')) return true
    return false
  }
}
