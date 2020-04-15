import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommondialogComponent } from '../commondialog/commondialog.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
contactsList:any
selecteduser:any
currentUser:any;
chatForm: FormGroup;
messages:any
allGroups:any
  constructor(
    public userService:UserService,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) {
    this.currentUser = JSON.parse(this.userService.getToken());
   if(this.currentUser)  this.userService.Connectsocket(this.currentUser);
    }
   

  ngOnInit() {
    this.chatForm = this.formBuilder.group({
      message: [null],
    });
    this.userService.getallUser().subscribe(data=>{
    this.contactsList=data;
    this.getGroups()
    });
    this.userService.newMessage().subscribe((data: any) => {
      if (this.selecteduser) {
        console.log(data)
        const senderid = data.senderid ? data.senderid._id : null;
        const recieverid = data.recieverid ? data.recieverid._id : null;
        const groupid = data.groupid ? data.groupid._id : null;
        const chatid = this.selecteduser ? this.selecteduser._id : null;
        const userid = this.currentUser._id;
        if (
          ((chatid === senderid) && (userid === recieverid)) ||
          ((chatid === recieverid) && (userid === senderid)) ||
          (chatid === groupid)
        ) {
          this.messages.push(data);
          // this.messages = _.uniqBy(this.messages, '_id');
          this.messages.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
          // const objDiv = document.getElementById('chat');
          // objDiv.scrollTop = objDiv.scrollHeight;
        }
      }
  })
  }
selectuser(user)
{
  this.selecteduser=user;
   this.userService.getMessages(user._id).subscribe((data: any) => {
      this.messages = data;
      this.messages.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    }, err => {
    });
}

/**
   *
   * To send message
   */
  sendMessage() {
    if (this.chatForm.value.message && this.chatForm.value.message.length) {
      const obj = {
        message: this.chatForm.value.message,
        recieverid: this.selecteduser.role === 'user' ? this.selecteduser._id : null,
        groupid: this.selecteduser.role !== 'user' ? this.selecteduser._id : null,
        active: Boolean
      };
      this.userService.sendMessage(obj).subscribe(data => {
        // const objDiv = document.getElementById('chat');
        // objDiv.scrollTop = objDiv.scrollHeight;
        this.chatForm.setValue({message: null });
      }, err => {
      });
    }
  }
  getGroups() {
    this.userService.getAllGroups(this.currentUser._id).subscribe(data => {
      this.allGroups = data;
      this.allGroups.forEach(element => {
        this.contactsList.push(element)
      });
    }, err => {
    });
  }
  openModel() {
    const dialogRef = this.dialog.open(CommondialogComponent, {
      width: '500px',
      height: '350px',
      data: this.contactsList
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed', result);
      if (result) {
        result.created_by = this.currentUser._id;
        const currUser = this.contactsList.find(x => x._id === this.currentUser._id);
        result.users.push(currUser);
        this.userService.createGroup(result).subscribe(data => {
         this.contactsList.push(data)
        }, err => {
        });
      }
    });
  }
logout()
{
  this.userService.logout();
  this.userService.Connectsocket({type:'disconnect'});

}

}
