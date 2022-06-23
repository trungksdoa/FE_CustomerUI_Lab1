import { SharedService } from 'src/app/shared.service'
import { Component, ElementRef, HostListener, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription, interval } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import { Product } from './api/product/product'
import { ProductService } from './api/product/product.service'
import { HttpErrorResponse } from '@angular/common/http'
import { Cart, NgCartService } from './feature/p-cart/service'
import { ResizeChangeService } from './size-detector/resize-change.service'
import { SCREEN_SIZE } from './size-detector/size-detector.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public products: Product[]

  constructor (
    public dialog: MatDialog,
    private cartService: NgCartService,
    private shared: SharedService,
    private productService: ProductService,
    private elementRef: ElementRef,
    private resizeSvc: ResizeChangeService
  ) {
    // shared.getUserFromCookie() ? this.getMiniCart() : ''
  }

  getMiniCart () {}
  ngOnInit (): void {
    if (this.shared.getUserFromCookie()) {
      this.cartService.getCartFromDB(this.shared.getUserFromCookie())
    } else {
      this.shared.setUniqueItemNumber(
        this.cartService.getCartFromLocalStorage().totalUniqueItems
      )
    }
    this.getAllProduct()
    // this.shared.afterClick.subscribe(() => {
    //   this.shared.getUser() ? this.getMiniCart() : ''
    // })
  }
  getAllProduct (): void {
    this.productService.getAllProduct().subscribe(
      (response: Product[]) => {
        this.products = response
        console.log(this.products)
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

  prefix = 'is-'
  sizes = [
    {
      id: SCREEN_SIZE.XS,
      name: 'xs',
      css: `d-block d-sm-none`
    },
    {
      id: SCREEN_SIZE.SM,
      name: 'sm',
      css: `d-none d-sm-block d-md-none`
    },
    {
      id: SCREEN_SIZE.MD,
      name: 'md',
      css: `d-none d-md-block d-lg-none`
    },
    {
      id: SCREEN_SIZE.LG,
      name: 'lg',
      css: `d-none d-lg-block d-xl-none`
    },
    {
      id: SCREEN_SIZE.XL,
      name: 'xl',
      css: `d-none d-xl-block`
    }
  ]

  @HostListener('window:resize', [])
  private onResize () {
    this.detectScreenSize()
  }

  ngAfterViewInit () {
    this.detectScreenSize()
  }

  private detectScreenSize () {
    const currentSize = this.sizes.find(x => {
      // lấy element HTML
      const el = this.elementRef.nativeElement.querySelector(
        `.${this.prefix}${x.id}`
      )
      console.log(el)
      // kiểm tra giá trị thuộc tính hiển thị của nó
      const isVisible = window.getComputedStyle(el).display != 'none'

      return isVisible
    })

    this.resizeSvc.onResize(currentSize.id)
  }
}
