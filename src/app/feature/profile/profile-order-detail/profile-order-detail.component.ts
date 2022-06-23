import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { orderItems, orderManagement } from 'src/app/model/Order'
import { SharedService } from 'src/app/shared.service'
import { NgCartService } from '../../p-cart/service'

@Component({
  selector: 'app-profile-order-detail',
  templateUrl: './profile-order-detail.component.html',
  styleUrls: ['./profile-order-detail.component.css']
})
export class ProfileOrderDetailComponent implements OnInit {
  orderItems: orderItems[]
  sharedService: SharedService
  constructor (
    private _sharedService: SharedService,
    public dialogRef: MatDialogRef<ProfileOrderDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: orderManagement,
    private _cartService: NgCartService,
  ) {
    this.sharedService = _sharedService
  }

  ngOnInit (): void {
    if (this.data) {
      this.orderItems = this.data.orderItems
    }
    // console.log(this.data)
  }

  // reOrder (item: any) {
  //   this._cartService.addToCart(item.productItem)
  // }

  onNoClick () {
    this.dialogRef.close()
  }
}
