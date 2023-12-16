import { AiFillCheckCircle } from 'react-icons/ai';
import React from 'react';

interface PricingPerkProps {
  perk: string;
}

const PricingPerk = ({ perk }: PricingPerkProps) => {
  return (
    <div className='flex items-center border-b-2 border-black'>
      <AiFillCheckCircle
        className='ml-2 h-5 w-5 flex-shrink-0 text-green-500'
        aria-hidden='true'
      />
      <span className='p-3'>{perk}</span>
    </div>
  );
};

export default PricingPerk;
