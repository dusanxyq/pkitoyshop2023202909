import { Component } from '@angular/core'
import { BasketService } from '../services/basket.service'
import { Utils } from '../utils'
import { ReservationService } from '../services/reservation.service'

@Component({
  selector: 'app-basket',
  imports: [],
  templateUrl: './basket.html',
  styleUrl: './basket.css',
})
export class Basket {
  protected basket
  protected total
  protected basketItemCount

  constructor(
    private basketService: BasketService,
    protected utils: Utils,
    private reservationService: ReservationService,
  ) {
    this.basket = this.basketService._basket
    this.total = this.basketService.basketTotal
    this.basketItemCount = this.basketService.basketItemCount
  }

  removeItem(toyId: number) {
    this.basketService.removeFromBasket(toyId)
  }

  clearBasket() {
    this.basketService.clearBasket()
  }

  updateQuantity(toyId: number, quantity: number) {
    this.basketService.updateQuantity(toyId, quantity)
  }

  pay() {
    this.basketService.pay()
  }
}
