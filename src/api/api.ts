import { FakeApiStore } from '~/fakeApi/fakeApiStore';
import { DataItem } from '~/fakeApi/types';
import { delay as delayFn } from '~/utils/delay';
import { getUUID } from '~/utils/getUUID';

const API_DELAY_EMULATION_TIME_IN_MS = 300;
const STORE_DATA_LS_KEY = 'STORE_DATA_LS_KEY';

const makeTestItem = (id: number, children: DataItem[]): DataItem => ({
  id: `${id.toString()}___${getUUID()}`,
  name: `Элемент ${id}`,
  sum: id * 100,
  count: id * 10,
  children,
});

const saveStoreDataToLs = (data: DataItem[]) => {
  localStorage.setItem(STORE_DATA_LS_KEY, JSON.stringify(data));
};

const makeData = () => {
  const dataFromLsStr = localStorage.getItem(STORE_DATA_LS_KEY);

  if (dataFromLsStr === null) {
    return [
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
  }

  return JSON.parse(dataFromLsStr) as DataItem[];
};

export const API = new FakeApiStore({
  data: makeData(),
  delay: () => delayFn(API_DELAY_EMULATION_TIME_IN_MS),
  generateId: getUUID,
  saveStoreDataToLs,
});
