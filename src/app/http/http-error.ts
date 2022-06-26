
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { Cart } from '../model/cart'
import { SpinnerService } from 'src/app/service/spinner.service'

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor (private spinnerServer: SpinnerService) {}
  intercept (
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinnerServer.requestStarted()
    return this.handler(next, req)
  }
  handler (next: HttpHandler, request: HttpRequest<any>) {
    return next.handle(request).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            this.spinnerServer.requestEnded()
          }
        },
        (error: HttpErrorResponse) => {
          this.spinnerServer.resetSpinner()
          throw error
        }
      )
    )
  }
}
