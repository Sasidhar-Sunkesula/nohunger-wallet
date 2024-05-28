// components/SentTransfers.tsx
import React from 'react';
import { Transfer } from '../Types/type';

interface SentTransfersProps {
  transfers: Transfer[];
}

const SentTransfers: React.FC<SentTransfersProps> = ({ transfers }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Sent Transfers</h3>
      <ul className="list-disc list-inside">
        {transfers.map((transfer, index) => (
          <li key={index} className="mb-1">
            To: User {transfer.toUserId}, Amount: ${transfer.amount}, Date: {new Date(transfer.time).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SentTransfers;
