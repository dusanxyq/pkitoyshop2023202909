import { Injectable } from '@angular/core'

export interface ToyRating {
  ratings: number[]
  average: number
  count: number
}

@Injectable({
  providedIn: 'root',
})
export class ToyRatingService {
  private toyRatings: { [toyId: number]: ToyRating } = {}

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    const saved = localStorage.getItem('toyRatings')
    if (saved) {
      try {
        this.toyRatings = JSON.parse(saved)
        console.log('Loaded ratings:', this.toyRatings)
      } catch (e) {
        console.error('Error loading ratings:', e)
        this.toyRatings = {}
      }
    }
  }

  private saveToStorage() {
    localStorage.setItem('toyRatings', JSON.stringify(this.toyRatings))
  }

  addRating(toyId: number, rating: number) {
    if (!this.toyRatings[toyId]) {
      this.toyRatings[toyId] = {
        ratings: [],
        average: 0,
        count: 0,
      }
    }

    this.toyRatings[toyId].ratings.push(rating)
    this.toyRatings[toyId].count = this.toyRatings[toyId].ratings.length

    const sum = this.toyRatings[toyId].ratings.reduce((a, b) => a + b, 0)
    this.toyRatings[toyId].average = sum / this.toyRatings[toyId].count

    this.saveToStorage()
  }

  getRating(toyId: number) {
    return this.toyRatings[toyId] || null
  }

  getAverageRating(toyId: number) {
    const rating = this.getRating(toyId)
    return rating ? Math.round(rating.average * 10) / 10 : 0
  }

  getRatingCount(toyId: number) {
    const rating = this.getRating(toyId)
    return rating ? rating.count : 0
  }

  getUserLastRating(toyId: number) {
    const rating = this.getRating(toyId)
    if (rating && rating.ratings.length > 0) {
      return rating.ratings[rating.ratings.length - 1]
    }
    return 0
  }
}
