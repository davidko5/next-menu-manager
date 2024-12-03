'use client';
import Link from 'next/link';
import ArrowLeftIcon from '../ui/icons/arrow-left';
import { MenuConfiguration } from '../ui/add-navigation/menu-configuration';
import { TextInput } from '../ui/common/text-input';
import { SearchTextInput } from '../ui/common/search-text-input';
import { useState } from 'react';
import { z } from 'zod';

const menuSchema = z.object({
  menuLabel: z.string().nonempty('Label is required'), // Ensures label is not empty
  url: z.string().nonempty('Link is required'),
});

export default function Home() {
  const [menu, setMenu] = useState({ menuLabel: '', url: '' });

  const onMenuChange = (name: 'menuLabel' | 'url', value: string) => {
    setMenu((prev) => ({ ...prev, [name]: value }));
  };

  const clearMenu = () => {
    setMenu({ menuLabel: '', url: '' });
  };

  const validationResult = menuSchema.safeParse(menu);

  const saveMenu = () => {
    alert('Success');
  };

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
        <TextInput
          value={menu.menuLabel}
          onChange={(e) => {
            onMenuChange('menuLabel', e.target.value);
          }}
          label='Menu'
          placeholder='np. Promocje'
        />

        {/* Link input with icon */}
        <SearchTextInput
          value={menu.url}
          onChange={(e) => {
            onMenuChange('url', e.target.value);
          }}
          label='Link'
          placeholder='Wklej lub wyszukaj'
        />
      </div>

      {/* Main card with menu configuration */}
      <MenuConfiguration />

      <div className='flex justify-end mt-5'>
        <button onClick={clearMenu} type='button' className='btnSecondary'>
          Anuluj
        </button>
        <button
          onClick={saveMenu}
          type='button'
          disabled={!validationResult.success}
          className='btnSecondary ml-2'
        >
          Zapisz
        </button>
      </div>
    </div>
  );
}
