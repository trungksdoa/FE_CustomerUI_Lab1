import { SharedService } from 'src/app/service/shared.service'
import { Component, ElementRef, HostListener, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Product } from './api/product/product'
import { ProductService } from './api/product/product.service'
import { HttpErrorResponse } from '@angular/common/http'
import { NgCartService } from './feature/p-cart/service'
import { ResizeChangeService } from './size-detector/resize-change.service'
import { SCREEN_SIZE } from './size-detector/size-detector.component'
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public products: Product[]
  loopingStatus = true
  constructor (
    public dialog: MatDialog,
    private cartService: NgCartService,
    private shared: SharedService,
    private productService: ProductService,
    private elementRef: ElementRef,
    private resizeSvc: ResizeChangeService,
    private router: Router
  ) {}

  ngOnInit (): void {
    this.getAllProduct()
    this.checkCart(this.cartService, this.shared.getUserFromCookie())
    this.shared.isLoggedIn().subscribe(isLoggedIn => isLoggedIn ? this.detectLocalStorage() : "")
  }
  checkCart (cartService: any, user: any) {
    cartService.isLocalCartExist().subscribe((isExits: any) => {
      if (!isExits) {
        cartService.getCartFromDB(user)
      }
    })
  }
  detectLocalStorage () {
    const check = this.checkCart
    const service = this.cartService
    const user = this.shared.getUserFromCookie()
    window.addEventListener('storage', function (e) {
      check(service, user)
    })
  }
  getAllProduct (): void {
    this.productService.getAllProduct().subscribe(
      (response: Product[]) => {
        this.products = response
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }
}
