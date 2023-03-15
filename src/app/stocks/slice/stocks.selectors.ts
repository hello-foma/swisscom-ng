import { createSelector} from "@ngrx/store";

import { priceEntryAdapter, stockEntryAdapter } from './stocks.reducers';
import { StocksState } from "./stocks.state";

export const selectStocksState = (state: StocksState) => state.stocks;
const { selectEntities, selectAll } = stockEntryAdapter.getSelectors();

export const selectSelectedStockId = (state: StocksState) => state.selectedStockId;

export const selectAllStockEntries = createSelector(selectStocksState, selectAll);
export const selectAllStockEntities = createSelector(selectStocksState, selectEntities);

export const selectPricesState = (state: StocksState) => state.prices;
const { selectEntities: selectPriceEntities } = priceEntryAdapter.getSelectors();
export const selectAllPriceEntities = createSelector(selectPricesState, selectPriceEntities);

export const selectSelectedStockWithPrice = createSelector(
  selectSelectedStockId,
  selectAllStockEntities,
  selectAllPriceEntities,
  (selectedId, stockDict, priceDict) => {
    const stock = stockDict[selectedId] || null;
    const price = priceDict[selectedId] || null;

    if (stock === null || price === null) {
      return null;
    }

    return { ...stock.stock, price: price.price };
  },
);

export const selectIsStocksLoading = (state: StocksState) => state.isLoading;
