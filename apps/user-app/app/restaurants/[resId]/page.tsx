import { CDN_URL } from "@/app/lib/constants";
import prisma from "@repo/db/client";
import { MenuItemsWrapper } from "@/components/MenuItemsWrapper";

const fetchMenu = async (resId: number) => {
  const data = await prisma.restaurantList.findFirst({
    where: {
      resId,
    },
  });
  return data;
};

export default async function Menu({ params }: { params: { resId: string } }) {
  const data = (await fetchMenu(parseInt(params.resId))) as any;
  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-500">
          Menu data not found.
        </p>
      </div>
    );
  }
  const cardInfo = data.menu?.data?.cards?.[2]?.card?.card?.info;

  if (!cardInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-500">
          Restaurant info not found in data.
        </p>
      </div>
    );
  }

  const {
    locality,
    name,
    cuisines,
    sla,
    avgRatingString,
    costForTwoMessage,
    cloudinaryImageId,
  } = cardInfo;

  let menuList =
    data.menu?.data?.cards
      ?.find((c: any) => c.groupedCard)
      ?.groupedCard?.cardGroupMap?.REGULAR?.cards?.find((c: any) =>
        c?.card?.card?.["@type"].includes("ItemCategory")
      )?.card?.card?.itemCards ?? [];

  if (!menuList.length) {
    const regularCards = data.menu?.data?.cards?.find((c: any) => c.groupedCard)
      ?.groupedCard?.cardGroupMap?.REGULAR?.cards;
    if (regularCards && regularCards.length > 2) {
      menuList = regularCards[2]?.card?.card?.itemCards ?? [];
    }
  }

  if (!menuList.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-orange-500">
          No items found in the menu for this restaurant.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="res-info w-full md:w-4/5 lg:w-3/5 mx-auto mb-6 p-4 md:p-6 shadow-lg rounded-lg flex flex-col md:flex-row items-center md:justify-between bg-white dark:bg-gray-800">
        <div className="left w-full md:w-3/5 mb-4 md:mb-0">
          <div className="font-bold text-xl md:text-2xl p-1 text-center md:text-left text-gray-900 dark:text-white">
            {name}
          </div>
          <div className="font-semibold text-base md:text-lg p-1 text-slate-500 dark:text-slate-400 text-center md:text-left">
            {cuisines.join(", ")}
          </div>
          <div className="flex flex-col md:flex-row p-1 justify-start items-center md:items-baseline w-full space-y-1 md:space-y-0 md:space-x-4 text-center md:text-left">
            <div className="font-semibold text-base md:text-lg text-slate-600 dark:text-slate-300">
              {locality}
            </div>
            <div className="font-semibold text-base md:text-lg text-slate-600 dark:text-slate-300">
              Delivery In: {sla?.deliveryTime ?? "N/A"} mins
            </div>
          </div>

          <div className="flex flex-col md:flex-row p-1 justify-start items-center md:items-baseline w-full space-y-1 md:space-y-0 md:space-x-4 mt-2">
            <div className="font-medium text-white text-sm rounded-sm bg-green-500 px-2 py-1 w-max">
              {avgRatingString}⭐
            </div>
            <div className="font-medium text-base text-slate-700 dark:text-slate-200 text-center md:text-left">
              {costForTwoMessage}
            </div>
          </div>
        </div>
        <div className="right mt-4 md:mt-0">
          {cloudinaryImageId && (
            <img
              src={CDN_URL + cloudinaryImageId}
              className="w-48 h-32 md:w-60 md:h-40 object-cover rounded-xl shadow-md"
              alt={name}
              loading="lazy"
            />
          )}
        </div>
      </div>

      <div className="menu-items w-full md:w-4/5 lg:w-3/5 mx-auto">
        <MenuItemsWrapper menuList={menuList} />
      </div>
    </div>
  );
}
