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
import { getCartDetails } from "./lib/actions/cart";
import { useSession } from "next-auth/react";
import { setCart } from "@repo/store/cartSlice";
import { useDispatch } from "react-redux";
import { CDN_URL } from "./lib/constants";
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
  const images = [
    CDN_URL + "fwgj6bshggyfoeq4leiw",
    CDN_URL + "fwgj6bshggyfoeq4leiw",
    CDN_URL + "fwgj6bshggyfoeq4leiw",
  ];
  return (
    <div className="body w-full">
      <div className="filter h-16 flex items-center justify-between m-14 mb-6">
        <div className="search-className items-center flex flex-wrap ">
          <div>
            <input
              className="search-box border-2 rounded-3xl border-red-400 w-64 px-3 py-2"
              name="search-box"
              type="text"
              value={searchText}
              placeholder="search here"
              onChange={(e) => {
                setsearchText(e.target.value);
              }}
            ></input>
          </div>
          <div>
            {/* <button
              data-testid="SearchBtn"
              classNameName="search-btn border-2 text-lg rounded-3xl py-2 w-24 font-medium px-4 bg-red-400 text-white ml-5 "
              onClick={() => {
                const searchList = listOfRestaurants.filter((res: any) =>
                  res.info.name.toLowerCase().includes(searchText.toLowerCase())
                );
                setDupeListOfRestaurants(searchList);
              }}
            >
              Search
            </button> */}
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
        </div>
        <div className="filter-btn-className  px-4 py-2 border-2 border-red-400 bg-white text-lg rounded-full text-slate-700 mr-52">
          <button className="filter-btn" onClick={handleTopRatedFilter}>
            {isTopRatedFiltered
              ? "Show All Restaurants"
              : "Top Rated Restaurants"}
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
