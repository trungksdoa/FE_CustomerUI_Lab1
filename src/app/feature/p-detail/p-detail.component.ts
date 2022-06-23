import { SharedService } from 'src/app/shared.service'
import { ProductService } from 'src/app/api/product/product.service'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Product } from 'src/app/api/product/product'
import { NgCartService } from 'src/app/feature/p-cart/service/NgCartService'

@Component({
  selector: 'app-p-detail',
  templateUrl: './p-detail.component.html',
  styleUrls: ['./p-detail.component.css']
})
export class PDetailComponent implements OnInit {
  public product: Product

  constructor (
    private productService: ProductService,
    private cartService: NgCartService,
    private route: ActivatedRoute,
    private shared: SharedService,
  ) {}

  ngOnInit (): void {
    this.findProductById(parseInt(this.route.snapshot.paramMap.get('id')))
  }

  formatCurrency (value: number) {
    return this.shared.getFormatCurrency(value)
  }
  public addCartItem (product: Product) {
    this.cartService.addToCart(product)
  }
  public findProductById (productId: number) {
    this.productService
      .getOneProduct(productId)
      .subscribe((product: Product) => {
        this.product = product
      })
  }
}
