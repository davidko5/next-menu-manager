// import Image from "next/image";

import Link from 'next/link';
import ArrowLeftIcon from '../ui/icons/ArrowLeft';

export default function Home() {
  return (
    <div>
      <Link
        href='/'
        className='text-textTertiary font-semibold text-sm flex items-center  '
      >
        <ArrowLeftIcon className='inline h-4 mr-1' /> Wróć do listy
        nawigacji
      </Link>
    </div>
  );
}
