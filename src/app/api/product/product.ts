import { Category } from "../category/category";
import { FileDB } from "./FileDB";

export interface Product extends Category {

  id: number;
  name: string;
  description: string;
  imageurl: FileDB;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  catagory: Category;
}