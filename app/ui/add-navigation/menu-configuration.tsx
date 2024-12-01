'use client';

import { useState } from 'react';
import PlusCircledIcon from '../icons/plus-circled';
import { MenuItemManage } from './menu-item-manage';
import { MenuItemType } from '@/app/lib/types';
import { nanoid } from 'nanoid';
import { MenuItemViewing } from './menu-item-viewing';
import clsx from 'clsx';

export function MenuConfiguration() {
  const [menuItems, setMenuItems] = useState<Array<MenuItemType>>([]);
  console.log(menuItems);

  const addMenuItemCreation = (parentId?: string) => {
    setMenuItems([
      ...menuItems,
      { id: nanoid(), parentId: parentId || '', label: '', mode: 'creating' },
    ]);
  };

  // Saves menu item on it's own position after creation or editing
  const saveMenuItem = (item: MenuItemType) => {
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
        // Menu items list.
        menuItems
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
                      'border-x border-x-borderPrimary border-b border-b-borderSecondary bg-secondaryBg px-6 py-4',
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
                // TODO: replace item with itemID
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
                  <div className='bg-figmaBg border-b border-x border-borderPrimary rounded-b-lg px-6 py-5'>
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
          ))
      )}
    </div>
  );
}
