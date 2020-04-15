import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
loginForm: FormGroup;
loading = false;
submitted = false;
  constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        public userService:UserService,
        private _snackBar: MatSnackBar
        ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });


  }
// convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }



  onSubmit() {
        this.submitted = true;
      // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

         this.loading = true;
        this.userService.loginUser(this.loginForm.value)
            .subscribe(
                (data:any) => {
                data.type = 'connect';
              this.userService.sendToken(JSON.stringify(data));
              this.openSnackBar('success','x')

              this.router.navigate(['/main']);
                },
                error => {
                  this.openSnackBar('Email or Password is incorrect','x')
                    this.loading = false;
                });
    }
      openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
