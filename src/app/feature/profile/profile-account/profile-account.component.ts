import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Users } from 'src/app/model/user';
import { SharedService } from 'src/app/shared.service';
import { ToastServiceService } from 'src/app/toast-service.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile-account',
  templateUrl: './profile-account.component.html',
  styleUrls: ['./profile-account.component.css']
})
export class ProfileAccountComponent implements OnInit {
  user: Users
  isSubmit = false

  show_button: Boolean = false;
  show_eye: Boolean = false

  isLogin: Boolean = false
  constructor(
     private _sharedService: SharedService,private UserService: UserService,
    private router: Router,
   private toast:ToastServiceService,) {  }

  ngOnInit(): void {
    this._sharedService.isLoggedIn().subscribe(data => {
      this.isLogin = data
      this.user=this._sharedService.getUserFromCookie()
    })

  }
  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }
  canExit (): boolean | Promise<boolean> | Observable<boolean> {
    if (this.isSubmit) {
      return true
    } else {
      if (confirm('Are you want to exit?')) {
        return true
      }
      return false
    }
  }

  resetNew (form: NgForm) {
    form.reset()
  }
  formSubmit (user:Users) {

      user.id = this.user.id
      this.UserService.update(user).subscribe(data => {
       console.log(data)
          this.isSubmit = true
          this._sharedService.setCookie('user', data)
          this.user=data
          this._sharedService.callFunctionByClick();
          // this.router.navigate([''])
          // this.sharedService.isLoggin(true)
          this.toast.showSuccess('Cập nhật thành công!');
      },(error: HttpErrorResponse) => {
        this.toast.showError('Có lỗi xảy ra');
      }
      )


  }

}
