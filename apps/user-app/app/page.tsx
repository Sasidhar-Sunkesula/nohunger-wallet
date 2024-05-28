"use client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./lib/auth";
import { useEffect, useState } from "react";
import useOnlineStatus from "./lib/useOnlineStatus";
import Link from "next/link";
import Shimmer from "@/components/Shimmer";
import NoInternet from "@/components/NoInternet";
import { restaurantList } from "./lib/restaurantList";
import RestaurantCard from "@/components/RestaurantCard";

export default function Page() {
  // const session = await getServerSession(authOptions);
  // if (session?.user) {
  //   redirect('/dashboard')
  // } else {
  //   redirect('/api/auth/signin')
  // }
  const [listOfRestaurants, setListOfRestaurants] = useState([]);
  const [dupelistOfRestaurants, setDupeListOfRestaurants] = useState([]);
  const [searchText, setsearchText] = useState("");
  const onlineStatus = useOnlineStatus();
  const displayData = () => {
    try {
      const allRestaurants =
        restaurantList.data?.cards?.[1]?.card?.card?.gridElements?.infoWithStyle
          ?.restaurants;
      if (allRestaurants) {
        setListOfRestaurants(allRestaurants);
        setDupeListOfRestaurants(allRestaurants);
      } else {
        console.error("Error: Restaurants data is undefined");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  useEffect(() => {
    displayData();
  }, []);

  if (onlineStatus === false) {
    return <NoInternet />;
  }

  if (listOfRestaurants.length === 0) {
    return <Shimmer />;
  }

  return (
    <div className="body w-full">
      <div className="filter h-16 flex items-center justify-between m-14 mb-6">
        <div className="search-class items-center flex flex-wrap ">
          <div>
            <input
              className="search-box border-2 rounded-3xl border-red-400 w-64 px-3 py-2"
              name="search-box"
              type="text"
              value={searchText}
              onChange={(e) => {
                setsearchText(e.target.value);
              }}
            ></input>
          </div>
          <div>
            <button
              data-testid="SearchBtn"
              className="search-btn border-2 text-lg rounded-3xl py-2 w-24 font-medium px-4 bg-red-400 text-white ml-5 "
              onClick={() => {
                const searchList = listOfRestaurants.filter((res: any) =>
                  res.info.name.toLowerCase().includes(searchText.toLowerCase())
                );
                setDupeListOfRestaurants(searchList);
              }}
            >
              Search
            </button>
          </div>
        </div>
        <div className="filter-btn-class  px-4 py-2 border-2 border-red-400 bg-white text-lg rounded-full text-slate-700 mr-52">
          <button
            className="filter-btn"
            onClick={() => {
              const filteredList = listOfRestaurants.filter(
                (res: any) => res.info.avgRating > 4
              );
              setDupeListOfRestaurants(filteredList);
            }}
          >
            Top Rated Restaurants
          </button>
        </div>
      </div>
      <div className="mb-7 text-center font-bold text-4xl">
        All Restaurants in Narasaraopet
      </div>
      <div className="res-container flex gap-7 flex-wrap justify-center">
        {dupelistOfRestaurants.map((restaurant: any) => (
          <Link
            href={"/restaurants/" + restaurant.info.id}
            key={restaurant.info.id}
          >
            <RestaurantCard key={restaurant.info.id} resData={restaurant} />
          </Link>
        ))}
      </div>
    </div>
  );
}
