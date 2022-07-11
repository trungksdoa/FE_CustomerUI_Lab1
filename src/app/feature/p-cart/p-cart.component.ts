import { NgCartCaculatorService } from './service/NgCartCaculatorService'
import { Component, Inject, OnInit } from '@angular/core'
import { SharedService } from 'src/app/service/shared.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { PPaymentComponent } from 'src/app/feature/p-payment/p-payment.component'
import { DialogService } from 'src/app/service/dialog.service'
import { Router } from '@angular/router'
import { Cart, cartItem, NgCartService, cartInit } from './service'
import { ToastServiceService } from 'src/app/service/toast-service.service'

@Component({
  selector: 'app-p-cart',
  templateUrl: './p-cart.component.html',
  styleUrls: ['./p-cart.component.css']
})
export class PCartComponent implements OnInit {
  cart: Cart = cartInit
  isEmpty: boolean = false
  isLoaded: boolean = true
  defaultImage =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBZ98r5TmClIzjTCeDzUeCgNSwE5BbgFm4oA&usqp=CAU'
  totalMoney: number = 0
  itemSelected: number[] = []
  itemObjectSelected: cartItem[] = []
  timestamp = new Date().getTime()
  emptyMessage = ''
  constructor (
    private cartservice: NgCartService,
    private _sharedService: SharedService,
    private dialogService: DialogService,
    private dialogRef: MatDialogRef<PCartComponent>,
    private toastService: ToastServiceService,
    private cartProcess: NgCartCaculatorService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit () {
    this.getCart()
  }

  getlink (link: any) {
    if (this.timestamp) {
      return link + '?' + this.timestamp
    }
    return link
  }

  getCart () {
    this.getPromiseCart().then(
      ({
        cartData,
        isError,
        message,
        uniqueItemInCart
      }: {
        uniqueItemInCart: number
        cartData: Cart
        isError: boolean
        message: string
      }) => {
        this.cart = this.cartProcess.generatorCart(cartData, cartData.cartItem)
        this.isEmpty = uniqueItemInCart === 0
        this.isLoaded = false
      }
    )
  }

  getPromiseCart (): Promise<any> {
    const service = this.cartservice
    const shared = this._sharedService
    return new Promise(resolve => {
      service
        .getAsyncCartFromDB(shared.getUserFromCookie())
        .subscribe((data: any) => {
          resolve(data)
        })
    })
  }

  getCalculatedValueCartItem (cart: cartItem) {
    return this._sharedService.getFormatCurrency(cart.productPrice)
  }

  getCalculatedValue (value: any) {
    return this._sharedService.getFormatCurrency(value)
  }

  // callAPIChangeData (
  //   currentQuantity: number,
  //   itemId: number,
  //   parentID: number
  // ) {
  //   this.cartservice
  //     .updateCartQuantity({
  //       payload: {
  //         itemId: itemId,
  //         quantityItemNumber: currentQuantity,
  //         parentID: {
  //           Id: parentID
  //         }
  //       }
  //     })
  //     .subscribe(
  //       ({
  //         cartData,
  //         message,
  //         uniqueItemInCart
  //       }: {
  //         cartData: Cart
  //         message: string
  //         uniqueItemInCart: number
  //       }) => {
  //         this.cart = this.cartProcess.generatorCart(
  //           cartData,
  //           cartData.cartItem
  //         )
  //         this.cartProcess.saveBadge(uniqueItemInCart)
  //         this.toastService.showSuccess(message)
  //       },
  //       error => {
  //         this.toastService.showError(error.error.message)
  //       }
  //     )
  // }

  changeQuantity (currentQuantity: number, itemId: number, parentID: number) {
    if (currentQuantity < 1) {
      const listID = []
      listID.push(itemId)
      this.deleteItemIfQuantityChangeLowerThanOne(listID)
    } else if (currentQuantity > 50) {
      this.toastService.showWarn('Giới hạn mua không lớn hơn 50')
    } else {
      this.cartservice
        .callAPIChangeData(currentQuantity, itemId, parentID)
        .then(result => {
          const cartResult: Cart = result.cartData
          if (Object.keys(result).length) {
            this.isEmpty = result.uniqueItemInCart === 0

            this.cart = cartResult
          }
        })
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

  deleteItemIfQuantityChangeLowerThanOne (listId: any) {
    this.cartservice.removeAllItem(this.cart.id, listId).then(result => {
      if (Object.keys(result).length) {
        this.isEmpty = result.uniqueItemInCart === 0
        this.cart = result.cartData
      }
    })
  }
  deleteItemInCart () {
    if (this.itemObjectSelected.length > 0) {
      this.cartservice
        .removeAllItem(this.cart.id, this.itemSelected)
        .then(result => {
          const cartResult: Cart = result.cartData
          if (Object.keys(result).length) {
            this.isEmpty = result.uniqueItemInCart === 0
            this.cart = cartResult
          }
        })
    } else {
      this.toastService.showError('Chưa có sản phẩm nào được chọn')
    }
  }

  goCheckout () {
    if (this.itemObjectSelected.length > 0) {
      this.onNoClick()

      cartInit.id = this.cart.id;
      this.dialogService
        .openDialog(
          {
            height: '100%',
            width: '100%',
            disableClose: true,
            data: this.cartProcess.generatorCart(cartInit,this.itemObjectSelected)
          },
          PPaymentComponent
        )
        .subscribe(type => {
          if (type === 'closePayment') {
            this.dialogService
              .openDialog(
                {
                  height: '100%',
                  width: '100%',
                  data: 'ABC'
                },
                PCartComponent
              )
              .subscribe(data => {
                console.log(data)
              })
          }
          if (type === 'paymentSuccess') {
            // this.cart.cartItem.forEach(x => (x.selected = false))
            // this.totalMoney = 0
            // this.itemSelected = []
            // this.itemObjectSelected = []
            // this.dialogService
            // .openDialog(
            //   {
            //     height: '100%',
            //     width: '100%',
            //     disableClose: true,
            //     data: "ABC"
            //   },
            //   PCartComponent
            // ).subscribe(data=>{
            //   console.log(data);
            // })
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
