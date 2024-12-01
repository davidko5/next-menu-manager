import Link from 'next/link';
import ArrowLeftIcon from '../ui/icons/arrow-left';
import { MenuConfiguration } from '../ui/add-navigation/menu-configuration';
import { TextInput } from '../ui/common/text-input';
import { SearchTextInput } from '../ui/common/search-text-input';

export default function Home() {
  return (
    <div className='p-6'>
      <Link
        href='/'
        className='text-textTertiary font-semibold text-sm flex items-center  '
      >
        <ArrowLeftIcon className='inline h-3 mr-3' /> Wróć do listy nawigacji
      </Link>

      <h1 className='text-textPrimary text-2xl font-bold pt-5 pb-4'>
        Dodaj nawigację
      </h1>

      {/* Card with menu main inputs. Menu and Link */}
      <div className='px-6 py-5 border-solid border border-borderPrimary rounded-lg bg-primaryBg'>
        <h2 className='text-textPrimary text-lg font-bold mb-3'>Nazwa</h2>

        {/* Menu input */}
        <TextInput label='Menu' placeholder='np. Promocje'  />
        
        {/* Link input with icon */}
       <SearchTextInput label='Link' placeholder='Wklej lub wyszukaj' />
      </div>

      {/* Main card with menu configuration */}
      <MenuConfiguration />

      <div className='flex justify-end mt-5'>
        <button
          type='button'
          className='btnSecondary'
        >
          Anuluj
        </button>
        <button
          type='button'
          disabled
          className='btnSecondary ml-2'
        >
          Zapisz
        </button>
      </div>
    </div>
  );
}
