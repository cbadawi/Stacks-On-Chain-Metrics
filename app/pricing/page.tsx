import React from 'react';
import { plans } from './plans';
import PricingCard from '../components/PricingCard';

export async function getProducts() {}

const Pricing = () => {
  // TODO should probably be a grid outside a flex
  // TODO https://www.nansen.ai/plans has a nice page
  // TODO add 14 day free trial
  return (
    <section className='w-full'>
      <div className='mx-auto mt-10 max-w-4xl items-center text-center'>
        <h2 className='text-4xl font-semibold leading-7 text-[#f1592a]'>
          Support Us!
        </h2>
        <p className='mt-2 text-base font-bold tracking-tight text-gray-300 sm:text-3xl'>
          API access or Charts Premium Features : Choose the best option for
          you.
        </p>
        {/* TODO add contact us link */}
        <p className='mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-center'>
          or Contact Us to pay in crypto anonymously
        </p>
      </div>
      {/* TODO add yearly pricing https://www.nansen.ai/plans */}
      <h1 className='ml-9 text-3xl font-extrabold'> Charts : </h1>
      <div className='m-9 flex flex-wrap gap-5'>
        {plans &&
          plans.charts.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
      </div>
      <h1 className='ml-9 text-3xl font-extrabold'> API : </h1>
      <div className='m-9 flex flex-wrap gap-5'>
        {plans &&
          plans.api.map((plan) => <PricingCard key={plan.name} plan={plan} />)}
      </div>
    </section>
  );
};

export default Pricing;
