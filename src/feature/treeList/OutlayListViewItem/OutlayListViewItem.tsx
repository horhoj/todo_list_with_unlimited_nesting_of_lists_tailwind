import { RowTreeNodeBody } from '../types';
// import styles from './OutlayListViewItem.module.scss';

interface OutlayListViewItemProps {
  itemBody: RowTreeNodeBody;
}
export function OutlayListViewItem({ itemBody }: OutlayListViewItemProps) {
  return (
    <>
      <td className="h-14 p-1">
        <span className={'block overflow-hidden text-ellipsis whitespace-nowrap text-nowrap max-w-[400px]'}>
          {itemBody.name}
        </span>
      </td>
      <td className="h-14 p-1">{itemBody.count.toLocaleString()}</td>
      <td className="h-14 p-1">{itemBody.sum.toLocaleString()}</td>
    </>
  );
}
