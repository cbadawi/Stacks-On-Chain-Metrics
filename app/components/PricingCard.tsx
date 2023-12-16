import { IPlan } from '../pricing/IPlans';
import React from 'react';
import PricingPerk from './PricingPerk';

interface PricingCardProps {
  plan: IPlan;
}

const PricingCard = ({ plan }: PricingCardProps) => {
  return (
    <div className='card w-96 bg-slate-800 shadow-xl'>
      <div className='card-body'>
        <h2 className='card-title'>{plan.name}</h2>
        <span>
          {isNaN(parseInt(plan.price)) ? '' : '$'}
          {plan.price}
          {isNaN(parseInt(plan.price)) ? '' : '/month'}
        </span>
        {plan.perks.map((perk) => (
          <PricingPerk key={perk} perk={perk} />
        ))}
        <div className='empty-filler flex-grow'></div>
        <div className='buy-button-container card-actions flex justify-center'>
          <button className='rounded bg-red-400 bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 font-bold text-white transition duration-500 ease-in-out hover:skew-y-12'>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
