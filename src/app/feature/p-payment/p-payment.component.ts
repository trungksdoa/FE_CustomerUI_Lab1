import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'
import { SharedService } from 'src/app/shared.service'
import { Subscription } from 'rxjs'
import { OrderService } from 'src/app/feature/p-payment/order.service'
import { Order } from 'src/app/model/Order'
import { Users } from 'src/app/model/user'
import { CityService } from 'src/app/feature/p-payment/citys.service'
import { Router } from '@angular/router'
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog'
import { ThemePalette } from '@angular/material/core'
import { cartItem } from '../p-cart/service'
declare var bootstrap: any

interface IPaymentFormValue extends Order {
  xungho: ''
}
@Component({
  selector: 'app-p-payment',
  templateUrl: './p-payment.component.html',
  styleUrls: ['./p-payment.component.css']
})
export class PPaymentComponent implements OnInit {
  links = ['Thanh toán trả sau', 'Thanh toán trả trước']
  activeLink = this.links[0]
  background: ThemePalette = undefined
  // Access ng-select
  // Call to clear

  active: String = ''
  cartItems: cartItem[] = []
  totalMoney: string
  clickEventSubscription: Subscription
  selected: Array<any> = []
  loading: boolean = false
  citys = [
    {
      matp: 0,
      name: '',
      type: '',
      slug: '',
      quanhuyen: [
        {
          maqh: 0,
          name: '',
          type: '',
          phuongxa: [
            {
              xaid: 0,
              name: '',
              type: ''
            }
          ]
        }
      ]
    }
  ]
  wards = []
  district = []
  orderForm: IPaymentFormValue = {
    id: 0,
    orderItems: [],
    phoneNumber: '',
    fullname: '',
    address: '',
    userId: undefined,
    city: '',
    wards: '',
    district: '',
    note: '',
    status: 0,
    xungho: '',
    totalAmount: 0
  }
  checkObject = JSON.stringify(this.orderForm, undefined, 2)

  constructor (
    private sharedService: SharedService,
    private orderService: OrderService,
    private citysService: CityService,
    public dialogRef: MatDialogRef<PPaymentComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.cartItems = [...data]
      this.totalMoney = this.caculatorTotal(data)
      this.citysService.getCitys().subscribe((data: any) => {
        this.citys = data
      })
    }
  }

  ngOnInit (): void {}

  /*
   *
   *
   *Select controll
   *
   *
   */
  onSelectChangeTP ($event: any): void {
    if ($event) {
      this.orderForm.city = $event.name
      this.district = $event.quanhuyen

      // this.clearSelectDistric()
    }
  }
  onSelectChangeQH ($event: any): void {
    if ($event) {
      this.orderForm.district = $event.name

      this.wards = $event.phuongxa
    }
  }
  onSelectChangePX ($event: any): void {
    if ($event) {
      this.orderForm.wards = $event.name
    }
  }

  /*
   *
   *
   *Caculator controll
   *
   *
   */

  getEmptyList () {
    alert('No item selected to payment')
    this.active = ''
  }

  caculatorTotal (itemPayment: cartItem[]) {
    const amount = itemPayment.reduce((acc, cv) => {
      return acc + cv.productPrice
    }, 0)
    return this.sharedService.getFormatCurrency(amount)
  }

  /*
   *
   *
   *Form controll
   *
   *
   */
  //CaculatorTotal
  getCalculatedValue (cart: cartItem) {
    return this.sharedService.getFormatCurrency(cart.productPrice)
  }

  isObjectEmpty (obj: Order) {
    console.log(obj)
    const error = { isEmpty: false }

    if (obj.address.length === 0) {
      error.isEmpty = true
    } else if (obj.city.length === 0) {
      error.isEmpty = true
    } else if (obj.district.length === 0) {
      error.isEmpty = true
    } else if (obj.fullname.length === 0) {
      error.isEmpty = true
    } else if (obj.phoneNumber.length === 0) {
      error.isEmpty = true
    } else if (obj.wards.length === 0) {
      error.isEmpty = true
    }

    return error
  }

  //Set properties
  getOrderItem (value: Order, xungho: string) {
    let user = new Users(1, '', '', '', '', '')
    this.sharedService.isLoggedIn().subscribe(isLoggin => {
      if (isLoggin) {
        user = this.sharedService.getUserFromCookie()
      } else {
        user = null
      }
    })
    const order_content: Order = {
      id: 0,
      orderItems: this.cartItems,
      userId: user,
      city: value.city,
      wards: value.wards,
      district: value.district,
      note: value.note,
      address: value.address,
      fullname: xungho + ' ' + value.fullname,
      phoneNumber: value.phoneNumber,
      status: 1,
      totalAmount: 0
    }
    return order_content
  }

  //Submit form after click
  formSubmit () {
    if (this.isObjectEmpty(this.orderForm).isEmpty) {
      alert('Vui lòng nhập thông tin')
    } else {
      this.orderForm.address =
        this.orderForm.address +
        ', ' +
        this.orderForm.wards +
        ', ' +
        this.orderForm.district +
        ', ' +
        this.orderForm.city
      this.orderService
        .addCartItem(this.getOrderItem(this.orderForm, this.orderForm.xungho))
        .subscribe(data => {
          this.dialogRef.close('closePayment')
        })
    }
  }

  existPayment(){
    this.dialogRef.close('closePayment')
  }

  paymentOnline (link: string) {
    if (link === 'Thanh toán trả trước') {
      this.sharedService.callFunctionByClick()
    }
    this.activeLink = link
  }
}
