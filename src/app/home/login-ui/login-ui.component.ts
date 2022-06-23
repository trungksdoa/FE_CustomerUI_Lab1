import { NgCartService } from 'src/app/feature/p-cart/service/NgCartService'
import { SharedService } from 'src/app/shared.service'
import { Component, OnInit } from '@angular/core'
import { Users } from 'src/app/model/user'
import { NgForm } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { UserService } from 'src/app/feature/profile/user.service'
import { IDeactivateOptions } from 'src/app/Auth/confirm-deactivate-guard.service'
import { Observable } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'
import { ToastServiceService } from 'src/app/toast-service.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { HttpErrorResponse } from '@angular/common/http'
@Component({
  selector: 'app-login-ui',
  templateUrl: './login-ui.component.html',
  styleUrls: ['./login-ui.component.css']
})
export class LoginUiComponent implements OnInit, IDeactivateOptions {
  isSubmit = false
  hide = true
  durationInSeconds = 5
  show_button: Boolean = false;
  show_eye: Boolean = false
  constructor (
    private UserService: UserService,
    private sharedService: SharedService,
    private cartService: NgCartService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastServiceService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit (): void {}
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

  createUser (param: Users) {
    // alert(JSON.stringify(param))
    const user: Users = {
      id: 0,
      username: param.username,
      password: param.password,
      address: undefined,
      phone: undefined,
      isAdmin: false,
      name: undefined
    }

    return user
  }
  resetNew (form: NgForm) {
    form.reset()
  }
  formSubmit (form: NgForm) {
    const requestUser = this.createUser(form.value)
    if (form.value) {
      this.UserService.loginRequest(requestUser).subscribe(
        ({user,message}: { user: Users; message: string }) => {
          this.isSubmit = true
          this.cartService.getCartFromDB(user)
          this.sharedService.setCookie('user', user)
          this.sharedService.isLoggin(true)
          this.checkPreviousPage()
          this.toast.showSuccess(message)
          form.reset()
        },
        error => {
          this.toast.showError(error.error.message)
        }
      )
    }
  }
  checkPreviousPage () {
    const params = this.route.snapshot.queryParams

    if (params['redirectURL']) {
      this.router.navigateByUrl(params['redirectURL'])
    } else {
      this.router.navigate([''])
    }
  }
}
