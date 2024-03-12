import { Component, OnInit } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { Player } from '../models/players';
import { FantasyService } from '../service/fantasy.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  myForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private service: FantasyService,
    private router: Router
  ) {
    this.myForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(event: any) {
    let auth = getAuth();

    createUserWithEmailAndPassword(
      auth,
      this.myForm.value.email,
      this.myForm.value.password
    ).then((userCredential) => {
      let user = userCredential.user;
      console.log(user);
      this.router.navigateByUrl('/test');
    });
  }
}
