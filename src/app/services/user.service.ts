import { UserModel } from '../models/user.model'

export class UserService {
  static getUsers(): UserModel[] {
    if (!localStorage.getItem('users'))
      localStorage.setItem(
        'users',
        JSON.stringify([
          {
            firstName: 'User',
            lastName: 'Example',
            email: 'user@example.com',
            phone: '+38166232323',
            password: 'user123',
            favoriteToyType: 'Slagalica',
          },
        ]),
      )
    return JSON.parse(localStorage.getItem('users')!)
  }

  static findUserByEmail(email: string) {
    const users: UserModel[] = this.getUsers()
    const exactUser = users.find((u) => u.email === email)

    if (!exactUser) throw new Error('USER_NOT_FOUND')

    return exactUser
  }

  static login(email: string, password: string) {
    const user = this.findUserByEmail(email)
    if (user.password !== password) throw new Error('BAD_PASSWORD')

    localStorage.setItem('active', user.email)
  }

  static signup(data: UserModel) {
    const users: UserModel[] = this.getUsers()
    users.push(data)
    localStorage.setItem('users', JSON.stringify(users))
  }

  static getActiveUser() {
    const active = localStorage.getItem('active')
    if (!active) throw new Error('NO_ACTIVE_USER')

    return this.findUserByEmail(active)
  }

  static updateUser(newUser: UserModel) {
    const active = this.getActiveUser()
    const users = this.getUsers()
    users.forEach((u) => {
      if (u.email == active.email) {
        u.firstName = newUser.firstName
        u.lastName = newUser.lastName
        u.phone = newUser.phone
        u.favoriteToyType = newUser.favoriteToyType
      }
    })
    localStorage.setItem('users', JSON.stringify(users))
  }

  static updateUserPassword(newPassword: string) {
    const active = this.getActiveUser()
    const users = this.getUsers()
    users.forEach((u) => {
      if (u.email == active.email) {
        u.password = newPassword
      }
    })
    localStorage.setItem('users', JSON.stringify(users))
  }

  static logout() {
    localStorage.removeItem('active')
  }
}
