import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, ActionReducerMap, createReducer, MetaReducer, on } from "@ngrx/store";
import { selectStock, updateStock, updateStocks } from "./actions";
import { AppState, StockEntry } from "./state";
import { Stock } from "./stock";

export function sort(a: StockEntry, b: StockEntry): number {
    return a.stock.displaySymbol.localeCompare(b.stock.displaySymbol);
}

export const stockEntryAdapter: EntityAdapter<StockEntry> = createEntityAdapter<StockEntry>({
    sortComparer: sort,
});

export const estockEntryInitialState: EntityState<StockEntry> = stockEntryAdapter.getInitialState({
    ids: [],
    entities: {},
});

const stockEntriesReducerInternal = createReducer(
    estockEntryInitialState,
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

const selectStockEntriesReducerInternal = createReducer(
    new Stock(),
    on(selectStock, (state, { stock }) => {
        if (stock) {
            return stock
        } else {
            return state;
        }
    }),
);

function selectStockReducer(state: Stock | undefined, action: Action): Stock {
    return selectStockEntriesReducerInternal(state, action);
}

export const reducers: ActionReducerMap<AppState> = {
    stocks: stockEntriesReducer,
    selectedStock: selectStockReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [];