import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpErrorInterceptor } from "./http-error";



export const httpInterceptProviders  = [
  {provide: HTTP_INTERCEPTORS,  useClass: HttpErrorInterceptor, multi: true}
]
