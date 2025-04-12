"use client";

import NoInternet from "@/components/NoInternet";
import RestaurantCard from "@/components/RestaurantCard";
import Shimmer from "@/components/Shimmer";
import { setCart } from "@repo/store/cartSlice";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCartDetails } from "./lib/actions/cart";
import { restaurantList } from "./lib/restaurantList";
import useOnlineStatus from "./lib/useOnlineStatus";

export default function Page() {
  const dispatch = useDispatch();
  const fetchCart = async (userId: number) => {
    const data = await getCartDetails(userId);
    if (!data.cart) {
      return;
    }
    console.log(data);
    const cartData = data.cart[0].CartItems.map((item: any) => item.Items);
    dispatch(setCart(cartData));
  };
  const session = useSession();
  if (session.data?.user) {
    const userId = session.data?.user.id;
    fetchCart(parseInt(userId));
  }

  const [listOfRestaurants, setListOfRestaurants] = useState([]);
  const [dupelistOfRestaurants, setDupeListOfRestaurants] = useState([]);
  const [searchText, setsearchText] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const onlineStatus = useOnlineStatus();
  const [isTopRatedFiltered, setIsTopRatedFiltered] = useState(false);
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
  const filterRestaurants = () => {
    let filteredList = listOfRestaurants;
    if (searchText) {
      filteredList = filteredList.filter((res: any) =>
        res.info.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split("-").map(Number);
      filteredList = filteredList.filter((res: any) => {
        const cost = parseInt(
          res.info.costForTwo.replace("₹", "").replace(",", "")
        );
        if (!isNaN(min) && !isNaN(max)) {
          return cost >= min && cost <= max;
        } else if (selectedPriceRange === "less than 151") {
          return cost < 150;
        } else if (selectedPriceRange === "above 500") {
          return cost > 500;
        }
      });
    }

    setDupeListOfRestaurants(filteredList);
  };
  const handleTopRatedFilter = () => {
    if (isTopRatedFiltered) {
      setDupeListOfRestaurants(listOfRestaurants);
    } else {
      const filteredList = listOfRestaurants.filter(
        (res: any) => res.info.avgRating > 4
      );
      setDupeListOfRestaurants(filteredList);
    }
    setIsTopRatedFiltered(!isTopRatedFiltered);
  };

  useEffect(() => {
    displayData();
    const filteredList = listOfRestaurants.filter((res: any) =>
      res.info.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setDupeListOfRestaurants(filteredList);
  }, [searchText, listOfRestaurants]);

  useEffect(() => {
    filterRestaurants();
  }, [searchText, selectedPriceRange]);

  if (onlineStatus === false) {
    return <NoInternet />;
  }

  if (listOfRestaurants.length === 0) {
    return <Shimmer />;
  }
  return (
    <div className="mt-16">
      <div className="flex flex-col sm:flex-row justify-center items-center px-4 sm:px-0 gap-2 sm:gap-0">
        <input
          className="border border-solid border-black dark:border-gray-600 rounded-lg py-[5px] px-[10px] w-full sm:w-1/2 md:w-1/3 dark:bg-gray-700 dark:text-white"
          type="text"
          placeholder="Search for restaurants and food..."
          value={searchText}
          onChange={(e) => {
            setsearchText(e.target.value);
          }}
        ></input>
        <button
          className="px-[10px] py-[5px] bg-green-300 dark:bg-green-600 dark:text-white sm:m-[10px] rounded-lg w-full sm:w-auto"
          onClick={() => {
            // Filter the restaurant cards and update the UI
            // searchText
            const filteredRestaurant = dupelistOfRestaurants.filter(
              (res: any) =>
                res.info.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setListOfRestaurants(filteredRestaurant);
          }}
        >
          Search
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <div className="w-full sm:w-3/4 md:w-1/2 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 px-2 sm:px-0">
          <button
            className={`px-4 py-2 rounded-lg ${isTopRatedFiltered ? "bg-green-500 text-white" : "bg-gray-200"} w-full sm:w-auto`}
            onClick={handleTopRatedFilter}
          >
            Top Rated
          </button>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full sm:w-auto"
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
          >
            <option value="">All Price Ranges</option>
            <option value="less than 151">Less than 150</option>
            <option value="151-300">151-300</option>
            <option value="301-500">301-500</option>
            <option value="above 500">Above 500</option>
          </select>
        </div>
      </div>
      <div className="text-center font-bold text-4xl mt-4">
        All Restaurants in Narasaraopet
      </div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4 px-2 sm:px-4">
        {dupelistOfRestaurants.length === 0 ? (
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
            {Array(8)
              .fill("")
              .map((_, index) => (
                <Shimmer key={index} />
              ))}
          </div>
        ) : (
          dupelistOfRestaurants.map((restaurant: any) => (
            <Link
              href={`/restaurants/${restaurant.info.id}`}
              key={restaurant.info.id}
              className="w-full sm:w-auto"
            >
              <RestaurantCard key={restaurant.info.id} resData={restaurant} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
