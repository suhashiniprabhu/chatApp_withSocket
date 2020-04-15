import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
 registerForm: FormGroup;
    loading = false;
    submitted = false;
    emailExists=false;
options=['Male','Female']

  constructor(private formBuilder: FormBuilder,
        private router: Router,public userService:UserService,  
              private _snackBar: MatSnackBar
 ) { }

  ngOnInit() {
      this.registerForm = this.formBuilder.group({
      firstName: [null, Validators.compose([Validators.required, Validators.pattern(/[a-zA-Z]{1,30}/)])],
      middleName: [null, Validators.compose([Validators.pattern(/[a-zA-Z]{1,30}/)])],
      lastName: [null, Validators.compose([Validators.required, Validators.pattern(/[a-zA-Z]{1,30}/)])],
      gender: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
        });
  }
   // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(this.registerForm.value)
            .subscribe(
                (data:any) => {
             if (data && data.message) {
                this.openSnackBar(data.message,'x')
                this.emailExists = true;
          } else {
            data.type = 'connect';
             this.openSnackBar('success','x')

            this.userService.sendToken(JSON.stringify(data));
            this.router.navigate(['/main']);
          }                },
                error => {
                    this.loading = false;
                });
     }
         openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
         }
}
