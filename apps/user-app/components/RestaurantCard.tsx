import { CDN_URL } from "@/app/lib/constants";
import React from "react";

interface ResData {
  name: string;
  cuisines: string[];
  avgRating: string;
  cloudinaryImageId: string;
  costForTwo: string;
  id: number;
}
interface ResDataInfo {
  info: ResData;
}
interface CardProps {
  key: number;
  resData: ResDataInfo;
}

const RestaurantCard = (props: CardProps) => {
  const { resData } = props;
  const { name, cuisines, avgRating, cloudinaryImageId, costForTwo, id } =
    resData.info;
  return (
    <div className="w-[330px] h-80 border-2 rounded-lg hover:shadow-2xl shadow-lg ">
      <img
        src={CDN_URL + cloudinaryImageId}
        className="res-img mx-auto  my-4 w-11/12 h-2/4 object-cover rounded-lg"
        alt={name}
      />

      <div className="font-bold dark:text-white text-slate-800 px-1 text-lg text-center ">
        {name}
      </div>
      <div className="font-bold dark:text-white p-2 text-slate-600 text-center text-sm">
        {cuisines.join(", ")}
      </div>
      <div className="flex text-slate-700 dark:text-white justify-around flex-wrap text-base mt-2 font-bold">
        <div>
          {avgRating}⭐{id}
        </div>
        <div className="dark:text-white">{costForTwo}</div>
      </div>
    </div>
  );
};

export default RestaurantCard;
