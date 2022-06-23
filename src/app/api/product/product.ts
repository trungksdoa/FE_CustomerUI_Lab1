import { Category } from "../category/category";

export interface Product extends Category {

    id: number;
    name: string;
    description: string;
    imageurl: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    catagory: Category;
    
  }

 


