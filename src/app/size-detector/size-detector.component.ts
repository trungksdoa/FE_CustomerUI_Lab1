import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit
} from '@angular/core'
import { ResizeChangeService } from './resize-change.service'

@Component({
  selector: 'app-size-detector',
  templateUrl: './size-detector.component.html',
  styleUrls: ['./size-detector.component.css']
})
export class SizeDetectorComponent implements AfterViewInit {
  prefix = 'is-'
  sizes = [
    {
      id: SCREEN_SIZE.XS,
      name: 'xs',
      css: `d-block d-sm-none`
    },
    {
      id: SCREEN_SIZE.SM,
      name: 'sm',
      css: `d-none d-sm-block d-md-none`
    },
    {
      id: SCREEN_SIZE.MD,
      name: 'md',
      css: `d-none d-md-block d-lg-none`
    },
    {
      id: SCREEN_SIZE.LG,
      name: 'lg',
      css: `d-none d-lg-block d-xl-none`
    },
    {
      id: SCREEN_SIZE.XL,
      name: 'xl',
      css: `d-none d-xl-block`
    }
  ]
  constructor (
    private elementRef: ElementRef,
    private resizeSvc: ResizeChangeService
  ) {}

  @HostListener('window:resize', [])
  private onResize () {
    this.detectScreenSize()
  }

  ngAfterViewInit () {
    this.detectScreenSize()
  }

  private detectScreenSize () {
    const currentSize = this.sizes.find(x => {
      // lấy element HTML
      const el = this.elementRef.nativeElement.querySelector(
        `.${this.prefix}${x.id}`
      )
      console.log(el)
      // kiểm tra giá trị thuộc tính hiển thị của nó
      const isVisible = window.getComputedStyle(el).display != 'none'

      return isVisible
    })

    this.resizeSvc.onResize(currentSize.id)
  }
}

export enum SCREEN_SIZE {
  XS,
  SM,
  MD,
  LG,
  XL
}
