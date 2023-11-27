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
        <text>
          {isNaN(parseInt(plan.price)) ? '' : '$'}
          {plan.price}
          {isNaN(parseInt(plan.price)) ? '' : '/month'}
        </text>
        {plan.perks.map((perk) => (
          <PricingPerk key={perk} perk={perk} />
        ))}
        <div className='flex-grow'></div>
        <div className='card-actions flex justify-center'>
          <button className='btn btn-primary w-3/4'>Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
