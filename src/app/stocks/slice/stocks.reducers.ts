import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, ActionReducerMap, createReducer, MetaReducer, on } from '@ngrx/store';

import { loadStockPrice, loadStocks, selectStock, updateStock, updateStockPrice, updateStocks } from './stocks.actions';
import { StocksState } from "./stocks.state";
import { StockEntry } from './stock-entry.type';
import { PriceEntry } from './price-entry.type';

export function sort(a: StockEntry, b: StockEntry): number {
    return a.stock.displaySymbol.localeCompare(b.stock.displaySymbol);
}

export const stockEntryAdapter: EntityAdapter<StockEntry> = createEntityAdapter<StockEntry>({
    sortComparer: sort,
});

export const priceEntryAdapter: EntityAdapter<PriceEntry> = createEntityAdapter<PriceEntry>();

export const stockEntryInitialState: EntityState<StockEntry> = stockEntryAdapter.getInitialState({
    ids: [],
    entities: {},
});

export const priceEntryInitialState: EntityState<PriceEntry> = priceEntryAdapter.getInitialState({
  ids: [],
  entities: {},
});

const stockEntriesReducerInternal = createReducer(
    stockEntryInitialState,
    on(updateStocks, (state, { stocks }) =>
        stockEntryAdapter.setAll(stocks, state),
    ),
    on(updateStock, (state, { stock }) => {
        if (stock) {
            return stockEntryAdapter.upsertOne(stock, state)
        } else {
            return state;
        }
    }),
);

function stockEntriesReducer(state: EntityState<StockEntry> | undefined, action: Action): EntityState<StockEntry> {
    return stockEntriesReducerInternal(state, action);
}

const priceEntriesReducerInternal = createReducer(
  priceEntryInitialState,
  on(updateStockPrice, (state, { symbol: id, price }) => {
    return priceEntryAdapter.upsertOne({id, price}, state)
  }),
);

function priceEntriesReducer(state: EntityState<PriceEntry> | undefined, action: Action): EntityState<PriceEntry> {
  return priceEntriesReducerInternal(state, action);
}

const selectStockEntriesReducerInternal = createReducer(
    '',
    on(selectStock, (state, { stockId }) => {
        if (stockId) {
            return stockId;
        } else {
            return state;
        }
    }),
);

function selectStockReducer(state: string | undefined, action: Action): string {
    return selectStockEntriesReducerInternal(state, action);
}

const isLoadingReducer = createReducer(
  false,
  on(loadStockPrice, loadStocks, () => true),
  on(updateStockPrice, updateStock, updateStocks, () => false),
)

// todo: separate reducers to their own files
export const reducers: ActionReducerMap<StocksState> = {
    stocks: stockEntriesReducer,
    selectedStockId: selectStockReducer,
    prices: priceEntriesReducer,
    isLoading: isLoadingReducer
};

export const metaReducers: MetaReducer<StocksState>[] = [];
