import { createAction, props } from '@ngrx/store';

import { Price } from '../stocks-data-provider/price.model';

import { StockEntry } from './stock-entry.type';

export const loadStocks = createAction(
    '[Stocks] Load'
);

export const updateStocks = createAction(
    '[Stocks] Update',
    props<{ stocks: StockEntry[] }>(),
);

export const updateStock = createAction(
    '[Stocks] Update one',
    props<{ stock: StockEntry | null }>(),
);

export const selectStock = createAction(
    '[Stocks] Select',
    props<{ stockId: string }>(),
);

export const loadStockPrice = createAction(
    '[Stocks] Load price',
    props<{ symbol: string }>(),
);

export const updateStockPrice = createAction(
  '[Stocks] Update price',
  props<{ symbol: string, price: Price }>(),
);

export const stockHttpError = createAction(
  '[Stocks] http error',
  props<{ error: any }>(),
);
