import { useEffect } from 'react';
import { getDataView, treeListSlice } from '../treeListSlice';
import { OutlayList } from '../OutlayList';
import { RowTreeFormValues } from '../types';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { Spinner } from '~/ui/Spinner';

export function TreeListWidget() {
  const dispatch = useAppDispatch();
  const dataView = useAppSelector(getDataView);
  const isLoading = useAppSelector(treeListSlice.selectors.isLoading);

  useEffect(() => {
    dispatch(treeListSlice.thunks.fetchDataRequestThunk());
    return () => {
      dispatch(treeListSlice.actions.clear());
    };
  }, [dispatch]);

  const handleCreate = (parentId: string | null) => {
    dispatch(treeListSlice.actions.setCreateItemId({ value: parentId }));
  };

  const handleCreateCancel = () => {
    dispatch(treeListSlice.actions.setCreateItemId(null));
  };

  const handleCreateSubmit = (parentId: string | null, body: RowTreeFormValues) => {
    dispatch(treeListSlice.thunks.addDataItemRequestThunk({ parentId, body }));
  };

  const handleEdit = (id: string) => {
    dispatch(treeListSlice.actions.setEditItemId(id));
  };

  const handleEditCancel = () => {
    dispatch(treeListSlice.actions.setEditItemId(null));
  };

  const handleEditSubmit = (id: string, body: RowTreeFormValues) => {
    dispatch(treeListSlice.thunks.patchDataItemRequestThunk({ id, body }));
  };

  const handleDelete = (id: string) => {
    dispatch(treeListSlice.actions.setEditItemId(null));
    dispatch(treeListSlice.actions.setCreateItemId(null));
    setTimeout(() => {
      if (confirm('Удалить элемент вместе с дочерними?')) {
        dispatch(treeListSlice.thunks.deleteDataItemRequestThunk({ id }));
      }
    }, 100);
  };

  return (
    <>
      <Spinner isShow={isLoading} />
      <div className="p-5 text-gray-500">
        *** Для редактирования элемента дважды кликнете по нужной строке. По нажатию Escape можно выйти из режима
        редактирования или создания нового элемента. Для создания элемента или его удаления (вместе с дочерними),
        нажмите иконки в соответствущей строке
      </div>
      <div>
        {dataView && (
          <OutlayList
            onDelete={handleDelete}
            disabled={isLoading}
            deep={1}
            rowTreeNodeViewList={dataView.result}
            onCreate={handleCreate}
            onCreateCancel={handleCreateCancel}
            onCreateSubmit={handleCreateSubmit}
            onEdit={handleEdit}
            onEditCancel={handleEditCancel}
            onEditSubmit={handleEditSubmit}
          />
        )}
      </div>
    </>
  );
}
