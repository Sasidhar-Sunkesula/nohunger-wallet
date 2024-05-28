// components/ReceivedTransfers.tsx
import React from 'react';
import { Transfer } from '../Types/type';

interface ReceivedTransfersProps {
  transfers: Transfer[];
}

const ReceivedTransfers: React.FC<ReceivedTransfersProps> = ({ transfers }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Received Transfers</h3>
      <ul className="list-disc list-inside">
        {transfers.map((transfer, index) => (
          <li key={index} className="mb-1">
            From: User {transfer.fromUserId}, Amount: ${transfer.amount}, Date: {new Date(transfer.time).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReceivedTransfers;
