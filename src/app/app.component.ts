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
  constructor (
    public dialog: MatDialog,
    private productService: ProductService
  ) {}

  ngOnInit (): void {
    this.getAllProduct()
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
