import { createSelector, DefaultProjectorFn, MemoizedSelector } from "@ngrx/store";
import { stockEntryAdapter } from "./reducers";
import { AppState, StockEntry } from "./state";

type StockEntrySelector =
    MemoizedSelector<
    AppState,
        StockEntry | undefined,
        DefaultProjectorFn<StockEntry | undefined>
    >;

export const selectStocksState = (state: AppState) => state.stocks;
const { selectEntities, selectAll } = stockEntryAdapter.getSelectors();

export const selectSelectedStock = (state: AppState) => state.selectedStock;

export const selectAllStockEntries = createSelector(selectStocksState, selectAll);
export const selectAllStockEntities = createSelector(selectStocksState, selectEntities);

export const selecStockById = (id: string): StockEntrySelector => createSelector(
    selectAllStockEntities,
    entities => entities[id],
);