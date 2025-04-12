import { Card } from "@repo/ui/card";

export const BalanceCard = ({amount, locked}: {
    amount: number;
    locked: number;
}) => {
    return <Card title={"Balance"}>
        <div className="flex flex-col sm:flex-row justify-between border-b border-slate-300 dark:border-slate-600 pb-2">
            <div className="font-medium text-sm sm:text-base">
                Unlocked balance
            </div>
            <div className="font-bold text-right text-sm sm:text-base">
                {amount} INR
            </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between border-b border-slate-300 dark:border-slate-600 py-2">
            <div className="font-medium text-sm sm:text-base">
                Total Locked Balance
            </div>
            <div className="font-bold text-right text-sm sm:text-base">
                {locked} INR
            </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between border-b border-slate-300 dark:border-slate-600 py-2">
            <div className="font-medium text-sm sm:text-base">
                Total Balance
            </div>
            <div className="font-bold text-right text-sm sm:text-base">
                {(locked + amount)} INR
            </div>
        </div>
    </Card>
}