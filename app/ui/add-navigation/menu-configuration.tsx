import { useEffect, useState } from 'react';
import PlusCircledIcon from '../icons/plus-circled';
import { MenuItemManage } from './menu-item-manage';
import { MenuItemType } from '@/app/lib/types';
import { nanoid } from 'nanoid';
import { MenuItemViewing } from './menu-item-viewing';
import clsx from 'clsx';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SmartPointerSensor } from '@/app/lib/dnd-smart-pointer-sensor';
import { z } from 'zod';

const menuItemSchema = z.object({
  id: z.string(),
  parentId: z.string(),
  label: z.string().nonempty('Label is required'), // Ensures label is not empty
  mode: z.enum(['creating', 'viewing', 'editing']),
  url: z.string().optional(),
});

const initialMenuItems: Array<MenuItemType> = [
  {
    id: 'id1',
    parentId: '',
    label: 'Shoes promotion',
    url: 'good-shop.com/promotions/shoes',
    mode: 'viewing',
  },
  {
    id: 'id2',
    parentId: 'id1',
    label: 'Man shoes promotion',
    url: 'good-shop.com/promotions/shoes/man',
    mode: 'viewing',
  },
  {
    id: 'id3',
    parentId: 'id1',
    label: 'Casual man shoes promotion',
    url: 'good-shop.com/promotions/shoes/man/casual',
    mode: 'viewing',
  },
  {
    id: 'id4',
    parentId: '',
    label: 'Jewelry promotion',
    url: 'good-shop.com/promotions/jewelry',
    mode: 'viewing',
  },
  {
    id: 'id5',
    parentId: 'id4',
    label: 'Golden jewelry promotion',
    url: 'good-shop.com/promotions/jewelry/gold',
    mode: 'viewing',
  },
  {
    id: 'id6',
    parentId: 'id5',
    label: 'Golden jewelry for man promotion',
    url: 'good-shop.com/promotions/jewelry/gold/man',
    mode: 'viewing',
  },
  {
    id: 'id7',
    parentId: 'id6',
    label: 'Golden rings for man promotion',
    url: 'good-shop.com/promotions/jewelry/gold/man/rings',
    mode: 'viewing',
  },
];

const isAncestor = (
  parentId: string,
  childId: string,
  items: Array<MenuItemType>
) => {
  const findItem = (id: string) => items.find((item) => item.id === id);

  let current = findItem(childId);
  while (current && current.parentId) {
    if (current.parentId === parentId) return true;
    current = findItem(current.parentId);
  }
  return false;
};

