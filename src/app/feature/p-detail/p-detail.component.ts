import { SharedService } from 'src/app/service/shared.service'
import { ProductService } from 'src/app/api/product/product.service'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Product } from 'src/app/api/product/product'
import { NgCartService } from 'src/app/feature/p-cart/service/NgCartService'

@Component({
  selector: 'app-p-detail',
  templateUrl: './p-detail.component.html',
  styleUrls: ['./p-detail.component.css']
})
export class PDetailComponent implements OnInit {
  public product: Product = {
    id: 0,
    name: '',
    description: '',
    imageurl: '',
    price: 0,
    catagory: undefined
  }
  defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBZ98r5TmClIzjTCeDzUeCgNSwE5BbgFm4oA&usqp=CAU"
  timestamp = new Date().getTime()
  constructor (
    private productService: ProductService,
    private cartService: NgCartService,
    private route: ActivatedRoute,
    private router: Router,
    private shared: SharedService
  ) {}

  ngOnInit (): void {
    this.findProductById(parseInt(this.route.snapshot.paramMap.get('id')))
  }

  formatCurrency (value: number) {
    return this.shared.getFormatCurrency(value)
  }
  addCartItem (product: Product) {
    this.cartService.addToCart(product)
  }
  findProductById (productId: number) {
    this.productService.getOneProduct(productId).subscribe(
      ({
        data,
        isError,
        message
      }: {
        isError: boolean
        data: Product
        message: string
      }) => {
        this.product = data
      },
      responeError => {
        if (responeError.error.isError) {
          if (responeError.error.message === 'Không tìm thấy sản phẩm') {
            this.router.navigate(['404'])
          }
        }
      }
    )
  }
  getlink (link: any) {
    if (this.timestamp) {
      return link + '?' + this.timestamp
    }
    return link
  }
}
