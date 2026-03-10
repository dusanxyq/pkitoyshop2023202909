import axios from 'axios'
import { ToyModel } from '../models/toy.model'

const client = axios.create({
  baseURL: 'https://toy.pequla.com/api',
  validateStatus: (status: number) => status === 200,
  headers: {
    Accept: 'application/json',
    'X-Name': 'ToyStore/2025',
  },
})

export class ToyService {
  static async getAllToys() {
    return await client.get<ToyModel[]>(`/toy/`)
  }

  static async getToyById(id: number) {
    return await client.get<ToyModel>(`/toy/${id}`)
  }

  static async getToysByIds(ids: number[]) {
    return await client.request({
      url: '/toy/list',
      method: 'post',
      data: ids,
    })
  }

  static async getToyByPermalink(permalink: string) {
    return await client.get<any>(`/toy/permalink/${permalink}`)
  }
}
