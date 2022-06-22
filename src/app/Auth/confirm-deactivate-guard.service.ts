import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot
} from '@angular/router'
import { Observable } from 'rxjs'


export interface IDeactivateOptions {
  canExit(): boolean | Promise<boolean> | Observable<boolean>
}
@Injectable({
  providedIn: 'root'
})
export class ConfirmDeactivateGuardService
  implements CanDeactivate<IDeactivateOptions> {
  canDeactivate (
    component: IDeactivateOptions,
    router: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean> {
    return component.canExit()
  }
}
