// import Image from "next/image";

import Link from 'next/link';

export default function Home() {
  return (
    <div className='text-center pt-24 h-40'>
      <Link
        href='/add-navigation'
        className='my-3 text-white bg-buttonPrimaryBg hover:bg-buttonPrimaryHoverBg focus:ring-4 focus:ring-buttonPrimaryFocusRing font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none'
      >
        + Dodaj nawigację
      </Link>
    </div>
  );
}
