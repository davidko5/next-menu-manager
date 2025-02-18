import { MenuItemType } from '@/app/lib/types';
import DragIcon from '../icons/drag-icon';
import clsx from 'clsx';
import { MenuItemManage } from './menu-item-manage';
import { useSortable } from '@dnd-kit/sortable';
import { useEffect, useRef, useState } from 'react';
import DeleteBucketIcon from '../icons/delete-bucket-icon';
import PlusCircledIcon from '../icons/plus-circled';
import EditIcon from '../icons/edit';
import useWindowDimensions from '@/app/lib/use-window-dimensions.hook';

export function MenuItemViewing({
  item,
  menuItems,
  isOverlay = false,
  draggedOverId,
  deleteMenuItem,
  turnOnEditingMode,
  addSubItem,
  saveMenuItem,
  dropPosition,
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
  dropPosition: 'top' | 'middle' | 'bottom' | null;
}) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const boxRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  const childMenuItems = menuItems.filter((el) => el.parentId === item.id);
  const parentItems = menuItems.filter((el) => el.parentId === item.parentId);
  const indexInParensItems = parentItems.findIndex((el) => el.id === item.id);
  const parentItem = menuItems.find((el) => el.id === item.parentId);

  const { attributes, listeners, setNodeRef, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    // That was moving items while dragging over them and was breaking the layout in our case. Left here if we decide to return it in the future.
    // transform: CSS.Translate.toString(transform),
    transform: 'none',
    transition,
    touchAction: 'none', // Prevent default touch behaviors. Needed for dnd to work on touch devices
  };

  const handleDeleteClicked = () => {
    deleteMenuItem(item.id);
  };

  const handleEditClicked = () => {
    turnOnEditingMode(item.id);
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (boxRef.current) {
        const { scrollHeight, clientHeight, scrollWidth, clientWidth } =
          boxRef.current;
        setIsOverflow(scrollHeight > clientHeight || scrollWidth > clientWidth);
      }
    };

    checkOverflow(); // Initial check
    window.addEventListener('resize', checkOverflow); // Re-check on resize
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx({
        'border-4 border-dashed border-blue-400':
          draggedOverId === item.id && dropPosition === 'middle',

        selected: isDragging,
      })}
      {...attributes}
      {...listeners}
    >
      {item.mode === 'viewing' && (
        <div
          ref={boxRef}
          data-testid='menu-item-viewing-container'
          className={clsx(
            'h-[83px] max-h-[83px] bg-primaryBg border-b border-b-borderSecondary border-x border-x-borderPrimary  px-6 py-5 flex justify-between',
            {
              'px-[5px]': isMobile,
              // If parent is in editing and it isn't first in parents list
              'border-t border-t-borderSecondary':
                parentItem?.mode === 'editing' || indexInParensItems !== 0,
              // If parent doesn't have parents and is in editing
              'border-r-0':
                parentItem?.parentId && parentItem?.mode === 'editing',
              // The first item in the whole list
              'border-t rounded-t-lg border-t-borderPrimary':
                indexInParensItems === 0 && !item.parentId,
              // To be a child
              'border-l-borderSecondary': item.parentId,
              // To be the last child
              'rounded-bl-lg':
                item.parentId && indexInParensItems === parentItems.length - 1,
              // To have no children
              'border-b-0': !childMenuItems.length,
              '!border-t-4 !border-t-blue-400':
                draggedOverId === item.id && dropPosition === 'top',
              '!border-b-4 !border-b-blue-400':
                draggedOverId === item.id && dropPosition === 'bottom',
              'opacity-55': isOverlay,
            }
          )}
        >
          <div
            className={clsx('w-[calc(100%-89px-34px)] flex items-center', {
              '!w-[calc(100%-89px)]': isMobile,
            })}
          >
            {/* Drag Icon */}
            {!isMobile && <DragIcon className='text-buttonTertiaryFg mr-3.5' />}
            <div className='w-full'>
              <h2 className='text-textPrimary text-sm font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis'>
                {item.label}
              </h2>
              <p className='text-textTertiary text-sm whitespace-nowrap overflow-hidden overflow-ellipsis'>
                {item.url}
              </p>
            </div>
          </div>
          <div
            className='inline-flex rounded-lg shadow-sm'
            role='group'
            data-no-dnd='true'
          >
            <button
              onClick={handleDeleteClicked}
              type='button'
              className={clsx(
                'px-4 py-2 text-sm font-semibold text-buttonSecondaryFg bg-buttonSecondaryBg border border-borderPrimary rounded-s-lg hover:bg-buttonSecondaryHoverBg whitespace-nowrap focus:z-10 focus:outline-none focus:bg-buttonSecondaryHoverBg focus:ring-2 focus:ring-buttonSecondaryRing',
                { 'iconBtn rounded-r-none px-1 py-0': isOverflow }
              )}
            >
              {isOverflow ? <DeleteBucketIcon /> : 'Usuń'}
            </button>
            <button
              onClick={handleEditClicked}
              type='button'
              className={clsx(
                'px-4 py-2 text-sm font-semibold text-buttonSecondaryFg bg-buttonSecondaryBg border-t border-b border-borderPrimary hover:bg-buttonSecondaryHoverBg whitespace-nowrap focus:z-10 focus:outline-none focus:bg-buttonSecondaryHoverBg focus:ring-2 focus:ring-buttonSecondaryRing',
                { 'iconBtn rounded-none px-1 py-0 ': isOverflow }
              )}
            >
              {isOverflow ? <EditIcon /> : 'Edytuj'}
            </button>
            <button
              onClick={() => addSubItem(item.id)}
              type='button'
              className={clsx(
                'px-4 py-2 text-sm font-semibold text-buttonSecondaryFg bg-buttonSecondaryBg border border-borderPrimary rounded-e-lg hover:bg-buttonSecondaryHoverBg whitespace-nowrap focus:z-10 focus:outline-none focus:bg-buttonSecondaryHoverBg focus:ring-2 focus:ring-buttonSecondaryRing',
                { 'iconBtn rounded-l-none px-1 py-0': isOverflow }
              )}
            >
              {isOverflow ? <PlusCircledIcon /> : 'Dodaj pozycję menu'}
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
              dropPosition={dropPosition}
            />
          </div>
        ))
      }
    </div>
  );
}
