import { SharedService } from 'src/app/shared.service'

import { Order, orderManagement } from 'src/app/model/Order'
import { OrderService } from 'src/app/feature/p-payment/order.service'
import { Component, OnInit } from '@angular/core'
import { DialogService } from 'src/app/dialog.service'
import { ProfileOrderDetailComponent } from '../profile-order-detail/profile-order-detail.component'

@Component({
  selector: 'app-profile-order',
  templateUrl: './profile-order.component.html',
  styleUrls: ['./profile-order.component.css']
})
export class ProfileOrderComponent implements OnInit {
  orders: orderManagement[] = []
  constructor (
    private _OrderService: OrderService,
    private _sharedService: SharedService,
    private _dialogService: DialogService
  ) {}

  ngOnInit (): void {
    this._OrderService
      .getOrder(this._sharedService.getUserFromCookie().id)
      .subscribe(items => {
        items.forEach(item => {
          item.createAt = new Date(item.createAt).toUTCString()
          item.lastUpdated = new Date(item.lastUpdated).toUTCString()
        })
        this.orders = items
      })
  }

  openOrderDetail(order:orderManagement): void {

    console.log(order)
    this._dialogService.openDialog(        {
      // height: '100%',
      width: '100%',
      // disableClose: true,
      data: order
    },ProfileOrderDetailComponent).subscribe();
  }

  formatCurrency(value:number){
    return this._sharedService.getFormatCurrency(value)
  }
}
