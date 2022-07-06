import { SharedService } from 'src/app/service/shared.service'
import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Product } from './api/product/product'
import { ProductService } from './api/product/product.service'
import { HttpErrorResponse } from '@angular/common/http'
import { Cart, NgCartService, cartInit } from './feature/p-cart/service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  products: Product[] = []
  childCart = {
    id: 0,
    cartItem: [],
    userId: undefined,
    TotalPrice: 0,
    isEmpty: false,
    totalUniqueItems: 0
  }
  login = false
  constructor (
    public dialog: MatDialog,
    private cartService: NgCartService,
    private shared: SharedService,
    private productService: ProductService
  ) {}

  ngOnInit (): void {
    this.getAllProduct()
    this.shared.isLoggedIn().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.detectLocalStorage()
      } else {
        this.cartService.deleteCartLocal()
      }
    })
  }
  checkCart (shared: SharedService, cartService: NgCartService, user: any) {
    if (user) {
      cartService.getCartLocal().subscribe(data => {
        shared.callFunctionByClick({ type: 'check', data: data })
      })
    } else {
      cartService.deleteCartLocal()
    }
  }
  detectLocalStorage () {
    const check = this.checkCart
    const service = this.cartService
    const user = this.shared.getUserFromCookie()
    const shared = this.shared
    window.addEventListener('storage', function (e) {
      check(shared, service, user)
    })
    if (service.getCartLocalSimple()) {
      check(shared, service, user)
    }
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
