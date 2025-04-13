import { SendCard } from "../../../components/SendCard";

export default function () {
  return (
    <div>
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        P2P Transfer
      </div>
      <div className="flex items-center justify-center">
        <SendCard />
      </div>
    </div>
  );
}
