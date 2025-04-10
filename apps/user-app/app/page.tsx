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
    <div className="w-full">
      <div className="flex items-center flex-wrap justify-around mt-24 mb-10">
        {/* Search Box */}
        <div className="items-center flex flex-wrap gap-x-2">
          <input
            className="search-box border-2 rounded-3xl border-red-400 w-64 px-3 py-2"
            name="search-box"
            type="text"
            value={searchText}
            placeholder="Search here..."
            onChange={(e) => {
              setsearchText(e.target.value);
            }}
          />
          <select
            className="border-2 border-red-400 rounded-3xl px-3 py-2"
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
          >
            <option value="">Select Price Range</option>
            <option value="less than 151">Less than 150</option>
            <option value="151-200">150-200</option>
            <option value="201-250">200-250</option>
            <option value="251-300">250-300</option>
            <option value="301-500">300-500</option>
            <option value="above 500">Above 500</option>
          </select>
        </div>
        {/* Header */}
        <div className="text-center font-bold text-4xl">
          All Restaurants in Narasaraopet
        </div>
        {/* Top Rated Filter */}
        <div className="px-4 py-2 border-2 border-red-400 bg-white text-lg rounded-full text-slate-700">
          <button className="filter-btn" onClick={handleTopRatedFilter}>
            {isTopRatedFiltered
              ? "Show All Restaurants"
              : "Top Rated Restaurants"}
          </button>
        </div>
      </div>
      <div className="flex gap-7 flex-wrap justify-center">
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
