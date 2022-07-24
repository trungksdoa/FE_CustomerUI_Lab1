import { Component, OnInit, Input, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal'
import { Order } from 'src/app/model/Order'
import { Users } from 'src/app/model/user'
import { SharedService } from 'src/app/service/shared.service'
import { cartItem } from 'src/app/feature/p-cart/service'
import { OrderService } from 'src/app/feature/p-payment/order.service'
import { PPaymentComponent } from 'src/app/feature/p-payment/p-payment.component'
import { CurrencyService } from 'src/app/api/currencyAPI.service'
import { DialogService } from 'src/app/service/dialog.service'
import { Router } from '@angular/router'
@Component({
  selector: 'app-payment-paypal',
  templateUrl: './payment-paypal.component.html',
  styleUrls: ['./payment-paypal.component.css']
})
export class PaymentPaypalComponent implements OnInit {
  @Input() items: Array<cartItem> = []
  @Input() user: Users
  public payPalConfig?: IPayPalConfig
  showSuccess: boolean

  constructor (
    private sharedService: SharedService,
    private router: Router,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<PPaymentComponent>
  ) {}


  ngOnInit (): void {
    this.initConfig()
  }

  private getItemPaypal (data: Array<cartItem>) {
    return data.map(item => {
      return {
        name: item.productItem.name,
        quantity: item.quantity,
        category: 'DIGITAL_GOODS',
        unit_amount: {
          currency_code: 'USD',
          value: item.productItem.price+""
        }
      }
    })
  }
  sum (prev, next) {
    return prev + next
  }

  getOrderItem (payer: {
    address: {
      address_line_1: '2211 N First Street'
      address_line_2: 'Building 17'
      admin_area_1: 'CA'
      admin_area_2: 'San Jose'
      country_code: 'US'
      postal_code: '95131'
    }
    email_address: 'trungksdoa@gmail.com'
    name: {
      given_name: 'trungdeptrai'
      surname: 'nhatthegioi'
    }
    payer_id: 'HNV5KUQRV9WEY'
  }) {
    const order_content: Order = {
      id: 0,
      orderItems: this.items,
      userId: this.sharedService.getUserFromCookie(),
      note: '',
      address2: '',
      status: 2,
      totalAmount: 0,
      orderType: 'online',
      totalAmountUSD: undefined
    }
    return order_content
  }
  private initConfig (): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId:
        'AdgKNgleoxp1CkNQDDHafhAUUINuDRorx_vYKn4n11tywpgz1fFxXoe8Ez2BFWuKaliiEYLwire5A9Xh',
      createOrderOnClient: data => {
        return <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              shipping: {
                address: {
                  address_line_1: this.user.address + '',
                  address_line_2: 'Building 17',
                  admin_area_2: 'San Jose',
                  admin_area_1: 'CA',
                  postal_code: '95131',
                  country_code: 'US'
                }
              },
              amount: {
                currency_code: 'USD',
                value:   this.items
                  .map(result => result.productPrice)
                  .reduce((pre, curr) => pre + curr),
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: this.items
                      .map(result => result.productPrice)
                      .reduce((pre, curr) => pre + curr)
                  }
                }
              },
              items: this.getItemPaypal(this.items)
            }
          ]
        }
      },

      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'horizontal',
        size: 'medium',
        shape: 'rect',
        color: 'silver',
        fundingicons: true,
        tagline: false
      },

      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        )
        actions.order.get().then(details => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          )
        })
      },
      onClientAuthorization: (data: any) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        )
        if (data.status === 'COMPLETED') {
          this.orderService
            .addCartItem(this.getOrderItem(data.payer))
            .subscribe(data => {
              this.dialogRef.close('paymentSuccess')
              this.router.navigate(['profile']).then(() => {
                window.location.reload()
              })
            })
        }
        this.showSuccess = true
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions)
      },
      onError: err => {
        console.log('OnError', err)
      },
      onClick: (data, actions) => {
        // this.dialogRef.close();

        console.log('onClick', data, actions)
      }
    }
  }
}
