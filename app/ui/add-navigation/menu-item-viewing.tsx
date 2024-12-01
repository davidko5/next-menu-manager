import { MenuItemType } from '@/app/lib/types';
import DragIcon from '../icons/drag-icon';
import clsx from 'clsx';

export function MenuItemViewing({
  itemIndex,
  item,
  deleteMenuItem,
  turnOnEditingMode,
}: {
  itemIndex: number;
  item: MenuItemType;
  deleteMenuItem: (id: string) => void;
  turnOnEditingMode: (id: string) => void;
}) {
  const handleDeleteClicked = () => {
    deleteMenuItem(item.id);
  };

  const handleEditClicked = () => {
    turnOnEditingMode(item.id);
  };

  return (
    <div
      className={clsx(
        'border-b border-b-borderSecondary border-x border-x-borderPrimary  px-6 py-5 flex justify-between',
        {
          'border-t rounded-t-lg border-t-borderPrimary': itemIndex === 0,
        }
      )}
    >
      <div className='flex items-center'>
        {/* Drag Icon */}
        <DragIcon className='text-buttonTertiaryFg mr-3.5' />
        <div>
          <h2 className='text-textPrimary text-sm font-semibold'>
            {item.label}
          </h2>
          <p className='text-textTertiary text-sm'>{item.url}</p>
        </div>
      </div>
      <div
        className='inline-flex justify-self-end rounded-lg shadow-sm'
        role='group'
      >
        <button
          onClick={handleDeleteClicked}
          type='button'
          className='px-4 py-2 text-sm font-semibold text-buttonSecondaryFg bg-buttonSecondaryBg border border-borderPrimary rounded-s-lg hover:bg-buttonSecondaryHoverBg focus:z-10 focus:outline-none focus:bg-buttonSecondaryHoverBg focus:ring-2 focus:ring-buttonSecondaryRing'
        >
          Usuń
        </button>
        <button
          onClick={handleEditClicked}
          type='button'
          className='px-4 py-2 text-sm font-semibold text-buttonSecondaryFg bg-buttonSecondaryBg border-t border-b border-borderPrimary hover:bg-buttonSecondaryHoverBg focus:z-10 focus:outline-none focus:bg-buttonSecondaryHoverBg focus:ring-2 focus:ring-buttonSecondaryRing'
        >
          Edytuj
        </button>
        <button
          type='button'
          className='px-4 py-2 text-sm font-semibold text-buttonSecondaryFg bg-buttonSecondaryBg border border-borderPrimary rounded-e-lg hover:bg-buttonSecondaryHoverBg focus:z-10 focus:outline-none focus:bg-buttonSecondaryHoverBg focus:ring-2 focus:ring-buttonSecondaryRing'
        >
          Dodaj pozycję menu
        </button>
      </div>
    </div>
  );
}