export function MenuConfiguration() {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(SmartPointerSensor)
  );

  const [menuItems, setMenuItems] =
    useState<Array<MenuItemType>>(initialMenuItems);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  // To avoid issues with dnd-kit on SSR. Using "use client" wasn't working
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return null; // Avoid rendering on the server

  const addMenuItemCreation = (parentId?: string) => {
    setMenuItems([
      ...menuItems,
      { id: nanoid(), parentId: parentId || '', label: '', mode: 'creating' },
    ]);
  };

  // Saves menu item on it's own position after creation or editing
  const saveMenuItem = (item: MenuItemType) => {
    const validationResult = menuItemSchema.safeParse(item);

    if (!validationResult.success) {
      alert(validationResult.error.errors[0].message); // Show the first validation error
      return;
    }

    setMenuItems((prev) => {
      const index = prev.findIndex((el) => el.id === item.id);

      return [
        ...prev.slice(0, index),
        { ...item, mode: 'viewing' },
        ...prev.slice(index + 1),
      ];
    });
  };

  const turnOnEditingMode = (id: string) => {
    setMenuItems((prev) => {
      const index = prev.findIndex((el) => el.id === id);

      return [
        ...prev.slice(0, index),
        { ...prev[index], mode: 'editing' },
        ...prev.slice(index + 1),
      ];
    });
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((el) => el.id !== id));
  };

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    setActiveId(active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;
    if (over) {
      setOverId(over.id as string);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    console.log(over?.id);
    if (active.id !== over?.id) {
      setMenuItems((items) => {
        const oldIndex = items.indexOf(
          items.find((i) => i.id === active.id) || ({} as MenuItemType)
        );
        const newIndex = items.indexOf(
          items.find((i) => i.id === over?.id) || ({} as MenuItemType)
        );

        const itemsEdited = items.map((item) => {
          return item.id === active.id &&
            !isAncestor(active.id, (over?.id || '') as string, items)
            ? {
                ...item,
                parentId: over?.id ? (over.id as string) : '',
              }
            : item;
        });

        return arrayMove(itemsEdited, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className='px-6 py-5 border-solid border border-borderPrimary rounded-lg bg-primaryBg mt-5'>
      <h2 className='text-textPrimary text-lg font-bold mb-3'>Pozycje menu</h2>

      {/* Placeholder when there is yet no items */}
      {!menuItems.length ? (
        <div className='text-center border border-solid rounded-lg border-borderSecondary bg-secondaryBg py-6'>
          <h3 className='text-textPrimary text-base font-semibold'>
            Menu jest puste
          </h3>
          <p className='text-textTertiary text-sm'>
            W tym menu nie ma jeszcze żadnych linków.
          </p>
          <button
            data-testid='initial-add-button'
            type='button'
            className='btnPrimaryWithIcon'
            onClick={() => {
              addMenuItemCreation();
            }}
          >
            <PlusCircledIcon className='mr-1' /> Dodaj pozycję menu
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <SortableContext
            items={menuItems}
            strategy={verticalListSortingStrategy}
          >
            {/* // Menu items list. */}
            {menuItems
              .filter((i) => i.parentId === '')
              .map((item, index) => {
                // So we don't highlight the item that is dragged as one that could be dropped on
                const draggedOverId =
                  !activeId ||
                  !overId ||
                  activeId === overId ||
                  isAncestor(activeId, overId, menuItems)
                    ? null
                    : overId;

                return (
                  <div key={index}>
                    {item.mode === 'creating' && index === 0 ? (
                      <MenuItemManage
                        item={item}
                        saveMenuItem={saveMenuItem}
                        deleteMenuItem={deleteMenuItem}
                      />
                    ) : (
                      (item.mode === 'creating' || item.mode === 'editing') && (
                        <div
                          className={clsx(
                            'border-x border-x-borderPrimary bg-secondaryBg px-6 py-4',
                            {
                              'border-t border-t-borderPrimary rounded-t-lg':
                                index === 0,
                            }
                          )}
                        >
                          <MenuItemManage
                            item={item}
                            saveMenuItem={saveMenuItem}
                            deleteMenuItem={deleteMenuItem}
                          />
                        </div>
                      )
                    )}

                    {/* // Menu item in viewing mode */}
                    <MenuItemViewing
                      item={item}
                      menuItems={menuItems}
                      draggedOverId={draggedOverId}
                      turnOnEditingMode={turnOnEditingMode}
                      addSubItem={addMenuItemCreation}
                      deleteMenuItem={deleteMenuItem}
                      saveMenuItem={saveMenuItem}
                    />

                    {/* Menu items list footer with add-button, as per design should be displayed after at least one item is created */}
                    {/* And as per design if there is only one item in creating we don't show this footer */}
                    {index ===
                      menuItems.filter((i) => i.parentId === '').length - 1 &&
                      !(
                        menuItems.length === 1 &&
                        menuItems[0].mode === 'creating'
                      ) && (
                        <div className='bg-figmaBg border-b border-x border-borderPrimary border-t border-t-borderSecondary rounded-b-lg px-6 py-5'>
                          {/* Append one more MenuItem in editing mode */}
                          <button
                            onClick={() => addMenuItemCreation()}
                            className='btnSecondary'
                          >
                            Dodaj pozycję menu
                          </button>
                        </div>
                      )}
                  </div>
                );
              })}
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <MenuItemViewing
                isOverlay
                item={menuItems.find((i) => i.id === activeId) as MenuItemType}
                menuItems={menuItems}
                // We don't drag overlay to highlight that it dragged over by itself
                draggedOverId={null}
                turnOnEditingMode={turnOnEditingMode}
                addSubItem={addMenuItemCreation}
                deleteMenuItem={deleteMenuItem}
                saveMenuItem={saveMenuItem}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
