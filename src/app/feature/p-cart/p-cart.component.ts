import { NgCartCaculatorService } from './service/NgCartCaculatorService'
import { Component, Inject, OnInit } from '@angular/core'
import { SharedService } from 'src/app/shared.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { PPaymentComponent } from 'src/app/feature/p-payment/p-payment.component'
import { DialogService } from 'src/app/dialog.service'
import { Users } from 'src/app/model/user'
import { Router } from '@angular/router'
import { SpinnerService } from 'src/app/spinner.service'
import { Cart, cartItem, NgCartApiService, NgCartService } from './service'
import { ResizeChangeService } from 'src/app/size-detector/resize-change.service'
import { SCREEN_SIZE } from 'src/app/size-detector/size-detector.component'
import { ToastServiceService } from 'src/app/toast-service.service'
@Component({
  selector: 'app-p-cart',
  templateUrl: './p-cart.component.html',
  styleUrls: ['./p-cart.component.css']
})
export class PCartComponent implements OnInit {
  isTimeout = true
  cart: Cart
  isEmpty: boolean = false
  totalitemIncart: number
  itemSelected: number[] = []
  itemObjectSelected: cartItem[] = []
  displayedColumns: string[] = ['productItem.name', 'quantity', 'productPrice']
  checked: boolean = false
  sharedService: SharedService
  size: SCREEN_SIZE
  constructor (
    private cartservice: NgCartService,
    private _sharedService: SharedService,
    private dialogService: DialogService,
    private dialogRef: MatDialogRef<PCartComponent>,
    private resizeSvc: ResizeChangeService,
    private toastService: ToastServiceService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sharedService = _sharedService
    this.resizeSvc.onResize$.subscribe(x => {
      console.log(x)
      this.size = x
    })
  }

  ngOnInit (): void {
    this._sharedService.afterClick.subscribe((value?) => {
      if (value === 'refreshCart') {
        this.getCart()
      }
    })

    this.cartservice.getCartFromDB(this._sharedService.getUserFromCookie())
  }

  getCart (): void {
    this._sharedService.setUniqueItemNumber(
      this.cartservice.getCartFromLocalStorage().totalUniqueItems
    )
    this.cart = this.cartservice.getCartFromLocalStorage()
  }

  backToHome () {
    this.router.navigate([''])
    this.dialogRef.close()
  }

  goCheckout () {
    if (this.itemObjectSelected.length > 0) {
      this.cart.cartItem.forEach(x => (x.active = false))
      this.dialogService
        .openDialog(
          {
            height: '100%',
            width: '100%',
            disableClose: true,
            data: this.itemObjectSelected
          },
          PPaymentComponent
        )
        .subscribe(type => {
          if (type === 'closePayment') {
            // this.dialogRef.close('goInvoice')
          }
        })
      this.itemSelected = []
      this.itemObjectSelected = []
    } else {
      this.toastService.showError('Chưa có sản phẩm nào được chọn')
    }
  }

  getCalculatedValue (cart: cartItem) {
    return this._sharedService.getFormatCurrency(cart.productPrice)
  }

  callAPIChangeData (currentQuantity: number, itemId: number, active: boolean) {
    const cart: Cart = this.cartservice.getCartFromLocalStorage()
    const currentItem = cart.cartItem.find((i: cartItem) => i.id === itemId)

    this.cart = this.cartservice.updateCartQuantity({
      ...currentItem,
      id: itemId,
      payload: {
        quantity: currentQuantity,
        active: active
      }
    })
  }

  changeQuantity (currentQuantity: number, itemId: number, active: boolean) {
    if (currentQuantity < 1) {
      const listID = []
      listID.push(itemId)
      this.deleteItemById(listID)
    } else if (currentQuantity > 50) {
      this.toastService.showWarn('Giới hạn mua không lớn hơn 50')
    } else {
      this.callAPIChangeData(currentQuantity, itemId, active)
    }
  }

  updateQuantity ($event: any, itemId: number, active: boolean) {
    if (parseInt($event.target.value) < 1) {
      const listID = []
      listID.push(itemId)
      this.deleteItemById(listID)
    } else if (parseInt($event.target.value) > 50) {
      this.toastService.showWarn('Giới hạn mua không lớn hơn 50')
    } else {
      this.callAPIChangeData(parseInt($event.target.value), itemId, active)
    }
  }

  selectedItem (cartitem: cartItem) {
    const data = this.cart.cartItem.find(x => x.id == cartitem.id)
    data.active = !data.active
    if (data.active) {
      this.itemSelected.push(data.id)
      this.itemObjectSelected.push(data)
    } else {
      this.itemSelected = this.itemSelected.filter(x => x != data.id)
      this.itemObjectSelected = this.itemObjectSelected.filter(
        x => x.id != data.id
      )
    }

    console.log(this.itemObjectSelected)
  }

  deleteItemById (listId: any) {
    this.cart = this.cartservice.removeAllItem(listId)
  }
  deleteItemInCart () {
    if (this.itemObjectSelected.length > 0) {
      this.cart = this.cartservice.removeAllItem(this.itemSelected)
    } else {
      this.toastService.showError('Chưa có sản phẩm nào được chọn')
    }
  }

  onNoClick (): void {
    this.dialogRef.close()
  }
}
