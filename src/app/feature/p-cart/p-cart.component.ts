import { NgCartCaculatorService } from './service/NgCartCaculatorService'
import { Component, Inject, OnInit } from '@angular/core'
import { SharedService } from 'src/app/service/shared.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { PPaymentComponent } from 'src/app/feature/p-payment/p-payment.component'
import { DialogService } from 'src/app/service/dialog.service'
import { Router } from '@angular/router'
import { Cart, cartItem, NgCartApiService, NgCartService } from './service'
import { ResizeChangeService } from 'src/app/size-detector/resize-change.service'
import { SCREEN_SIZE } from 'src/app/size-detector/size-detector.component'
import { ToastServiceService } from 'src/app/service/toast-service.service'
@Component({
  selector: 'app-p-cart',
  templateUrl: './p-cart.component.html',
  styleUrls: ['./p-cart.component.css']
})
export class PCartComponent implements OnInit {
  cart: Cart = {
    id: 0,
    cartItem: [],
    userId: undefined,
    TotalPrice: 0,
    isEmpty: false,
    totalUniqueItems: 0
  }
  defaultImage = 'https://www.placecage.com/1000/1000'
  totalMoney: number = 0
  itemSelected: number[] = []
  itemObjectSelected: cartItem[] = []
  displayedColumns: string[] = ['productItem.name', 'quantity', 'productPrice']
  sharedService: SharedService
  timestamp = new Date().getTime()
  constructor (
    private cartservice: NgCartService,
    private _sharedService: SharedService,
    private dialogService: DialogService,
    private dialogRef: MatDialogRef<PCartComponent>,
    private toastService: ToastServiceService,
    private cartProcess: NgCartCaculatorService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sharedService = _sharedService
  }

  ngOnInit (): void {
    this.getCart()
  }

  getlink (link: any) {
    if (this.timestamp) {
      return link + '?' + this.timestamp
    }
    return link
  }

  getCart (): void {
    this.cartservice
      .getAsyncCartFromDB(this._sharedService.getUserFromCookie())
      .subscribe(
        ({
          cartData,
          isError,
          message,
          uniqueItemInCart
        }: any) => {
          this.cart = cartData
          this.cartProcess.saveCartToLocalStorage(
            this.cartProcess.generatorCart(cartData, cartData.cartItem)
          )
          this.sharedService.setUniqueItemNumber(uniqueItemInCart)
          this.toastService.showSuccess(message);
        }
      )
    this.cart = this.cartservice.getCartFromLocalStorage()
  }

  getCalculatedValueCartItem (cart: cartItem) {
    return this._sharedService.getFormatCurrency(cart.productPrice)
  }

  getCalculatedValue (value: any) {
    return this._sharedService.getFormatCurrency(value)
  }

  callAPIChangeData (
    currentQuantity: number,
    itemId: number,
    parentID: number
  ) {
    this.cartservice
      .updateCartQuantity({
        payload: {
          itemId: itemId,
          quantityItemNumber: currentQuantity,
          parentID: {
            Id: parentID
          }
        }
      })
      .subscribe(
        ({ cartData, message }: { cartData: Cart; message: string }) => {
          this.cartProcess.saveCartToLocalStorage(
            this.cartProcess.generatorCart(cartData, cartData.cartItem)
          )

          this.cart = this.cartProcess.generatorCart(
            cartData,
            cartData.cartItem
          )

          this.sharedService.setUniqueItemNumber(cartData.cartItem.length)
          this.toastService.showSuccess(message)
        },
        error => {
          this.toastService.showError(error.error.message)
        }
      )
  }

  changeQuantity (currentQuantity: number, itemId: number, parentID: number) {
    if (currentQuantity < 1) {
      const listID = []
      listID.push(itemId)
      this.deleteItemIfQuantityChangeLowerThanOne(this.cart.id, listID)
    } else if (currentQuantity > 50) {
      this.toastService.showWarn('Giới hạn mua không lớn hơn 50')
    } else {
      this.callAPIChangeData(currentQuantity, itemId, parentID)
    }
  }

  updateQuantity ($event: any, itemId: number, parentID: number) {
    this.changeQuantity(parseInt($event.target.value), itemId, parentID)
  }

  selectedItem (cartitem: cartItem) {
    const data = this.cart.cartItem.find(x => x.id == cartitem.id)
    data.selected = !data.selected
    if (data.selected) {
      this.itemSelected.push(data.id)
      this.itemObjectSelected.push(data)
    } else {
      this.itemSelected = this.itemSelected.filter(x => x != data.id)
      this.itemObjectSelected = this.itemObjectSelected.filter(
        x => x.id != data.id
      )
    }
    this.totalMoney = this.itemObjectSelected.reduce(
      (total, item) => total + item.quantity! * item.productItem.price,
      0
    )
  }

  deleteItemIfQuantityChangeLowerThanOne (cartId: number, listId: any) {
    if (this.cartservice.removeAllItem(cartId, listId)) {
      this.getCart()
    }
  }
  deleteItemInCart () {
    if (this.itemObjectSelected.length > 0) {
      if (this.cartservice.removeAllItem(this.cart.id, this.itemSelected)) {
        this.getCart()
      }
    } else {
      this.toastService.showError('Chưa có sản phẩm nào được chọn')
    }
  }

  goCheckout () {
    if (this.itemObjectSelected.length > 0) {
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
            this.cart.cartItem.forEach(x => (x.selected = false))
            this.totalMoney = 0
            this.itemSelected = []
            this.itemObjectSelected = []
            this.dialogRef.close()
          }
        })
    } else {
      this.toastService.showError('Chưa có sản phẩm nào được chọn')
    }
  }

  backToHome () {
    this.router.navigate([''])
    this.dialogRef.close()
  }

  onNoClick (): void {
    this.dialogRef.close()
  }
}
