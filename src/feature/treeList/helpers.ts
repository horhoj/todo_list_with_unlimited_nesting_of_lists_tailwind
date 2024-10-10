import { CreateItemId, ListPosition, RowTreeNodeView } from './types';
import { getUUID } from '~/utils/getUUID';
import { DataItem } from '~/fakeApi/types';

export const makeRowTreeNodeViewList = (
  originalTree: DataItem[],
  createItemId: CreateItemId | null,
  editItemId: string | null,
) => {
  let newDataItemId: string | null;
  const makeNew = (id: string): DataItem => ({
    id,
    name: '',
    count: 0,
    sum: 0,
    children: [],
  });

  const result: RowTreeNodeView[] = [];
  let deep = 0;

  const tree = originalTree.slice();
  if (createItemId?.value === null) {
    newDataItemId = getUUID();
    tree.push(makeNew(newDataItemId));
  }

  const runner = (tree: DataItem[], prevListPosition: ListPosition[], parentId: string | null) => {
    tree.forEach(({ children, ...body }, index, arr) => {
      let listPosition: ListPosition = ListPosition.START;
      if (index < arr.length - 1 && index > 0) {
        listPosition = ListPosition.CENTER;
      }
      if (index === arr.length - 1) {
        listPosition = ListPosition.END;
      }
      if (arr.length > deep) {
        deep = arr.length;
      }
      const lastPrevPosition = prevListPosition[prevListPosition.length - 1];
      const prevListPositionClone = prevListPosition.slice();
      if (lastPrevPosition === ListPosition.END) {
        prevListPositionClone[prevListPosition.length - 1] = ListPosition.EMPTY;
      }
      if (lastPrevPosition === ListPosition.CENTER || lastPrevPosition === ListPosition.START) {
        prevListPositionClone[prevListPosition.length - 1] = ListPosition.BOUND;
      }

      const currentListPosition = [...prevListPositionClone, listPosition];
      result.push({
        body,
        listPosition: currentListPosition,
        isNew: newDataItemId === body.id,
        parentId,
        isEdit: editItemId === body.id,
      });
      const actualChild = children.slice();
      if (createItemId?.value === body.id) {
        newDataItemId = getUUID();
        actualChild.push(makeNew(newDataItemId));
      }

      runner(actualChild, currentListPosition, body.id);
    });
  };

  runner(tree, [], null);

  return { result, deep };
};
