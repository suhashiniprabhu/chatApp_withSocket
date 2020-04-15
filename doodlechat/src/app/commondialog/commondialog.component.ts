import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../user.service';


@Component({
  selector: 'app-commondialog',
  templateUrl: './commondialog.component.html',
  styleUrls: ['./commondialog.component.css'],
})
export class CommondialogComponent implements OnInit {
  allUsers: any;
  groupname:any;
  users:any
  constructor(
    public UserService:UserService ,
    public dialogRef: MatDialogRef<CommondialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.allUsers = [...data];
    const currentUser = JSON.parse(this.UserService.getToken());
    const index = this.allUsers.findIndex(o=> (o._id === currentUser._id) );
    this.allUsers.splice(index, 1);
   }

  ngOnInit(): void {

  }

  addGrp(form) {
    if (form.valid) {
      this.dialogRef.close(form.value);
    }
  }

}
