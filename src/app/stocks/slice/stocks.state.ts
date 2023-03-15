import { EntityState } from '@ngrx/entity';

import { StockEntry } from './stock-entry.type';
import { PriceEntry } from './price-entry.type';

export interface StocksState {
    stocks: EntityState<StockEntry>,
    prices: EntityState<PriceEntry>,
    selectedStockId: string,
    isLoading: boolean,
}
