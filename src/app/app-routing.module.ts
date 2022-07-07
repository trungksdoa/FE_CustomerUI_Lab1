import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { RegisterComponent } from './feature/register/register.component'
import { PDetailComponent } from './feature/p-detail/p-detail.component'
import { ProfileComponent } from './feature/profile/profile.component'
import { LoginUiComponent } from './home/login-ui/login-ui.component'
import { ProductComponent } from './home/product/product.component'
import { InvoiceComponent } from './feature/invoice/invoice.component'
import { AuthGuardService } from './Auth/auth-guard.service'
import { LoginGuardService } from './Auth/login-guard.service'
import { NotFound404Component } from './not-found404/not-found404.component'



const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  {
    path: 'invoice',
    component: InvoiceComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'detail/:id/:slogan', // child route path
    component: PDetailComponent
    // child route component that the router renders
  },

  {
    path: 'login',
    component: LoginUiComponent,
    canActivate: [LoginGuardService]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [LoginGuardService]
  },
  { path: 'product/category/:id/:slogan', component: ProductComponent },
  { path: 'product/search/:keyword', component: ProductComponent },
  {path: '404', component: NotFound404Component},
  {path: '**', redirectTo: '404'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
