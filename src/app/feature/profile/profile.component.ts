import { Component, OnInit } from '@angular/core'
import { orderManagement } from 'src/app/model/Order'
import { DialogService } from 'src/app/service/dialog.service'
import { SharedService } from 'src/app/service/shared.service'
import { OrderService } from '../p-payment/order.service'
import { ProfileOrderDetailComponent } from './profile-order-detail/profile-order-detail.component'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  types = {
    home: 'home',
    setting: 'setting',
    shopping_cart: 'shopping_cart'
  }
  menus: any[] = [
    {
      icon: 'home',
      type: this.types.home,
      name: 'Thông tin chung'
    },
    {
      icon: 'settings',
      type: this.types.setting,
      name: 'Tài Khoản Của Tôi'
    },
    {
      icon: 'shopping_cart',
      type: this.types.shopping_cart,
      name: 'Tất cả đơn hàng'
    }
  ]
  orders: orderManagement[] = []
  constructor (
    private orderService: OrderService,
    private _sharedService: SharedService,
    private _dialogService: DialogService
  ) {}

  ngOnInit (): void {
    this.orderService
      .getTop5OrderByUserId(this._sharedService.getUserFromCookie().id)
      .subscribe(items => {
        this.orders = items
      })
  }

  pages: string = 'home'

  onClick (item: string) {
    console.log(item)

    this.pages = item
  }

  checkActive (item: string) {
    if (this.pages === item) {
      return 'active'
    } else {
      return ''
    }
  }
  openOrderDetail (order: orderManagement): void {
    this._dialogService
      .openDialog(
        {
          // height: '100%',
          width: '100%',
          // disableClose: true,
          data: order
        },
        ProfileOrderDetailComponent
      )
      .subscribe()
  }
  formatCurrency (value: number) {
    return this._sharedService.getFormatCurrency(value)
  }
}
