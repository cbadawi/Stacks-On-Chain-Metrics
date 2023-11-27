import Link from 'next/link';

export default function Home() {
  return (
    <div className='h-full w-full text-center'>
      <h1 className='text-5xl'>Home Page</h1>
      <p className='pt-40'>Click Here</p>
      <h1 className='justify-middle items-center text-2xl underline'>
        <Link href='/pricing'> Pricing Page </Link>
      </h1>
    </div>
  );
}
