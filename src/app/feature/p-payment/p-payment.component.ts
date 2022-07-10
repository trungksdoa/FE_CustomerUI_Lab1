import { Component, OnInit, Inject } from '@angular/core'
import { ThemePalette } from '@angular/material/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { Order } from 'src/app/model/Order'
import { Users } from 'src/app/model/user'
import { SharedService } from 'src/app/service/shared.service'
import { cartItem } from 'src/app/feature/p-cart/service'
import { OrderService } from './order.service'
import { DialogService } from 'src/app/service/dialog.service'

@Component({
  selector: 'app-p-payment',
  templateUrl: './p-payment.component.html',
  styleUrls: ['./p-payment.component.css']
})
export class PPaymentComponent implements OnInit {
  links = ['Thanh toán trả sau', 'Thanh toán trả trước']
  activeLink = this.links[0]
  background: ThemePalette = undefined
  active: String = ''
  cartItems: cartItem[] = []
  totalMoney: string
  clickEventSubscription: Subscription
  selected: Array<any> = []
  loading: boolean = false
  user: Users
  // citys = [
  //   {
  //     matp: 0,
  //     name: '',
  //     type: '',
  //     slug: '',
  //     quanhuyen: [
  //       {
  //         maqh: 0,
  //         name: '',
  //         type: '',
  //         phuongxa: [
  //           {
  //             xaid: 0,
  //             name: '',
  //             type: ''
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ]
  // wards = []
  // district = []
  orderForm: Order = {
    id: 0,
    orderItems: [],
    address2: '',
    userId: undefined,
    note: '',
    status: 0,
    totalAmount: 0,
    orderType: ''
  }

  constructor (
    private orderService: OrderService,
    private sharedService: SharedService,
    private router: Router,
    private dialogService: DialogService,
    public dialogRef: MatDialogRef<PPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.cartItems = [...data]
      this.totalMoney = this.caculatorTotal(data)
      this.user = this.sharedService.getUserFromCookie()
      // this.citysService.getCitys().subscribe((data: any) => {
      //   this.citys = data
      // })
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
  // onSelectChangeTP ($event: any): void {
  //   if ($event) {
  //     this.orderForm.city = $event.name
  //     this.district = $event.quanhuyen

  //     // this.clearSelectDistric()
  //   }
  // }
  // onSelectChangeQH ($event: any): void {
  //   if ($event) {
  //     this.orderForm.district = $event.name

  //     this.wards = $event.phuongxa
  //   }
  // }
  // onSelectChangePX ($event: any): void {
  //   if ($event) {
  //     this.orderForm.wards = $event.name
  //   }
  // }

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
    const error = { isEmpty: false }

    if (obj.address2.length === 0) {
      error.isEmpty = true
    }
    return error
  }

  //Set properties
  getOrderItem (value: Order) {
    const order_content: Order = {
      id: 0,
      orderItems: this.cartItems,
      userId: this.user,
      note: value.note,
      address2: value.address2,
      status: 1,
      totalAmount: 0,
      orderType: 'offline'
    }
    return order_content
  }

  //Submit form after click
  formSubmit () {
    if (this.isObjectEmpty(this.orderForm).isEmpty) {
      alert('Vui lòng nhập thông tin')
    } else {
      // console.log(this.getOrderItem(this.orderForm))
      this.orderService
        .addCartItem(this.getOrderItem(this.orderForm))
        .subscribe(data => {
          this.dialogRef.close('paymentSuccess')
          this.router.navigate(['profile']).then(() => {
            window.location.reload()
          })
        })
    }
  }

  existPayment () {
    this.dialogRef.close('closePayment')
  }

  changeLink (link: string) {
    this.activeLink = link
  }
}
