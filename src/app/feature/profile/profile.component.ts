import { SharedService } from 'src/app/shared.service'
import { orderManagement } from 'src/app/model/Order'
import { OrderService } from 'src/app/feature/p-payment/order.service'
import { Component, OnInit } from '@angular/core'
import { DialogService } from 'src/app/dialog.service'
import { ProfileOrderDetailComponent } from './profile-order-detail/profile-order-detail.component'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  menus: any[] = [
    {
      icon: 'home',
      type:"home",
      name: 'Thông tin chung'
    },
    {
      icon: 'settings',
      type:"setting",
      name: 'Tài Khoản Của Tôi'
    },
    {
      icon: 'shopping_cart',
      type:"shopping_cart",
      name: 'Tổng Đơn Hàng'
    }
  ]
  sharedService: SharedService
  orders: orderManagement[] = []
  constructor (
    private orderService: OrderService,
    private _sharedService: SharedService,
    private _dialogService: DialogService
  ) {
    this.sharedService = _sharedService
  }

  ngOnInit (): void {
    this.orderService
      .getTop5OrderByUserId(this._sharedService.getUserFromCookie().id)
      .subscribe(items => {
        items.forEach(item => {
          item.createAt = new Date(item.createAt).toUTCString()
          item.lastUpdated = new Date(item.lastUpdated).toUTCString()
        })
        this.orders = items
      })
  }


  pages: string = 'Thông tin chung'


  onClick (item: any) {
    this.pages = item
  }

  openOrderDetail (order: orderManagement): void {
    console.log(order)
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
}
