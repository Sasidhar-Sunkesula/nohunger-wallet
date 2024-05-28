import { CDN_URL } from "@/app/lib/constants";
import { AddToCartClient } from "./AddToCartClient";

export interface Item{
    name: string;
    price: number;
    ratings: any;
    imageId: string;
  }
interface Props{
    key: number;
    itemObj: Item
  }
  const ItemList = ({ itemObj }: Props) => {
    const { name, price, ratings, imageId } = itemObj;
    
    return (
      <div className="flex justify-between p-4 rounded-lg my-3 w-4/5 mx-auto bg-orange-50 items-center">
        <div>
          <div className="font-semibold text-lg">{name}</div>
          <div>{price / 100}</div>
          <div>{ratings.aggregatedRating.rating}</div>
        </div>
        <div className="relative">
          <img className="w-36 h-28 rounded-md" src={CDN_URL + imageId}></img>
          <AddToCartClient itemObj={itemObj}/>
        </div>
      </div>
    );
  };
  
  export default ItemList;