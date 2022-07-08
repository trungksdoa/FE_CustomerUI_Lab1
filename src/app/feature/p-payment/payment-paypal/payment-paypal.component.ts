import { Component, OnInit, Input } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal'
import { Order } from 'src/app/model/Order'
import { Users } from 'src/app/model/user'
import { SharedService } from 'src/app/service/shared.service'
import { cartItem } from 'src/app/feature/p-cart/service'
import { OrderService } from 'src/app/feature/p-payment/order.service'
import { PPaymentComponent } from 'src/app/feature/p-payment/p-payment.component'
import { CurrencyService } from 'src/app/api/currencyAPI.service'
@Component({
  selector: 'app-payment-paypal',
  templateUrl: './payment-paypal.component.html',
  styleUrls: ['./payment-paypal.component.css']
})
export class PaymentPaypalComponent implements OnInit {
  @Input() items: Array<cartItem>
  @Input() user: Users

  copyItems:Array<cartItem> = []

  public payPalConfig?: IPayPalConfig
  showSuccess: boolean
  constructor (
    private sharedService: SharedService,
    private orderService: OrderService,
    private currency_code:CurrencyService,
    public dialogRef: MatDialogRef<PPaymentComponent>
  ) {}

  ngOnInit (): void {
    this.initConfig()
  }

  private getItemPaypal () {
    return this.copyItems.map(item => {
      return {
        name: item.productItem.name,
        quantity: item.quantity,
        category: 'DIGITAL_GOODS',
        unit_amount: {
          currency_code: 'USD',
          value: item.productItem.price.toString()
        }
      }
    })
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
      address2:
        payer.address.address_line_1 +
        ', ' +
        payer.address.address_line_2 +
        ', ' +
        payer.address.admin_area_1 +
        ', ' +
        payer.address.admin_area_2 +
        ', ' +
        payer.address.country_code,
      status: 2,
      totalAmount: 0
    }
    return order_content
  }
  private initConfig (): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId:
        'AcY3T0c72nPrldG0kXU1vnYyUPeW9icX6uGS0gz9bB849FQHeQe-1pizqcpS0q17ueHG1tBSRRKjNPE_',
      createOrderOnClient: data => {
        // console.log(this.user)
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
                value: this.copyItems.reduce(
                  (pre, curr) => pre + curr.productPrice,
                  0
                ),
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: this.items.reduce(
                      (pre, curr) => pre + curr.productPrice,
                      0
                    )
                  }
                }
              },
              items: this.getItemPaypal()
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
              this.dialogRef.close('closeCart')
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
        this.copyItems = [...this.items]
        this.currency_code.getCurrency().subscribe(data=>{
          this.copyItems.forEach(item=>{
            let fromRate = data.rates["VND"]
            let toRate = data.rates["USD"]

            item.productPrice =  ((toRate / fromRate) * item.productPrice).toFixed(2)
            item.productItem.price =  parseFloat(((toRate / fromRate) * item.productItem.price).toFixed(2))
          })
        })
        console.log('onClick', data, actions)
      }
    }
  }
}
