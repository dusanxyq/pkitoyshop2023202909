import { Component, computed, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { UserService } from '../services/user.service'
import { ToyModel } from '../models/toy.model'
import { ToyService } from '../services/toy.service'
import { Utils } from '../utils'

@Component({
  selector: 'app-singup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './singup.html',
  styleUrl: './singup.css',
})
export class Singup {
  protected form: FormGroup
  protected toys = signal<ToyModel[]>([])
  protected uniqueTypes = computed(() => [...new Set(this.toys().map((toy) => toy.type.name))])

  constructor(
    private formBuilder: FormBuilder,
    protected router: Router,
    private utils: Utils,
  ) {
    ToyService.getAllToys().then((rsp) => this.toys.set(rsp.data))

    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      favoriteToyType: ['', Validators.required],
    })
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utils.showAlert('Forma nije dobro popunjena!')
      return
    }

    if (this.form.value.password !== this.form.value.repeatPassword) {
      this.utils.showAlert(`Lozinke nisu iste!`)
      return
    }

    try {
      const formValue: any = this.form.value
      delete formValue.repeatPassword
      UserService.signup(formValue)
      this.router.navigateByUrl('/login')
    } catch (e) {
      console.error(e)
      this.utils.showAlert('Fale podaci!')
    }
  }
}
