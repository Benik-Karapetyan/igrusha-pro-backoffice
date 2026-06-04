import { ENUM_CATEGORY_TYPE, ENUM_PRODUCT_GENDER } from "./enums";
import { TLangString } from "./general.types";

export interface ICategory {
  _id: string;
  type: ENUM_CATEGORY_TYPE[];
  urlName: string;
  name: TLangString;
  title: TLangString;
  description: TLangString;
}

export type TAgeRange = {
  from: number;
  to?: number;
};

export interface IOrderItem {
  _id: string;
  productNumber: string;
  urlName: string;
  categories: ICategory[];
  gallery: string[];
  name: TLangString;
  cost: number;
  price: number;
  discount: number;
  numberInStock: number;
  gender: ENUM_PRODUCT_GENDER;
  ageRange: TAgeRange;
  brand?: string;
  rating: number;
  reviewCount: number;
  quantity: number;
}

export interface IOrder {
  _id: string;
  items: IOrderItem[];
}
