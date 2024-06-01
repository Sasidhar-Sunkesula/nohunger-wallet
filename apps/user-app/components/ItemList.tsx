import { CDN_URL } from "@/app/lib/constants";
import { AddToCartClient } from "./AddToCartClient";

export interface Item {
  id: number;
  name: string;
  price: number;
  ratings: number;
  imageId: string;
}
const ItemList = ({ id, name, price, ratings, imageId }: Item) => {
  return (
    <div className="flex justify-between p-4 rounded-lg my-3 w-4/5 mx-auto bg-orange-50 items-center">
      <div>
        <div className="font-semibold text-lg">{name}</div>
        <div className="font-bold mt-1">
          {price ? "₹" + price / 100 : "customized"}
        </div>
        <div className="font-medium w-max mt-1 text-white text-base rounded-sm bg-green-400 px-2 py-1">
          {!ratings ? 0 : ratings}⭐
        </div>
      </div>
      <div className="relative">
        <img className="w-36 h-28 rounded-md" src={CDN_URL + imageId}></img>
        <AddToCartClient
          id={id}
          name={name}
          price={price}
          ratings={ratings}
          imageId={imageId}
        />
      </div>
    </div>
  );
};

export default ItemList;
