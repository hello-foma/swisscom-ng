import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { exhaustMap, map, mergeMap, switchMap } from "rxjs";
import { loadStocks, selectStock, updateStock, updateStocks } from "./actions";
import { selectAllStockEntities } from "./selectors";
import { AppState, StockEntry } from "./state";
import { Price, Stock } from "./stock";

@Injectable()
export class StocksEffects {

    private token = "sandbox_c9k210aad3i978qirhqg";

    constructor(
        public actions$: Actions,
        public store: Store<AppState>,
        public http: HttpClient) {
    }

    public load$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadStocks),
            exhaustMap(() => {
                const url = "https://finnhub.io/api/v1/stock/symbol?exchange=US&token=" + this.token;
                return this.http.get<Stock[]>(url);
            }),
            map(dto => dto.map(item => ({ id: item.displaySymbol, stock: item }))),
            switchMap((entries) => [updateStocks({ stocks: entries })]),
        ),
    );

    public loadPrice$ = createEffect(() =>
        this.actions$.pipe(
            ofType(selectStock),
            concatLatestFrom(() => this.store.select(selectAllStockEntities)),
            map(([action, entries]) => entries[action.stock.symbol]),
            mergeMap((stock) => {
                const url = "https://finnhub.io/api/v1/quote?symbol=" + stock?.id + "&token=" + this.token;
                return this.http.get<Price>(url).pipe(
                    map((price) => {
                        return {
                            ...stock,
                            stock: {
                                ...stock?.stock,
                                price: price
                            }
                        } as StockEntry;
                    })
                );
            }),
            switchMap((stock) => [updateStock({ stock })]),
        ),
    );
}
