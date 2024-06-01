import { Card } from "@repo/ui/card";

export const OnRampTransactions = ({
  transactions,
  plusMinus,
  title,
}: {
  transactions: {
    time: Date;
    amount: number;
    status: string;
    provider: string;
  }[];
  plusMinus: string;
  title: string;
}) => {
  if (!transactions.length) {
    return (
      <Card title={title}>
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }
  return (
    <Card title={title}>
      <div className="pt-2">
        {transactions.map((t) => (
          <div className="flex justify-between">
            <div>
              <div className="text-sm">{t.status}</div>
              <div className="text-slate-600 text-xs">
                {t.time.toDateString()}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              {plusMinus} Rs {t.amount}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
