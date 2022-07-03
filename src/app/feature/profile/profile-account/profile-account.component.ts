import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { Users, UserUpdate } from 'src/app/model/user'
import { SharedService } from 'src/app/service/shared.service'
import { ToastServiceService } from 'src/app/service/toast-service.service'
import { UserService } from 'src/app/feature/profile/user.service'
@Component({
  selector: 'app-profile-account',
  templateUrl: './profile-account.component.html',
  styleUrls: ['./profile-account.component.css']
})
export class ProfileAccountComponent implements OnInit {
  user: Users
  isSubmit = false
  oldData: Users
  show_button: Boolean = false
  show_eye: Boolean = false

  

  isLogin: Boolean = false
  constructor (
    private _sharedService: SharedService,
    private UserService: UserService,
    private router: Router,
    private toast: ToastServiceService
  ) {}

  ngOnInit (): void {
    this._sharedService.isLoggedIn().subscribe(data => {
      this.isLogin = data
      this.user = this._sharedService.getUserFromCookie()
      this.oldData = this._sharedService.getUserFromCookie()
    })
  }
  showPassword () {
    this.show_button = !this.show_button
    this.show_eye = !this.show_eye
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
  formSubmit () {
    this.UserService.update(this.user).subscribe(
      ({ message, user }: { message: string; user: Users }) => {
        this.isSubmit = true
        this._sharedService.setCookie('user', user)
        this.user = user
        this._sharedService.callFunctionByClick()
        this.toast.showSuccess(message)
      },
      (error: HttpErrorResponse) => {
        // alert(this.oldData.username);
        this.user = { ...this.oldData }
        this.toast.showError(error.error.message)
      }
    )
  }
}
