import { HttpErrorResponse } from '@angular/common/http'
import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, NgForm, Validators } from '@angular/forms'
import { Category } from 'src/app/api/category/category'
import { CategoryService } from 'src/app/api/category/category.service'
import { Product } from 'src/app/api/product/product'
import { ProductService } from 'src/app/api/product/product.service'
@Component({
  selector: 'app-admin-items',
  templateUrl: './admin-items.component.html',
  styleUrls: ['./admin-items.component.css']
})
export class AdminItemsComponent implements OnInit {
  categorys: Category[]
  uploadedFiles: File
  failed = false
  isLoading = false
  @ViewChild('inputImage', { static: false }) inputImage

  createProductForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', Validators.required],
    image: [null],
    category: [{}, Validators.required]
  })

  imageDataUrl: any = null

  constructor (
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  fileChange (element: any) {
    this.uploadedFiles = element.target.files
  }

  ngOnInit (): void {
    this.getAllProduct()
    this.getAllCategory()
  }

  public getAllCategory (): void {
    this.categoryService.getAllCategory().subscribe(
      (response: Category[]) => {
        this.categorys = response
        console.log(this.categorys)
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }
  onUploadImageButtonClick () {
    this.inputImage.nativeElement.click()
  }
  public products: Product[]
  public editCate: Product
  public deleteCate: Product

  onFileChange () {
    const target = this.inputImage.nativeElement
    if (target.files && target.files.length) {
      const [file] = target.files
      this.createProductForm.patchValue({
        image: file
      })
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = _event => {
        this.imageDataUrl = reader.result
      }
    }
  }

  @Input() response: any
  public getAllProduct (): void {
    this.productService.getAllProduct().subscribe(
      (response: Product[]) => {
        this.isLoading = true
        this.products = response

        console.log(this.products)
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false
        this.failed = true
      }
    )
  }
  public onSubmit = () => {
    console.log(this.createProductForm)

    if (this.createProductForm.valid) {
      this.isLoading = true
      this.failed = false

      const formdata: FormData = new FormData()

      formdata.append('name', this.createProductForm.value.name)
      formdata.append('description', this.createProductForm.value.description)
      formdata.append('price', this.createProductForm.value.price)
      // formdata.append("image", this.createProductForm.value.image);
      formdata.append('category', this.createProductForm.value.category)

      const cateId = formdata.get('category')

      const category = {
        id: parseInt(cateId + ''),
        name: '',
        createdAt: undefined,
        updatedAt: undefined
      }

      const newProduct: Product = {
        id: 0,
        name: formdata.get('name') + '',
        description: formdata.get('description') + '',
        imageurl: '',
        price: parseInt(formdata.get('price') + ''),
        createdAt: null,
        updatedAt: null,
        catagory: category
      }

      const newFormData: FormData = new FormData()

      newFormData.append('image', this.createProductForm.value.image)

      newFormData.append('product', JSON.stringify(newProduct))

      this.productService.createProductWithFileUpload(newFormData).subscribe(
        (response: Product) => {
          console.log(response)

          this.getAllProduct()
          this.createProductForm.reset()
        },
        (error: HttpErrorResponse) => {
          alert(error.message)
          this.createProductForm.reset()
        }
      )
    }
  }

  public onAddProduct (addForm: NgForm): void {
    document.getElementById('add-employee-form').click()

    this.productService.addProduct(addForm.value).subscribe(
      (response: Product) => {
        console.log(response)
        this.getAllProduct()
        addForm.reset()
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
        addForm.reset()
      }
    )
  }

  public onUpdateProduct (cate: NgForm): void {
    // console.log(cate.value)
    const catagory: Category = {
      id: cate.value.category,
      name: '',
      createdAt: undefined,
      updatedAt: undefined
    }
    const newProduct: Product = {
      id: cate.value.id,
      name: cate.value.name,
      description: cate.value.description,
      imageurl: '',
      price: cate.value.price,
      createdAt: undefined,
      updatedAt: undefined,
      catagory: catagory
    }
    this.productService.updateProduct(newProduct).subscribe(
      (response: Product) => {
        console.log(response);
        this.getAllProduct();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteProduct (cateid: number): void {
    this.productService.deleteProduct(cateid).subscribe(
      (response: void) => {
        console.log(response)
        this.getAllProduct()
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

  public searchCategory (key: string): void {
    console.log(key)
    const results: Product[] = []
    for (const cate of this.products) {
      if (cate.name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(cate)
      }
    }
    this.products = results
    if (results.length === 0 || !key) {
      this.getAllProduct()
    }
  }

  public onOpenModal (cate: Product, mode: string): void {
    const container = document.getElementById('main-container')
    const button = document.createElement('button')
    button.type = 'button'
    button.style.display = 'none'
    button.setAttribute('data-toggle', 'modal')
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal')
    }
    if (mode === 'edit') {
      this.editCate = cate
      button.setAttribute('data-target', '#updateEmployeeModal')
    }
    if (mode === 'delete') {
      this.deleteCate = cate
      button.setAttribute('data-target', '#deleteEmployeeModal')
    }
    container.appendChild(button)
    button.click()
  }
}
