import { async, debounceTime, map, Observable, startWith } from 'rxjs'
import { Input, Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FormControl } from '@angular/forms'

import { SharedService } from 'src/app/shared.service'
import { DialogService } from 'src/app/dialog.service'
import { Product } from 'src/app/api/product/product'
import { PCartComponent } from 'src/app/feature/p-cart/p-cart.component'
import { ToastServiceService } from 'src/app/toast-service.service'
import { Cart } from 'src/app/model/cart'
import { ResizeChangeService } from 'src/app/size-detector/resize-change.service'
import { SCREEN_SIZE } from 'src/app/size-detector/size-detector.component'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() products: Product[]
  myControl = new FormControl('')
  filteredOptions: Observable<Product[]>
  searchMode: boolean
  isLogin: Boolean = false
  itemCount: number = 0
  name: String = ''
  size: SCREEN_SIZE
  constructor (
    private sharedService: SharedService,
    private toast: ToastServiceService,
    private router: Router,
    private dialogService: DialogService,
    private resizeSvc: ResizeChangeService
  ) {
    // đăng ký luồng thay đổi size
    this.resizeSvc.onResize$.subscribe(x => {
      this.size = x
    })
  }

  ngOnInit (): void {
    this.sharedService.isLoggedIn().subscribe(data => {
      console.log(this.sharedService.getUserFromCookie());
      this.isLogin = data
      this.sharedService.afterClick.subscribe(() => {
        this.name = this.sharedService.getUserFromCookie().name
      })
      this.sharedService.getUniqueItemInCart().subscribe(uniqueItemInCart => {
        this.itemCount = uniqueItemInCart
      })
    })

    // if (this.sharedService.getUserFromCookie()) {
    //   this.sharedService.afterClick.subscribe(() => {
    //     this.name = this.sharedService.getUserFromCookie().name
    //   })
    //   this.sharedService.getUniqueItemInCart().subscribe(uniqueItemInCart => {
    //     this.itemCount = uniqueItemInCart
    //   })
    // }
    this.itemCount = 0
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
    this.router.navigateByUrl(`/product/search/${value}`)
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
      alert('Please login')
    }
  }
  CartIndentify: Cart = {
    id: 0,
    lastUpdated: '',
    createAt: '',
    cartItem: [],
    userId: null,
    TotalPrice: 0,
    isEmpty: false,
    totalUniqueItems: 0
  }
  goProfile(){
    this.router.navigate(['profile'])
  }
  logOut () {
    this.sharedService.deleteCookie('user')
    this.sharedService.deleteLocal('localCart')
    this.router.navigate(['login'])
    this.sharedService.isLoggin(false)
    this.sharedService.setUniqueItemNumber(0)
  }
}
