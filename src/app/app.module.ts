import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { NgToastModule } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { NgxPayPalModule } from 'ngx-paypal';
import { CategoryService } from './api/category/category.service';
import { ProductService } from './api/product/product.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuardService } from './Auth/auth-guard.service';
import { ConfirmDeactivateGuardService } from './Auth/confirm-deactivate-guard.service';
import { LoginGuardService } from './Auth/login-guard.service';
import { InvoiceComponent } from './feature/invoice/invoice.component';
import { PCartComponent } from './feature/p-cart/p-cart.component';
import { NgCartService, NgCartCaculatorService, NgCartApiService } from './feature/p-cart/service';
import { PDetailComponent } from './feature/p-detail/p-detail.component';
import { CityService } from './feature/p-payment/citys.service';
import { OrderService } from './feature/p-payment/order.service';
import { PPaymentComponent } from './feature/p-payment/p-payment.component';
import { PaymentPaypalComponent } from './feature/p-payment/payment-paypal/payment-paypal.component';
import { ProfileAccountComponent } from './feature/profile/profile-account/profile-account.component';
import { ProfileOrderDetailComponent } from './feature/profile/profile-order-detail/profile-order-detail.component';
import { ProfileOrderComponent } from './feature/profile/profile-order/profile-order.component';
import { ProfileComponent } from './feature/profile/profile.component';
import { UserService } from './feature/profile/user.service';
import { RegisterComponent } from './feature/register/register.component';
import { SearchComponent } from './feature/search/search.component';
import { SpinnerComponent } from './feature/spinner/spinner.component';
import { BannerSliderComponent } from './home/banner-slider/banner-slider.component';
import { FooterComponent } from './home/footer/footer.component';
import { HeaderComponent } from './home/header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginUiComponent } from './home/login-ui/login-ui.component';
import { NavComponent } from './home/nav/nav.component';
import { ProductComponent } from './home/product/product.component';
import { httpInterceptProviders } from './http';
import { MaterialExampleModule } from './module/material.module';
import { ProductBestSellerComponent } from './product-best-seller/product-best-seller.component';
import { SharedService } from './service/shared.service';
import { ToastServiceService } from './service/toast-service.service';
import { ResizeChangeService } from './size-detector/resize-change.service';
import { SizeDetectorComponent } from './size-detector/size-detector.component';
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
