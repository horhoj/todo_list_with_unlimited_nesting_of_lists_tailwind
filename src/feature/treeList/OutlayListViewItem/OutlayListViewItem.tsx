import { RowTreeNodeBody } from '../types';
// import styles from './OutlayListViewItem.module.scss';

interface OutlayListViewItemProps {
  itemBody: RowTreeNodeBody;
}
export function OutlayListViewItem({ itemBody }: OutlayListViewItemProps) {
  return (
    <>
      <td className="h-14 p-1">{itemBody.name}</td>
      <td className="h-14 p-1">{itemBody.count.toLocaleString()}</td>
      <td className="h-14 p-1">{itemBody.sum.toLocaleString()}</td>
    </>
  );
}
