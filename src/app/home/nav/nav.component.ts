import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/api/category/category';
import { CategoryService } from 'src/app/api/category/category.service';
import { Product } from 'src/app/api/product/product';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public categorys: Category[]
  
  constructor (
    private categoryService: CategoryService,
    private service: SharedService
  ) {}

  ngOnInit () {
    this.getAllCategory()
  }
  public getShare (): void {
    this.service.openSidePayment2()
  }
  public getAllCategory (): void {
    this.categoryService.getAllCategory().subscribe(
      (response: Category[]) => {
        this.categorys = response
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }
}
