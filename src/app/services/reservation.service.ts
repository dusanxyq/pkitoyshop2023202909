import { Injectable, signal, effect } from '@angular/core'
import { ReservationModel } from '../models/reservation.model'
import { BasketModel } from '../models/basket.model'

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  public reservations = signal<ReservationModel[]>(this.loadReservations())

  constructor() {
    effect(() => {
      localStorage.setItem('reservations', JSON.stringify(this.reservations()))
    })
  }

  private loadReservations() {
    const saved = localStorage.getItem('reservations')
    return saved ? JSON.parse(saved) : []
  }

  private generateId() {
    const all = this.reservations()
    if (all.length === 0) return 1
    return Math.max(...all.map((r) => r.id)) + 1
  }

  addReservation(basketItems: BasketModel[], userEmail: string) {
    const toys = basketItems.map((item) => ({
      toyId: item.toy.toyId,
      name: item.toy.name,
      price: item.toy.price,
      quantity: item.quantity,
    }))

    const totalPrice = toys.reduce((sum, t) => sum + t.price * t.quantity, 0)

    const newReservation: ReservationModel = {
      id: this.generateId(),
      userEmail,
      toys,
      totalPrice,
      status: 'rezervisano',
      createdAt: new Date().toISOString(),
    }

    this.reservations.update((res) => [...res, newReservation])
  }

  getReservationsByUser(userEmail: string) {
    return this.reservations().filter((r) => r.userEmail === userEmail)
  }

  deleteReservation(id: number) {
    this.reservations.update((res) => res.filter((r) => r.id !== id))
  }

  clearAll() {
    this.reservations.set([])
  }

  updateStatus(id: number, status: 'pristiglo' | 'otkazano') {
    this.reservations.update((r) => r.map((r) => (r.id === id ? { ...r, status } : r)))
  }
}
