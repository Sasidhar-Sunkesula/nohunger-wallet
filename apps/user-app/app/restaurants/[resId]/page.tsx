import { CDN_URL } from "@/app/lib/constants";
import { AllItems } from "@/components/AllItemsClient";
import ItemList from "@/components/ItemList";
import prisma from "@repo/db/client";
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
    return "NO MENU";
  }
  const {
    locality,
    name,
    cuisines,
    sla,
    avgRatingString,
    costForTwoMessage,
    cloudinaryImageId,
  } = data.menu.data.cards[2].card.card.info;
  let menuList;
  if (data.menu.data?.cards?.length === 5) {
    menuList =
      data.menu.data?.cards[4].groupedCard.cardGroupMap.REGULAR.cards[2].card
        .card.itemCards;
  } else {
    menuList =
      data.menu.data?.cards[5].groupedCard.cardGroupMap.REGULAR.cards[2].card
        .card.itemCards;
  }
  return (
    <div className="w-screen">
      <div className="res-info w-3/5 mx-auto  mb-2 px-12 py-10 shadow-lg rounded-lg flex items-center justify-between">
        <div className="left w-3/5">
          <div className="font-bold text-2xl p-2">{name}</div>
          <div className="font-semibold text-lg p-2 text-slate-500">
            {cuisines.join(", ")}
          </div>
          <div className="flex p-2 justify-between w-4/5">
            <div className="font-semibold text-lg">{locality}</div>
            <div className="font-semibold text-lg">
              Delivery In: {sla.deliveryTime}mins
            </div>
          </div>

          <div className="flex justify-between p-2 w-4/5">
            <div className="font-medium text-white text-base rounded-sm bg-green-400 px-2 py-1">
              {avgRatingString}⭐
            </div>
            <div className="font-medium text-base">{costForTwoMessage}</div>
          </div>
        </div>
        <div className="right">
          <img
            src={CDN_URL + cloudinaryImageId}
            className="w-80 h-56 object-cover rounded-xl"
          ></img>
        </div>
      </div>
      <div className="rounded-lg shadow-2xl w-2/5 border-2 mx-auto">
        <AllItems />
        {menuList.map((item: any) => (
          <ItemList key={item.card.info.id} itemObj={item.card.info} />
        ))}
      </div>
    </div>
  );
}
