import { useState } from 'react';
import { SearchTextInput } from '../common/search-text-input';
import { TextInput } from '../common/text-input';
import DeleteBucketIcon from '../icons/delete-bucket-icon';
import { MenuItemType } from '@/app/lib/types';

export function MenuItemManage({
  item,
  saveMenuItem,
  deleteMenuItem,
}: {
  item: MenuItemType;
  saveMenuItem: (arg: MenuItemType) => void;
  deleteMenuItem: (id: string) => void;
}) {
  const [menuItem, setMenuItem] = useState<MenuItemType>(item);

  const onInputChange = ({
    name,
    value,
  }: {
    name: keyof MenuItemType;
    value: string;
  }) => {
    setMenuItem({ ...menuItem, [name]: value });
  };

  const handleSaveMenuItem = () => {
    saveMenuItem(menuItem);
  };

  const handleDeleteMenuItem = () => {
    deleteMenuItem(menuItem.id);
  };

  const handleCancelClicked = () => {
    if (item.mode === 'editing') {
      saveMenuItem({ ...item, mode: 'viewing' });
    } else if (item.mode === 'creating') deleteMenuItem(menuItem.id);
  };

  return (
    <div className='bg-primaryBg border border-borderPrimary rounded-lg px-6 py-5'>
      {/* Form inputs and delete icon-button wrapper */}
      <div className='flex'>
        <div className='flex-1'>
          <TextInput
            value={menuItem.label}
            onChange={(e) =>
              onInputChange({ name: 'label', value: e.target.value })
            }
            label='Nazwa'
            placeholder='np. Promocje'
          />
          <SearchTextInput
            value={menuItem.url || ''}
            onChange={(e) =>
              onInputChange({ name: 'url', value: e.target.value })
            }
            label='Link'
            placeholder='Wlej lub wyszukaj'
          />
        </div>
        <div className='mt-[12.5px] mr-[16.5px] ml-[28.5px]'>
          <button
            onClick={handleDeleteMenuItem}
            type='button'
            className='iconBtn'
          >
            <DeleteBucketIcon />
          </button>
        </div>
      </div>
      {/* Anuluj/Dodaj buttons wrapper */}
      <div className='mt-5'>
        <button
          onClick={handleCancelClicked}
          type='button'
          className='btnSecondary mr-2'
        >
          Anuluj
        </button>
        <button
          onClick={handleSaveMenuItem}
          type='button'
          className='btnSecondaryColor'
        >
          Dodaj
        </button>
      </div>
    </div>
  );
}
