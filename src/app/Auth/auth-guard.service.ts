// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core'
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router'
import { Observable } from 'rxjs'
import { SharedService } from '../shared.service'
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor (public sharedService: SharedService, public router: Router) {}
  isloggin = false
  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const check: { isLoggin: boolean } = {
      isLoggin: false
    }
    this.sharedService.isLoggedIn().subscribe(isLoggedIn => {
      check.isLoggin = isLoggedIn
    })
    if (check.isLoggin) {
      return true
    } else {
      this.router.navigate(['/login'], {
        queryParams: { redirectURL: state.url }
      })
      return false
    }
  }
}
