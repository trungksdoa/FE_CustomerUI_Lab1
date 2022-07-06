import { Component, OnInit, Input } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Router } from '@angular/router'
import { Observable, startWith, debounceTime, map } from 'rxjs'
import { Product } from 'src/app/api/product/product'

import { PCartComponent } from 'src/app/feature/p-cart/p-cart.component'
import { Cart, cartInit} from 'src/app/feature/p-cart/service'
import { DialogService } from 'src/app/service/dialog.service'
import { SharedService } from 'src/app/service/shared.service'
import { ToastServiceService } from 'src/app/service/toast-service.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() products: Product[] = []
  childCart: Cart = {
    id: 0,
    cartItem: [],
    userId: undefined,
    TotalPrice: 0,
    isEmpty: false,
    totalUniqueItems: 0
  }
  myControl = new FormControl('')
  filteredOptions: Observable<Product[]>
  searchMode: boolean
  login = false
  constructor (
    private sharedService: SharedService,
    private toast: ToastServiceService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  ngOnInit (): void {
    this.sharedService.isLoggedIn().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.login = isLoggedIn
      }
    })
    this.sharedService.afterClick.subscribe(data => {
      if (data) {
        if (data.type === 'check') {
          this.childCart = data.data
        }
      }
    })
    setInterval(
      () => (this.sharedService.getUserFromCookie() ? '' : this.logOut()),
      2000
    )
    this.getAllProduct()
  }

  public getAllProduct (): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      map(value => this._filter(value || ''))
    )
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
      this.toast.showWarn('Vui lòng đăng nhập !')
      this.router.navigate(['login'])
    }
  }

  goProfile () {
    console.log('profile')
    this.router.navigate(['profile'])
  }
  logOut () {
    this.sharedService.deleteCookie('user')
    this.sharedService.deleteLocal('localCart')
    this.router.navigate(['login'])
    this.sharedService.callFunctionByClick({ type: 'check', data: cartInit })
    this.login = false
  }
}
