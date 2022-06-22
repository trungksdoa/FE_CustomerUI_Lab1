import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/api/product/product';
import { ProductService } from 'src/app/api/product/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchMode:boolean
  public products: Product[];
  totalLength:any;
  page:number=1;
  constructor(private productService:ProductService,private route: ActivatedRoute) {
  }
  ngOnInit(){
    this.searchMode = this.route.snapshot.paramMap.has('keywword');
    this.route.paramMap.subscribe(()=>{
      const theKeyword: String = this.route.snapshot.paramMap.get('keyword')
      this.getAllProduct(theKeyword);
    })
  }
 public getAllProduct(theKeyword: String) {
    this.productService.searchProductByName(theKeyword).subscribe(
      (response: Product[]) => {
        this.products = response;
        this.totalLength=response.length;
        console.log(this.products);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
 }
}
