import { MenuItemType } from '@/app/lib/types';
import DragIcon from '../icons/drag-icon';
import clsx from 'clsx';
import { MenuItemManage } from './menu-item-manage';
import { useSortable } from '@dnd-kit/sortable';

export function MenuItemViewing({
  item,
  menuItems,
  isOverlay = false,
  draggedOverId,
  deleteMenuItem,
  turnOnEditingMode,
  addSubItem,
  saveMenuItem,
}: {
  item: MenuItemType;
  menuItems: MenuItemType[];
  // Will be used only on DragOverlay
  isOverlay?: boolean;
  draggedOverId: string | null;
  deleteMenuItem: (id: string) => void;
  turnOnEditingMode: (id: string) => void;
  addSubItem: (parentId?: string) => void;
  saveMenuItem: (item: MenuItemType) => void;
}) {
  const childMenuItems = menuItems.filter((el) => el.parentId === item.id);
  const parentItems = menuItems.filter((el) => el.parentId === item.parentId);
  const indexInParensItems = parentItems.findIndex((el) => el.id === item.id);
  const parentItem = menuItems.find((el) => el.id === item.parentId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    // That was moving items while dragging over them and was breaking the layout in our case. Left here if we decide to return it in the future.
    // transform: CSS.Translate.toString(transform),
    transform: 'none',
    transition,
  };

  const handleDeleteClicked = () => {
    deleteMenuItem(item.id);
  };

  const handleEditClicked = () => {
    turnOnEditingMode(item.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx({
        'border-2 border-dashed border-blue-400': draggedOverId === item.id,
        'selected': isDragging
      })}
      {...attributes}
      {...listeners}
    >
      {item.mode === 'viewing' && (
        <div
          data-testid='menu-item-viewing-container'
          className={clsx(
            'h-[83px] max-h-[83px] bg-primaryBg border-b border-b-borderSecondary border-x border-x-borderPrimary  px-6 py-5 flex justify-between',
            {
              // If parent is in editing and it isn't first in parents list
              'border-t border-t-borderSecondary':
                parentItem?.mode === 'editing' || indexInParensItems !== 0,
            },
            {
              // If parent doesn't have parents and is in editing
              'border-r-0':
                parentItem?.parentId && parentItem?.mode === 'editing',
            },
            {
              // The first item in the whole list
              'border-t rounded-t-lg border-t-borderPrimary':
              indexInParensItems === 0 && !item.parentId,
            },
            {
              // To be a child
              'border-l-borderSecondary': item.parentId,
            },
            {
              // To be the last child
              'rounded-bl-lg':
                item.parentId && indexInParensItems === parentItems.length - 1,
            },
            {
              // To have no children
              'border-b-0': !childMenuItems.length,
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

      {/* Menu item child elements */}
      {
        // !isDragging &&
        childMenuItems.map((subItem) => (
          <div
            key={subItem.id}
            className={clsx('bg-secondaryBg pl-16', {
              'border-l border-x-borderPrimary': item.parentId === '',
              'border-r border-x-borderPrimary': subItem.mode !== 'viewing',
              'bg-transparent border-none': isOverlay,
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
              isOverlay={isOverlay}
              item={subItem}
              menuItems={menuItems}
              draggedOverId={draggedOverId}
              deleteMenuItem={deleteMenuItem}
              turnOnEditingMode={turnOnEditingMode}
              addSubItem={addSubItem}
              saveMenuItem={saveMenuItem}
            />
          </div>
        ))
      }
    </div>
  );
}
