import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnInit, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Product } from 'src/app/api/product/product'
import { ProductService } from 'src/app/api/product/product.service'
import { NgCartService } from 'src/app/feature/p-cart/service'
import { SharedService } from 'src/app/service/shared.service'
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  public searchMode: boolean
  public cateMode: boolean
  @Input() products: Product[]
  defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBZ98r5TmClIzjTCeDzUeCgNSwE5BbgFm4oA&usqp=CAU"
  totalLength: any
  page: number = 1
  isLogin = false
  timestamp = new Date().getTime()
  constructor (
    private productService: ProductService,
    private _sharedService: SharedService,
    private route: ActivatedRoute,
    private cartService: NgCartService,
    private router: Router
  ) {}

  ngOnInit () {
    this._sharedService.getUserFromCookie() ? (this.isLogin = true) : ''
    this.route.paramMap.subscribe(() => {
      this.getAllProduct()
    })
  }

  addCartItem (product: Product) {
    this.cartService.addToCart(product)
  }

  getlink(link:any){
    if (this.timestamp) {
      return link + '?' + this.timestamp
    }
    return link
  }

  getAllProduct () {
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
