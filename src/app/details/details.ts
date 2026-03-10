import { Component, signal, OnInit } from '@angular/core'
import { ToyModel } from '../models/toy.model'
import { ActivatedRoute } from '@angular/router'
import { ToyService } from '../services/toy.service'
import { Utils } from '../utils'
import Swal from 'sweetalert2'
import { ToyRatingService } from '../services/toy.rating.service'
import { BasketService } from '../services/basket.service'

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  protected toy = signal<ToyModel | null>(null)
  protected other = signal<ToyModel[]>([])
  currentRating = 0
  hoverRating = 0

  constructor(
    private route: ActivatedRoute,
    protected utils: Utils,
    private toyRatingService: ToyRatingService,
    private basketService: BasketService,
  ) {
    this.utils.showLoading()
    this.route.params.subscribe((params: any) => {
      ToyService.getToyById(params.toyId).then((rsp) => {
        console.log(rsp.data)
        this.toy.set(rsp.data)
        this.currentRating = this.toyRatingService.getUserLastRating(rsp.data.toyId)

        ToyService.getToyByPermalink(rsp.data.permalink).then((rsp) => {
          this.other.set(rsp.data.content)
          Swal.close()
        })
      })
    })
  }

  getAverageRating(): number {
    return this.toy() ? this.toyRatingService.getAverageRating(this.toy()!.toyId) : 0
  }

  getAverageRatingText(): string {
    const avg = this.getAverageRating()
    if (avg === 0) return 'Još uvek nema ocena. Ocenite Vi i pomozite ostalima!'
    return `${avg.toFixed(1)} / 5`
  }
  roundRating(rating: number): number {
    return Math.round(rating)
  }

  addToBasket(toy: ToyModel) {
    this.basketService.addToBasket(toy)
  }
}
