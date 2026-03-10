import { Component, computed, signal } from '@angular/core'
import { UserService } from '../services/user.service'
import { Router, RouterModule } from '@angular/router'
import { Utils } from '../utils'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ToyModel } from '../models/toy.model'
import { UserModel } from '../models/user.model'
import Swal from 'sweetalert2'
import { ToyService } from '../services/toy.service'
import { ReservationService } from '../services/reservation.service'
import { ToyRatingService } from '../services/toy.rating.service'

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  protected profileForm: FormGroup
  protected passwordForm: FormGroup
  protected currentUser = signal<UserModel | null>(null)
  protected toys = signal<ToyModel[]>([])
  protected uniqueTypes = computed(() => [...new Set(this.toys().map((toy) => toy.type.name))])
  protected reservations
  protected currentRatings = signal<{ [key: string]: number }>({})
  protected hoverRatings = signal<{ [key: string]: number }>({})
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public utils: Utils,
    private reservationService: ReservationService,
    private toyRating: ToyRatingService,
  ) {
    this.reservations = this.reservationService.reservations
    ToyService.getAllToys().then((rsp) => {
      this.toys.set(rsp.data)
    })

    try {
      this.utils.showLoading()
      this.currentUser.set(UserService.getActiveUser())
    } catch {
      this.router.navigate(['/login'])
    }

    this.profileForm = this.formBuilder.group({
      firstName: [this.currentUser()!.firstName, Validators.required],
      lastName: [this.currentUser()!.lastName, Validators.required],
      phone: [this.currentUser()!.phone, Validators.required],
      favoriteToy: [this.currentUser()!.favoriteToyType, Validators.required],
    })

    this.passwordForm = this.formBuilder.group({
      old: ['', Validators.required],
      new: ['', Validators.required],
      repeat: ['', Validators.required],
    })

    this.reservations.set(this.reservationService.getReservationsByUser(this.currentUser()!.email))

    Swal.close()
  }

  protected onProfileSubmit() {
    this.utils.showConfirm('Da li ste sigurni da zelite da azurirate profil?', () => {
      if (!this.profileForm.valid) {
        this.utils.showError('Lose uneti podaci u formu!')
        return
      }

      UserService.updateUser(this.profileForm.value)
      this.utils.showAlert('Profil je azuriran!')
    })
  }

  protected onPasswordSubmit() {
    this.utils.showConfirm('Da li ste sigurni da zelite da promenite lozinku?', () => {
      if (!this.passwordForm.valid) {
        this.utils.showError('Lose uneti podaci u formu')
        return
      }

      const old = this.currentUser()!.password
      if (old != this.passwordForm.value.old) {
        this.utils.showError('Trenutna lozinka nije ispravno uneta!')
        return
      }

      if (this.passwordForm.value.new != this.passwordForm.value.repeat) {
        this.utils.showError('Lozinke nisu iste!')
        return
      }

      UserService.updateUserPassword(this.passwordForm.value.new)
      this.utils.showAlert('Lozinka je promenjena! Molimo Vas da se prijavite opet.')
      UserService.logout()
      this.router.navigateByUrl('/login')
    })
  }

  arrived(id: number) {
    this.reservationService.updateStatus(id, 'pristiglo')
  }

  cancel(id: number) {
    this.reservationService.updateStatus(id, 'otkazano')
  }

  rateToy(reservationId: number, toyId: number, rating: number) {
    const key = `${reservationId}-${toyId}`
    const updatedRatings = { ...this.currentRatings(), [key]: rating }
    this.currentRatings.set(updatedRatings)

    this.toyRating.addRating(toyId, rating)

    Swal.fire({
      icon: 'success',
      title: 'Hvala na oceni!',
      text: (() => {
        switch (rating) {
          case 1:
            return 'Hvala Vam na jednoj zvezdi! Nastojimo da budemo bolji.'
          case 2:
            return 'Hvala Vam na dve zvezde! Radimo na poboljšanjima.'
          case 3:
            return 'Hvala Vam na tri zvezde! Cenimo Vašu povratnu informaciju.'
          case 4:
            return 'Hvala Vam na četiri zvezde! Drago nam je što Vam se dopada.'
          case 5:
            return 'Hvala Vam na pet zvezdi! Oduševljeni smo što ste zadovoljni!'
          default:
            return `Hvala Vam na iskrenoj oceni`
        }
      })(),
      timer: 2000,
      showConfirmButton: false,
    })
  }

  hoverReservation(reservationId: number, toyId: number, rating: number) {
    const key = `${reservationId}-${toyId}`
    const updatedHover = { ...this.hoverRatings(), [key]: rating }
    this.hoverRatings.set(updatedHover)
  }

  leaveHover(reservationId: number, toyId: number) {
    const key = `${reservationId}-${toyId}`
    const updatedHover = { ...this.hoverRatings(), [key]: 0 }
    this.hoverRatings.set(updatedHover)
  }

  isStarActive(reservationId: number, toyId: number, star: number): boolean {
    const key = `${reservationId}-${toyId}`
    const hover = this.hoverRatings()[key] || 0
    if (hover > 0) return star <= hover
    const current = this.currentRatings()[key] || 0
    return star <= current
  }

  readableDate(isoDate: string): string {
    const date = new Date(isoDate)

    return date.toLocaleString('sr-RS', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
}
