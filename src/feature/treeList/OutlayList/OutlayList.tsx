import { ListConnection } from '../ListConnection';
import { RowTreeFormValues, RowTreeNodeView } from '../types';
import { OutlayListViewItem } from '../OutlayListViewItem';
import { OutlayListEditItem } from '../OutlayListEditItem';
import { CancelIcon, ListItemIcon, TrashItemIcon } from '~/assets/icons';

interface OutlayListProps {
  rowTreeNodeViewList: RowTreeNodeView[];
  deep: number;
  onCreate: (parentId: string | null) => void;
  onCreateCancel: () => void;
  onCreateSubmit: (parentId: string | null, body: RowTreeFormValues) => void;
  onEdit: (id: string) => void;
  onEditCancel: () => void;
  onEditSubmit: (id: string, body: RowTreeFormValues) => void;
  onDelete: (id: string) => void;
  disabled: boolean;
}
export function OutlayList({
  rowTreeNodeViewList,
  deep,
  onCreate,
  onCreateCancel,
  onCreateSubmit,
  onEdit,
  onEditCancel,
  onEditSubmit,
  onDelete,
  disabled,
}: OutlayListProps) {
  const handleCancel = () => {
    onEditCancel();
    onCreateCancel();
  };

  return (
    <div className="p-[0 10px] overflow-y-auto flex-grow flex flex-col">
      <table className="w-full border-collapse">
        <thead>
          <tr className="h-12 text-start text-slate-300 ">
            <th>
              <span className="flex gap-2 items-start relative">
                <button
                  title={'Создать корневой элемент'}
                  onClick={() => onCreate(null)}
                  disabled={disabled}
                  className="relative z-10 bg-gray-700 w-[30px] h-[30px] flex items-center justify-center rounded-md hover:bg-gray-600"
                >
                  <ListItemIcon />
                </button>
                <span>Уровень</span>
              </span>
            </th>
            <th className="w-full min-w-96 text-start pl-1 pr-1 pt-3 pb-3">Наименование</th>
            <th className="min-w-48 text-start pl-1 pr-1 pt-3 pb-3">Кол-во</th>
            <th className="min-w-48 text-start pl-1 pr-1 pt-3 pb-3">Сумма</th>
          </tr>
        </thead>
        <tbody>
          {rowTreeNodeViewList.map((row) => {
            return (
              <tr
                key={row.body.id}
                className="border-t border-gray-700"
                title={'Двойной щелчёк для изменения'}
                onDoubleClick={() => onEdit(row.body.id)}
                role="button"
              >
                <td className="flex h-14 pr-3">
                  <ListConnection listPosition={row.listPosition} deep={deep}>
                    <div className="flex gap-[2px] rounded-md justify-center w-fit bg-gray-700">
                      <button
                        title={`Создать дочерний элемент ${row.body.id}`}
                        onClick={() => onCreate(row.body.id)}
                        disabled={disabled}
                        className="bg-gray-700 border-none w-[30px] h-[30px] rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-600"
                      >
                        <ListItemIcon />
                      </button>

                      {!row.isNew && !row.isEdit && (
                        <button
                          title={'Удалить элемент'}
                          onClick={() => onDelete(row.body.id)}
                          disabled={disabled}
                          className="bg-gray-700 border-none w-[30px] h-[30px] rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-600"
                        >
                          <TrashItemIcon />
                        </button>
                      )}

                      {row.isNew && (
                        <button
                          title={'отменить добавление элемента'}
                          onClick={onCreateCancel}
                          disabled={disabled}
                          className="bg-gray-700 border-none w-[30px] h-[30px] rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-600"
                        >
                          <CancelIcon />
                        </button>
                      )}
                      {row.isEdit && (
                        <button
                          title={'отменить редактирование элемента'}
                          onClick={onEditCancel}
                          disabled={disabled}
                          className="bg-gray-700 border-none w-[30px] h-[30px] rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-600"
                        >
                          <CancelIcon />
                        </button>
                      )}
                    </div>
                  </ListConnection>
                </td>

                {!row.isNew && !row.isEdit && <OutlayListViewItem itemBody={row.body} />}
                {row.isNew && (
                  <OutlayListEditItem
                    itemBody={row.body}
                    onSubmit={(_, values) => onCreateSubmit(row.parentId, values)}
                    disabled={disabled}
                    onEditCancel={handleCancel}
                  />
                )}
                {row.isEdit && (
                  <OutlayListEditItem
                    itemBody={row.body}
                    onSubmit={(_, values) => onEditSubmit(row.body.id, values)}
                    disabled={disabled}
                    onEditCancel={handleCancel}
                  />
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
