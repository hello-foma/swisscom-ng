import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { loadStockPrice, loadStocks, selectStock } from './slice/stocks.actions';
import { StocksState } from './slice/stocks.state';
import { StockWithPrice } from './stocks-data-provider/stock-with-price.type';
import {
  selectAllStockEntries,
  selectIsStocksLoading,
  selectSelectedStockWithPrice
} from './slice/stocks.selectors';
import { Stock } from './stocks-data-provider/stock.model';

@Injectable()
export class StocksService {
  constructor(private readonly store: Store<StocksState>) { }

  /**
   * Selected by user stock
   */
  public getSelectedStock(): Observable<StockWithPrice | null> {
    return this.store.pipe(
      select(selectSelectedStockWithPrice),
    );
  }

  /**
   * All available stocks with their symbols
   */
  public getStocks(): Observable<Stock[]> {
    return this.store.pipe(
      select(selectAllStockEntries),
      map(stocks => stocks.map(entry => entry.stock)),
    )
  }

  /**
   * Loading state for Stocks
   */
  public getIsLoading(): Observable<boolean> {
    return this.store.select(selectIsStocksLoading);
  }

  /**
   * Select stock, load price for selected stock
   * @param symbol
   */
  public selectStock(symbol: string) {
    this.store.dispatch(selectStock({ stockId: symbol }));
    this.store.dispatch(loadStockPrice({ symbol }));
  }

  /**
   * Refresh stocks list data
   * If any selected stock, also update price
   */
  public async updateData() {
    this.store.dispatch(loadStocks());
    const selectedStock = await firstValueFrom(this.getSelectedStock());

    if (selectedStock) {
      this.store.dispatch(loadStockPrice({ symbol: selectedStock.symbol }));
    }
  }
}
