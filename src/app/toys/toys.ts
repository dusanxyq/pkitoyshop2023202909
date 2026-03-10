import { Component, signal, computed } from '@angular/core'
import { ToyModel } from '../models/toy.model'
import { ToyService } from '../services/toy.service'
import { Router, RouterLink } from '@angular/router'
import { Utils } from '../utils'
import Swal from 'sweetalert2'
import { ToyRatingService } from '../services/toy.rating.service'
import { FormsModule } from '@angular/forms'
import { BasketModel } from '../models/basket.model'
import { BasketService } from '../services/basket.service'

interface FilterState {
  category: string
  minPrice: number
  maxPrice: number
  ageGroup: string
  targetGroup: string
}

@Component({
  selector: 'app-toys',
  imports: [RouterLink, FormsModule],
  templateUrl: './toys.html',
  styleUrl: './toys.css',
})
export class Toys {
  protected allToys = signal<ToyModel[]>([])
  protected basket = signal<BasketModel[]>([])
  protected search: string = ''
  protected previousSearch: string = '/'

  protected filters = signal<FilterState>({
    category: '',
    minPrice: 0,
    maxPrice: 100000,
    ageGroup: '',
    targetGroup: '',
  })

  protected categories = signal<{ typeId: number; name: string; description: string }[]>([])
  protected ageGroups = signal<string[]>(['0-2', '3-5', '6-9', '10+'])
  protected targetGroups = signal<string[]>(['dečak', 'devojčica'])

  protected toys = computed(() => {
    const allToys = this.allToys()
    const filterState = this.filters()

    return allToys.filter((toy) => {
      if (filterState.category && toy.type?.typeId !== +filterState.category) {
        return false
      }

      if (toy.price < filterState.minPrice || toy.price > filterState.maxPrice) {
        return false
      }

      if (filterState.ageGroup && toy.ageGroup.name !== filterState.ageGroup) {
        return false
      }

      if (filterState.targetGroup && toy.targetGroup !== filterState.targetGroup) {
        return false
      }

      return true
    })
  })

  constructor(
    protected utils: Utils,
    private toyRatingService: ToyRatingService,
    private router: Router,
    private basketService: BasketService,
  ) {
    this.utils.showLoading()
    ToyService.getAllToys()
      .then((rsp) => {
        this.allToys.set(rsp.data)
        this.extractCategories(rsp.data)
        Swal.close()
      })
      .catch((err) => {
        Swal.close()
        console.log(err)
      })
  }

  private extractCategories(toys: ToyModel[]) {
    const uniqueCategories = toys
      .map((toy) => toy.type)
      .filter(
        (type, index, self) => type && self.findIndex((t) => t?.typeId === type?.typeId) === index,
      )
    this.categories.set(uniqueCategories)
  }

  updateFilter(key: keyof FilterState, value: any) {
    this.filters.set({ ...this.filters(), [key]: value })
  }

  resetFilters() {
    this.filters.set({
      category: '',
      minPrice: 0,
      maxPrice: 100000,
      ageGroup: '',
      targetGroup: '',
    })
  }

  getToyAverageRating(toyId: number) {
    return this.toyRatingService.getAverageRating(toyId)
  }

  getToyRatingCount(toyId: number) {
    return this.toyRatingService.getRatingCount(toyId)
  }

  getFullStars(rating: number) {
    return Math.floor(rating)
  }

  hasHalfStar(rating: number) {
    return rating % 1 >= 0.5
  }

  searchToys() {
    const query = this.search.trim().toLowerCase()

    if (!query) {
      ToyService.getAllToys()
        .then((rsp) => this.allToys.set(rsp.data))
        .catch((err) => console.log(err))
      return
    }

    const filtered = this.allToys().filter((toy) => toy.name.toLowerCase().includes(query))

    this.allToys.set(filtered)
  }

  addToBasket(toy: ToyModel) {
    this.basketService.addToBasket(toy)
  }
}
