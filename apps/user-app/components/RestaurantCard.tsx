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
    <div className="w-full sm:w-[280px] md:w-[330px] h-auto sm:h-80 border-2 rounded-lg hover:shadow-2xl shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800">
      <img
        src={CDN_URL + cloudinaryImageId}
        className="res-img mx-auto my-4 w-11/12 h-40 sm:h-2/4 object-cover rounded-lg"
        alt={name}
        loading="lazy"
      />

      <div className="font-bold dark:text-white text-slate-800 px-2 text-base sm:text-lg text-center truncate">
        {name}
      </div>
      <div className="font-bold dark:text-white p-2 text-slate-600 text-center text-xs sm:text-sm truncate">
        {cuisines.join(", ")}
      </div>
      <div className="flex text-slate-700 dark:text-white justify-around flex-wrap text-sm sm:text-base mt-2 mb-4 sm:mb-0 font-bold">
        <div>
          {avgRating}⭐{id}
        </div>
        <div className="dark:text-white">{costForTwo}</div>
      </div>
    </div>
  );
};

export default RestaurantCard;
