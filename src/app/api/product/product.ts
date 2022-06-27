import { Category } from "../category/category";
import { FileDB } from "./FileDB";

export interface Product extends Category {
<<<<<<< HEAD

=======
>>>>>>> 14c7a86441fbcd81a97ba3c5d57b1501c5d8806a
  id: number;
  name: string;
  description: string;
  imageurl: FileDB;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  catagory: Category;
<<<<<<< HEAD
}
=======
}
>>>>>>> 14c7a86441fbcd81a97ba3c5d57b1501c5d8806a
