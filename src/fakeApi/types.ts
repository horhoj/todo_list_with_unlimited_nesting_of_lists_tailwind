export interface DataBodyItem {
  name: string;
  count: number;
  sum: number;
}

export interface DataItem extends DataBodyItem {
  id: string;
  children: DataItem[];
}

export interface FakeApiStoreContract {
  getDataList(): Promise<DataItem[]>;
  getItem(id: string): Promise<DataItem | null>;
  addItem(parentId: string | null, body: DataBodyItem): Promise<{ id: string } | null>;
  patchItem(id: string, body: DataBodyItem): Promise<DataItem | null>;
  deleteItem(id: string): Promise<boolean>;
}
