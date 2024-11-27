// import Image from "next/image";

import Link from 'next/link';

export default function Home() {
  return (
    <div className='text-center pt-24 h-40'>
      <Link
        href='/add-navigation'
        className='my-3 text-white bg-buttonPrimaryBg hover:bg-purple-700 focus:ring-4 focus:ring-purple-500 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none'
      >
        + Dodaj nawigację
      </Link>
    </div>
  );
}
