import { useState } from 'react';
import PlusCircledIcon from '../icons/plus-circled';
import { MenuItemManage } from './menu-item-manage';
import { MenuItemType } from '@/app/lib/types';
import { nanoid } from 'nanoid';
import { MenuItemViewing } from './menu-item-viewing';
import clsx from 'clsx';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
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

export function MenuConfiguration() {
  const [menuItems, setMenuItems] = useState<Array<MenuItemType>>([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(SmartPointerSensor)
  );
  
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setMenuItems((items) => {
        const oldIndex = items.indexOf(
          items.find((i) => i.id === active.id) || ({} as MenuItemType)
        );
        const newIndex = items.indexOf(
          items.find((i) => i.id === over?.id) || ({} as MenuItemType)
        );

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className='px-6 py-5 border-solid border border-borderPrimary rounded-lg bg-primaryBg mt-5'>
      <h2 className='text-textPrimary text-lg font-bold mb-3'>Pozycje menu</h2>

      {/* Placeholder when there is yet no items */}
      {!menuItems.filter((i) => i.parentId === '').length ? (
        <div className='text-center border border-solid rounded-lg border-borderSecondary bg-secondaryBg py-6'>
          <h3 className='text-textPrimary text-base font-semibold'>
            Menu jest puste
          </h3>
          <p className='text-textTertiary text-sm'>
            W tym menu nie ma jeszcze żadnych linków.
          </p>
          <button
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
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={menuItems}
            strategy={verticalListSortingStrategy}
          >
            {/* // Menu items list. */}
            {menuItems
              .filter((i) => i.parentId === '')
              .map((item, index) => (
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
                      menuItems.length === 1 && menuItems[0].mode === 'creating'
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
              ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
