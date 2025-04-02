export enum DishType {
  dessert = "dessert",
  dish = "dish"
}


export type DishJsonType = {
  _id: string
  dishType: string,
  name: string,
  description: string,
  image_url: string,
  price: number
}

export type Dish = {
  _id?: string
  dishType: DishType
  name: string,
  description: string,
  image_url: string,
  price: number
}

export interface LoginType {
  email: string;
  password: string;
}


export interface RegisterType extends LoginType {
  firstname: string,
  lastname: string,
}

export interface UserSlice {
  statusRegister: string,
  statusLogin: string,
  statusCheck: string,
  statusUser: null | string,
  error: null | string,
  connected: boolean,
}

export interface DishSlice {
  statusGetDishes: string,
  error: null | string,
  dishes: Dish[],
  dish: Dish | undefined
}

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  statusUser: string;
};

export type NewOrder =  {
  quantity: number,
  id_dish: string
}

export type Order = {
  _id?: string,
  quantity: number,
  id_dish: Dish
}

export type OrderSlice = {
  orders : Order[],
  error: null | string,
}

export type User = {
  _id: string,
  firstname: string,
  lastname: string
}

export type Cart = {
  _id: string,
  id_user: User,
  id_deliveryman?: User
  numberOrder: number,
  items: Order[],
  totalAmount: number,
  status: string,
  createdAt: Date,
  address: string,
  shippingCost: number
}

export type CartSlice = {
  error: null | string,
  carts: Cart[]
}