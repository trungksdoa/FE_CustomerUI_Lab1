import { Component, OnInit, Input } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Router } from '@angular/router'
import { Observable, startWith, debounceTime, map } from 'rxjs'
import { Product } from 'src/app/api/product/product'

import { PCartComponent } from 'src/app/feature/p-cart/p-cart.component'
import { NgCartApiService, NgCartService } from 'src/app/feature/p-cart/service'
import { DialogService } from 'src/app/service/dialog.service'
import { SharedService } from 'src/app/service/shared.service'
import { ToastServiceService } from 'src/app/service/toast-service.service'
import { share } from 'rxjs/operators'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() products: Product[] = []
  myControl = new FormControl('')
  filteredOptions: Observable<Product[]>
  searchMode: boolean
  loggedIn$: Observable<boolean>
  miniBadge: number = 0
  constructor (
    private sharedService: SharedService,
    private toast: ToastServiceService,
    private cartAPI: NgCartApiService,
    private cartService: NgCartService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  ngOnInit (): void {
    this.loggedIn$ = this.sharedService.isLoggedIn().pipe(share())

    this.loggedIn$.subscribe(result => {
      if (result) {
        this.getMiniCart()
      }
    })

    this.getAllProduct()
  }

  public getAllProduct (): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      map(value => this._filter(value || ''))
    )
  }

  getMiniCart () {
    this.sharedService.getAsyncUserFromCookie().subscribe(result => {
      if (result) {
        setInterval(() => {
          this.cartService.getMiniCart().subscribe(
            data => {
              this.miniBadge = data
            },
            error => {
              this.cartAPI
                .getMiniCart(this.sharedService.getUserFromCookie().id + '')
                .subscribe(data => {
                  this.miniBadge = data.uniqueItemInCart
                  this.sharedService.setLocal('matBadge', data.uniqueItemInCart)
                })
            }
          )
        }, 1000)
      } else {
        this.sharedService.setLocal('matBadge', 0)
      }
    })
  }
  private _filter (value: string): Product[] {
    const filterValue = value.toLowerCase()
    return this.products.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    )
  }

  doSearch (value: String): void {
    debounceTime(1000)
    this.router.navigateByUrl(`product/search/${value}`)
  }

  openCart (): void {
    if (this.sharedService.getUserFromCookie()) {
      this.dialogService
        .openDialog(
          {
            width: '90vw', //sets width of dialog
            height: '100%', //sets width of dialog
            maxWidth: '100vw', //overrides default width of dialog
            maxHeight: '100vh', //overrides default height of dialog
            // disableClose:true,
            data: { name: 'trung' }
          },
          PCartComponent
        )
        .subscribe(type => {})
    } else {
      this.router.navigate(['Login']).then(()=>{
        this.toast.showWarn('Vui lòng đăng nhập !')
      })
    }
  }

  goProfile () {
    this.router.navigate(['profile'])
  }
  logOut () {
    this.sharedService.deleteAfterLogout();
    this.getMiniCart()
    this.router.navigate(['Login']).then(()=>{
      this.toast.showSuccess("Đăng xuất trái đất thành công")
    })
  }
}
