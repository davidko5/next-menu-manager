import { MenuItemType } from '@/app/lib/types';
import DragIcon from '../icons/drag-icon';
import clsx from 'clsx';
import { MenuItemManage } from './menu-item-manage';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function MenuItemViewing({
  item,
  menuItems,
  deleteMenuItem,
  turnOnEditingMode,
  addSubItem,
  saveMenuItem,
}: {
  item: MenuItemType;
  menuItems: MenuItemType[];
  deleteMenuItem: (id: string) => void;
  turnOnEditingMode: (id: string) => void;
  addSubItem: (parentId?: string) => void;
  saveMenuItem: (item: MenuItemType) => void;
}) {
  const itemIndex = menuItems.findIndex((el) => el.id === item.id);
  const childMenuItems = menuItems.filter((el) => el.parentId === item.id);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteClicked = () => {
    deleteMenuItem(item.id);
  };

  const handleEditClicked = () => {
    turnOnEditingMode(item.id);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {item.mode === 'viewing' && (
        <div
          className={clsx(
            'bg-primaryBg border-b border-t border-b-borderSecondary border-t-borderSecondary border-x border-x-borderPrimary  px-6 py-5 flex justify-between',
            {
              'border-t rounded-t-lg border-t-borderPrimary': itemIndex === 0,
            },
            {
              'border-l-borderSecondary rounded-bl-lg': item.parentId !== '',
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
            data-no-dnd='true'
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
              onClick={() => addSubItem(item.id)}
              type='button'
              className='px-4 py-2 text-sm font-semibold text-buttonSecondaryFg bg-buttonSecondaryBg border border-borderPrimary rounded-e-lg hover:bg-buttonSecondaryHoverBg focus:z-10 focus:outline-none focus:bg-buttonSecondaryHoverBg focus:ring-2 focus:ring-buttonSecondaryRing'
            >
              Dodaj pozycję menu
            </button>
          </div>
        </div>
      )}
      {childMenuItems.map((subItem) => (
        <div
          key={subItem.id}
          className={clsx('bg-secondaryBg pl-16', {
            'border-l border-x-borderPrimary': item.parentId === '',
            'border-r border-x-borderPrimary': subItem.mode !== 'viewing',
          })}
        >
          {subItem.mode !== 'viewing' && (
            <div className='py-5 pr-6'>
              <MenuItemManage
                item={subItem}
                saveMenuItem={saveMenuItem}
                deleteMenuItem={deleteMenuItem}
              />
            </div>
          )}

          <MenuItemViewing
            item={subItem}
            menuItems={menuItems}
            deleteMenuItem={deleteMenuItem}
            turnOnEditingMode={turnOnEditingMode}
            addSubItem={addSubItem}
            saveMenuItem={saveMenuItem}
          />
        </div>
      ))}
    </div>
  );
}
