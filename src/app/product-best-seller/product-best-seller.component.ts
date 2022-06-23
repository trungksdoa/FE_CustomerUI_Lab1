import { HttpErrorResponse } from '@angular/common/http'
import { Input } from '@angular/core'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Product } from 'src/app/api/product/product'
import { ProductService } from 'src/app/api/product/product.service'

@Component({
  selector: 'app-product-best-seller',
  templateUrl: './product-best-seller.component.html',
  styleUrls: ['./product-best-seller.component.css']
})
export class ProductBestSellerComponent implements OnInit {
  @Input() products: Product[]
  constructor (private router: Router) {}
  ngOnInit () {}

  goToDetail (id: any) {
    this.router.navigate([`detail/${id}`])
  }

  slideConfig = {
    "slidesToShow": 4,
    "slidesToScroll": 1,
    "dots": true,
    "infinite": false,
    "responsive": [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
      
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        margin:100,
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  slickInit (e) {
    console.log('slick initialized')
  }

  breakpoint (e) {
    console.log('breakpoint')
  }

  afterChange (e) {
    console.log('afterChange')
  }

  beforeChange (e) {
    console.log('beforeChange')
  }
}
