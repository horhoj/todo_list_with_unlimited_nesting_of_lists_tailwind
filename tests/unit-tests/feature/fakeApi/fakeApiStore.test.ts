import { vi } from 'vitest';
import { FakeApiStore } from '~/fakeApi/fakeApiStore';
import { DataItem } from '~/fakeApi/types';

const delay = () => Promise.resolve();

const makeTestItem = (id: number, children: DataItem[]): DataItem => ({
  id: id.toString(),
  name: `data item ${id}`,
  sum: id * 100,
  count: id * 10,
  children,
});

describe('FakeApiStore tests', () => {
  it('getDataList', async () => {
    const makeData = () => [
      makeTestItem(1, [makeTestItem(2, [])]),
      makeTestItem(3, [
        makeTestItem(4, [
          makeTestItem(7, [makeTestItem(8, [])]),
          makeTestItem(9, [makeTestItem(10, [])]),
          makeTestItem(11, [makeTestItem(12, [])]),
        ]),
      ]),
      makeTestItem(5, [makeTestItem(6, [])]),
    ];

    const saveStoreDataToLs = vi.fn();

    const store = new FakeApiStore({ data: makeData(), delay, generateId: () => '', saveStoreDataToLs });

    expect(await store.getDataList()).toEqual(makeData());

    expect(saveStoreDataToLs).toHaveBeenCalledTimes(0);
  });

  it('getDataItem должен вернуть элемент (включая его детей), по запрошенному ID', async () => {
    const makeData = (): DataItem[] => [makeTestItem(1, [makeTestItem(2, [makeTestItem(3, [makeTestItem(4, [])])])])];
    const makeExpectData = (): DataItem => makeTestItem(3, [makeTestItem(4, [])]);
    const saveStoreDataToLs = vi.fn();
    const store = new FakeApiStore({ data: makeData(), delay, generateId: () => '', saveStoreDataToLs });
    expect(await store.getItem('3')).toEqual(makeExpectData());
    expect(saveStoreDataToLs).toHaveBeenCalledTimes(0);
  });

  it('getDataItem должен вернуть null, если нет элемента с запрошенным ID', async () => {
    const makeData = (): DataItem[] => [makeTestItem(1, [makeTestItem(2, [makeTestItem(3, [makeTestItem(4, [])])])])];
    const saveStoreDataToLs = vi.fn();

    const store = new FakeApiStore({ data: makeData(), delay, generateId: () => '', saveStoreDataToLs });

    expect(await store.getItem('5')).toBeNull();

    expect(saveStoreDataToLs).toHaveBeenCalledTimes(0);
  });

  it('patchItem должен вернуть обновленное значение и список элементов должен быть модифицирован', async () => {
    const makeData = (): DataItem[] => [makeTestItem(1, [makeTestItem(2, [makeTestItem(3, [makeTestItem(4, [])])])])];
    const makeExpectData = (): DataItem[] => [
      makeTestItem(1, [makeTestItem(2, [{ ...makeTestItem(5, [makeTestItem(4, [])]), id: '3' }])]),
    ];
    const expectItem: DataItem = { ...makeTestItem(5, [makeTestItem(4, [])]), id: '3' };

    const data = makeData();

    const saveStoreDataToLs = vi.fn();

    const store = new FakeApiStore({ data, delay, generateId: () => '', saveStoreDataToLs });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, children, ...body } = makeTestItem(5, []);

    const returnDataItem = await store.patchItem('3', body);

    expect(returnDataItem).toEqual(expectItem);
    expect(data).toEqual(makeExpectData());
    expect(saveStoreDataToLs).toHaveBeenCalledTimes(1);
    expect(saveStoreDataToLs).toHaveBeenLastCalledWith(expect.objectContaining(makeExpectData()));
  });

  it('patchItem должен вернуть null, если нет элемента с запрошенным ID, а хранилище данных не должно быть модифицировано', async () => {
    const makeData = (): DataItem[] => [makeTestItem(1, [makeTestItem(2, [makeTestItem(3, [makeTestItem(4, [])])])])];

    const data = makeData();
    const saveStoreDataToLs = vi.fn();
    const store = new FakeApiStore({ data, delay, generateId: () => '', saveStoreDataToLs });

    expect(await store.patchItem('555', { count: 55, name: 'data 555', sum: 5555 })).toBeNull();
    expect(data).toEqual(makeData());
    expect(saveStoreDataToLs).toHaveBeenCalledTimes(0);
  });

  it('deleteItem должен вернуть true, если элемент был удален, а хранилище данных должно быть модифицировано', async () => {
    const makeData = (): DataItem[] => [makeTestItem(1, [makeTestItem(2, [makeTestItem(3, [makeTestItem(4, [])])])])];
    const makeExpectData = (): DataItem[] => [makeTestItem(1, [makeTestItem(2, [])])];
    const DELETE_ITEM_ID = '3';

    const saveStoreDataToLs = vi.fn();
    const data = makeData();
    const store = new FakeApiStore({ data, delay, generateId: () => '', saveStoreDataToLs });

    expect(await store.deleteItem(DELETE_ITEM_ID)).toBe(true);
    expect(data).toEqual(makeExpectData());
    expect(saveStoreDataToLs).toHaveBeenCalledTimes(1);
    expect(saveStoreDataToLs).toHaveBeenLastCalledWith(expect.objectContaining(makeExpectData()));
  });

  it('deleteItem должен вернуть false, если элемент не был найден по его ID, а хранилище данных не должно быть модифицировано', async () => {
    const makeData = (): DataItem[] => [makeTestItem(1, [makeTestItem(2, [makeTestItem(3, [makeTestItem(4, [])])])])];

    const DELETE_ITEM_ID = '555';

    const data = makeData();
    const saveStoreDataToLs = vi.fn();
    const store = new FakeApiStore({ data, delay, generateId: () => '', saveStoreDataToLs });

    expect(await store.deleteItem(DELETE_ITEM_ID)).toBe(false);
    expect(data).toEqual(makeData());
    expect(saveStoreDataToLs).toHaveBeenCalledTimes(0);
  });

  it('для parentId !== null, addItem должен вернуть id нового элемента, а а хранилище данных должно быть модифицировано', async () => {
    const NEW_ELEMENT_ID = 5;
    const PARENT_ID = 2;
    const makeData = (): DataItem[] => [makeTestItem(1, [makeTestItem(2, [makeTestItem(3, [makeTestItem(4, [])])])])];
    const makeExpectData = (): DataItem[] => [
      makeTestItem(1, [makeTestItem(2, [makeTestItem(3, [makeTestItem(4, [])]), makeTestItem(5, [])])]),
    ];
    const data = makeData();
    const saveStoreDataToLs = vi.fn();
    const store = new FakeApiStore({ data, delay, generateId: () => NEW_ELEMENT_ID.toString(), saveStoreDataToLs });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, children, ...body } = makeTestItem(NEW_ELEMENT_ID, []);
    const result = await store.addItem(PARENT_ID.toString(), body);
    expect(result).toEqual({ id: NEW_ELEMENT_ID.toString() });
    expect(data).toEqual(makeExpectData());
    expect(saveStoreDataToLs).toHaveBeenCalledTimes(1);
    expect(saveStoreDataToLs).toHaveBeenLastCalledWith(expect.objectContaining(makeExpectData()));
  });

  it('для parentId === null, addItem должен вернуть id нового элемента, а хранилище данных должно быть модифицировано', async () => {
    const NEW_ELEMENT_ID = 5;
    const PARENT_ID = null;
    const makeData = (): DataItem[] => [makeTestItem(1, [makeTestItem(2, [makeTestItem(3, [makeTestItem(4, [])])])])];
    const makeExpectData = (): DataItem[] => [
      makeTestItem(1, [makeTestItem(2, [makeTestItem(3, [makeTestItem(4, [])])])]),
      makeTestItem(5, []),
    ];
    const data = makeData();
    const saveStoreDataToLs = vi.fn();
    const store = new FakeApiStore({ data, delay, generateId: () => NEW_ELEMENT_ID.toString(), saveStoreDataToLs });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, children, ...body } = makeTestItem(NEW_ELEMENT_ID, []);
    const result = await store.addItem(PARENT_ID, body);
    expect(result).toEqual({ id: NEW_ELEMENT_ID.toString() });
    expect(data).toEqual(makeExpectData());
    expect(saveStoreDataToLs).toHaveBeenCalledTimes(1);
    expect(saveStoreDataToLs).toHaveBeenLastCalledWith(expect.objectContaining(makeExpectData()));
  });

  it('Если parentId не найден, addItem должен вернуть null, а а хранилище данных не должно быть модифицировано', async () => {
    const NEW_ELEMENT_ID = 5;
    const PARENT_ID = 555;
    const makeData = (): DataItem[] => [makeTestItem(1, [makeTestItem(2, [makeTestItem(3, [makeTestItem(4, [])])])])];

    const data = makeData();
    const saveStoreDataToLs = vi.fn();
    const store = new FakeApiStore({ data, delay, generateId: () => NEW_ELEMENT_ID.toString(), saveStoreDataToLs });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, children, ...body } = makeTestItem(NEW_ELEMENT_ID, []);
    const result = await store.addItem(PARENT_ID.toString(), body);
    expect(result).toBeNull();
    expect(data).toEqual(makeData());
    expect(saveStoreDataToLs).toHaveBeenCalledTimes(0);
  });
});
