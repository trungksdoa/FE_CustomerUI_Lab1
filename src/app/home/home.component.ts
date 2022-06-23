import { Component, OnInit } from '@angular/core';
import { Product } from '../api/product/product';
import { ProductService } from '../api/product/product.service';
import { HttpErrorResponse } from '@angular/common/http'
import { ResizeChangeService } from '../size-detector/resize-change.service';
import { SCREEN_SIZE } from '../size-detector/size-detector.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public products: Product[]

  constructor(private productService: ProductService) {

  }
  ngOnInit(): void {
    this.getAllProduct()
  }
  public getAllProduct():void{
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




}
