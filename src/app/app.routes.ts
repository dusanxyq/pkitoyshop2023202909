import { Routes } from '@angular/router'
import { Home } from './home/home'
import { Details } from './details/details'
import { Toys } from './toys/toys'
import { Login } from './login/login'
import { Profile } from './profile/profile'
import { Singup } from './singup/singup'
import { Basket } from './basket/basket'

export const routes: Routes = [
  { path: '', title: 'Pocetna', component: Home },
  { path: 'details/:toyId', title: 'Detalji', component: Details },
  { path: 'toys', title: 'Katalog', component: Toys },
  { path: 'login', title: 'Prijava', component: Login },
  { path: 'singup', title: 'Registracija', component: Singup },
  { path: 'profile', title: 'Profil', component: Profile },
  { path: 'basket', title: 'Korpa', component: Basket },
]
