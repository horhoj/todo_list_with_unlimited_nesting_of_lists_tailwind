import cloneDeep from 'lodash.clonedeep';
import { DataBodyItem, DataItem, FakeApiStoreContract } from './types';

export class FakeApiStore implements FakeApiStoreContract {
  private data: DataItem[];
  private delay: () => Promise<void>;
  private generateId: () => string;

  private saveStoreDataToLs: (data: DataItem[]) => void;

  public constructor(payload: {
    data: DataItem[];
    delay: () => Promise<void>;
    generateId: () => string;
    saveStoreDataToLs: (data: DataItem[]) => void;
  }) {
    this.data = payload.data;
    this.delay = payload.delay;
    this.generateId = payload.generateId;
    this.saveStoreDataToLs = payload.saveStoreDataToLs;
  }

  private saveData() {
    this.saveStoreDataToLs(this.data);
  }

  public async getDataList() {
    await this.delay();
    return cloneDeep(this.data);
  }

  public async getItem(id: string): Promise<DataItem | null> {
    await this.delay();
    const stack = [...this.data];

    while (stack.length > 0) {
      const current = stack.shift();
      if (current !== undefined) {
        if (current.id === id) {
          return cloneDeep(current);
        }
        stack.unshift(...current.children);
      }
    }

    return null;
  }

  public async addItem(parentId: string | null, body: DataBodyItem): Promise<{ id: string } | null> {
    await this.delay();

    if (parentId === null) {
      const id = this.generateId();
      this.data.push({ id, ...body, children: [] });
      this.saveData();
      return { id };
    }

    const stack = [...this.data];

    while (stack.length > 0) {
      const current = stack.shift();
      if (current !== undefined) {
        if (current.id === parentId) {
          const id = this.generateId();
          current.children.push({ id, ...body, children: [] });
          this.saveData();
          return { id };
        }
        stack.unshift(...current.children);
      }
    }

    return null;
  }

  public async patchItem(id: string, body: DataBodyItem): Promise<DataItem | null> {
    await this.delay();
    const stack = [...this.data];

    while (stack.length > 0) {
      const current = stack.shift();
      if (current !== undefined) {
        if (current.id === id) {
          current.name = body.name;
          current.count = body.count;
          current.sum = body.sum;
          this.saveData();
          return cloneDeep(current);
        }
        stack.unshift(...current.children);
      }
    }

    return null;
  }

  public async deleteItem(id: string): Promise<boolean> {
    await this.delay();
    interface StackItem {
      parent: DataItem[];
      indexInParent: number;
      dataItem: DataItem;
    }

    const stack: StackItem[] = this.data.map((el, i, arr) => ({ parent: arr, indexInParent: i, dataItem: el }));

    while (stack.length > 0) {
      const current = stack.shift();
      if (current !== undefined) {
        if (current.dataItem.id === id) {
          current.parent.splice(current.indexInParent, 1);
          this.saveData();
          return true;
        }
        stack.unshift(
          ...current.dataItem.children.map((el, i, arr) => ({ parent: arr, indexInParent: i, dataItem: el })),
        );
      }
    }

    return false;
  }
}
