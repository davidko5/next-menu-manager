export interface MenuItemType {
  id: string;
  parentId?: string;
  label: string;
  url?: string;
  // Such data is needed because while 'editing' we want 'cancel' button just to change mode to 'viewing' and while 'creating' we want to remove the item
  mode?: 'creating' | 'editing' | 'viewing';
}
