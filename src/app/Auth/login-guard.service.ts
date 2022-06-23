import { Injectable } from '@angular/core'
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router'
import { Observable } from 'rxjs'
import { SharedService } from '../shared.service'

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {
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
    this.sharedService.isLoggedIn().subscribe(isLoggedIn => {
      this.isloggin = isLoggedIn
    })
    if (this.isloggin) {
      this.router.navigate(['/home'])
      return false;
    } else {
      return true;
    }
  }
}
