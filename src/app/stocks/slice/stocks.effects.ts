import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, tap } from "rxjs";

import { Price } from '../stocks-data-provider/price.model';
import { StocksDataProviderService } from '../stocks-data-provider/stocks-data-provider.service';

import {
  loadStockPrice,
  loadStocks,
  stockHttpError,
  updateStockPrice,
  updateStocks
} from './stocks.actions';
import { StocksState } from "./stocks.state";

@Injectable()
export class StocksEffects {
    constructor(
        private actions$: Actions,
        private store: Store<StocksState>,
        private stockDataProvider: StocksDataProviderService
    ) {
    }

    public loadStockList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadStocks),
            switchMap(() => this.stockDataProvider.getSymbolList()),
            map(dto => dto.map(item => ({ id: item.displaySymbol, stock: item }))),
            switchMap((entries) => [updateStocks({ stocks: entries })]),
            tap({
              error: (err) => {
                this.store.dispatch(stockHttpError(err))
              }
            })
          ,
        ),
    );

    public loadPrice$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadStockPrice),
            switchMap(({symbol}) => this.stockDataProvider.getPriceBySymbol(symbol)
              .pipe(
                map<Price, [string, Price]>((price) => [symbol, price]))
            ),
            switchMap(([symbol, price]) => [
              updateStockPrice(
              { symbol, price})
            ]),
            tap({
              error: (err) => {
                this.store.dispatch(stockHttpError(err))
              }
            })
        ),
    );
}
