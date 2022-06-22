import { HttpErrorResponse } from '@angular/common/http'
import { Input } from '@angular/core'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Product } from 'src/app/api/product/product'
import { ProductService } from 'src/app/api/product/product.service'
import { NgCartService } from 'src/app/feature/p-cart/service/NgCartService'
import { SharedService } from 'src/app/shared.service'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  public searchMode: boolean
  public cateMode: boolean
  @Input() products: Product[]
  totalLength: any
  page: number = 1
  isLogin = false
  constructor (
    private productService: ProductService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private cartService: NgCartService,
    private router: Router
  ) {}

  ngOnInit () {
    this.sharedService.getUserFromCookie() ? (this.isLogin = true) : ''
    this.route.paramMap.subscribe(() => {
      this.getAllProduct()
    })
  }

  public addCartItem (product: Product) {
    this.cartService.addToCart(product)
  }

  public getAllProduct () {
    this.searchMode = this.route.snapshot.paramMap.has('keyword')
    this.cateMode = this.route.snapshot.paramMap.has('id')
    if (this.searchMode) {
      this.listSearch()
    } else if (this.cateMode) {
      this.listCategory()
    }
  }
  listCategory () {
    const cateMode: String = this.route.snapshot.paramMap.get('id')
    this.productService.getProductByCateId(cateMode).subscribe(
      (response: Product[]) => {
        this.products = response
        this.totalLength = response.length
        console.log(this.products)
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }
  listSearch () {
    const searchMode: String = this.route.snapshot.paramMap.get('keyword')
    this.productService.searchProductByName(searchMode).subscribe(
      (response: Product[]) => {
        this.products = response
        this.totalLength = response.length
        console.log(this.products)
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }
  goToDetail (id: any) {
    this.router.navigate([`detail/${id}`])
  }
}
