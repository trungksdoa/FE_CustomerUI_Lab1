
import { AuthGuardService } from './Auth/auth-guard.service'
import { NgxPaginationModule } from 'ngx-pagination';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgToastModule } from 'ng-angular-popup'

//Module
import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
//Material



import { MaterialExampleModule } from './module/material.module'
import { HomeComponent } from './home/home.component'
import { CategoryService } from './api/category/category.service'
import { ProductService } from './api/product/product.service'
import { HeaderComponent } from './home/header/header.component'
import { NavComponent } from './home/nav/nav.component'
import { BannerSliderComponent } from './home/banner-slider/banner-slider.component'
import { ProductComponent } from './home/product/product.component'
import { FooterComponent } from './home/footer/footer.component'

// import { AdminItemsComponent } from './admin/admin-items/admin-items.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from './shared.service'

import { LoginUiComponent } from './home/login-ui/login-ui.component'
import { SpinnerComponent } from './feature/spinner/spinner.component';
import { httpInterceptProviders } from './http';


import { NgxPayPalModule } from 'ngx-paypal';
import { NgChartsModule } from 'ng2-charts';
import { InvoiceComponent } from './feature/invoice/invoice.component';
import { ProductBestSellerComponent } from './product-best-seller/product-best-seller.component';

// import { RegisterComponent } from './register/register.component';
import { PCartComponent } from './feature/p-cart/p-cart.component';
import { PDetailComponent } from './feature/p-detail/p-detail.component';
import { PPaymentComponent } from './feature/p-payment/p-payment.component';
import { NgCartService } from './feature/p-cart/service/NgCartService';
import { CityService } from './feature/p-payment/citys.service';
import { OrderService } from './feature/p-payment/order.service';
import { UserService } from './feature/profile/user.service';
import { RegisterComponent } from './feature/register/register.component';
import { SearchComponent } from './feature/search/search.component';
import { ProfileOrderDetailComponent } from './feature/profile/profile-order-detail/profile-order-detail.component';
import { ProfileOrderComponent } from './feature/profile/profile-order/profile-order.component';
import { ProfileComponent } from './feature/profile/profile.component';
import { PaymentPaypalComponent } from './feature/p-payment/Payment-paypal/payment-paypal.component';
import { ConfirmDeactivateGuardService } from './Auth/confirm-deactivate-guard.service';
import { LoginGuardService } from './Auth/login-guard.service';
import { ProfileAccountComponent } from './feature/profile/profile-account/profile-account.component';

import { ToastServiceService } from './toast-service.service';
import { NgCartCaculatorService } from './feature/p-cart/service/NgCartCaculatorService';
import { NgCartApiService } from './feature/p-cart/service/NgCartAPIService';
import { SizeDetectorComponent } from './size-detector/size-detector.component';
import { ResizeChangeService } from './size-detector/resize-change.service';




@NgModule({
  declarations: [
    AppComponent,
    PDetailComponent,
    PCartComponent,
    HomeComponent,
    HeaderComponent,
    NavComponent,
    BannerSliderComponent,
    ProductComponent,
    FooterComponent,
    PPaymentComponent,
    LoginUiComponent,
    SpinnerComponent,
    ProfileComponent,
    ProfileOrderComponent,
    InvoiceComponent,
    ProfileOrderDetailComponent,
    ProductBestSellerComponent,
    RegisterComponent,
    SearchComponent,
    ProfileAccountComponent,
    SizeDetectorComponent,
    PaymentPaypalComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule ,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialExampleModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxPayPalModule,
    NgChartsModule,
    NgxPaginationModule,
    SlickCarouselModule,
    NgSelectModule,
    NgToastModule,
  ],
  providers: [
    httpInterceptProviders,
    CategoryService,
    ProductService,
    NgCartService,
    SharedService,
    OrderService,
    UserService,
    AuthGuardService,
    CityService,
    ConfirmDeactivateGuardService,
    LoginGuardService,
    CookieService,
    ToastServiceService,
    NgCartCaculatorService,
    NgCartApiService,
    ResizeChangeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
