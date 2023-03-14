import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { select, Store } from '@ngrx/store';
import { map, startWith, switchMap } from 'rxjs';
import { loadStocks, selectStock } from './actions';
import { selecStockById, selectAllStockEntries, selectSelectedStock } from './selectors';
import { AppState } from './state';
import { Stock } from './stock';

@Component({
  selector: 'stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss'],
})
export class StocksComponent{
  autocomplete = new FormControl();
  filteredOptions: Stock[] = [];
  objects: Stock[] = []
  stock: Stock | undefined;

  constructor(readonly client: HttpClient, readonly store: Store<AppState>) {
    this.autocomplete.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    ).subscribe(
      v => {
        this.filteredOptions = v;
      }
    );

    this.store.pipe(
      select(selectAllStockEntries),
      map(stocks => stocks.map(e => e.stock)))
      .subscribe(arr => {
        this.objects = arr;
      });

      this.store.pipe(
        select(selectSelectedStock),
        switchMap(s => this.store.select(selecStockById(s.symbol))),
        map(s => s?.stock),
      )
      .subscribe(selected => {
        this.stock = selected;
      });

    this.store.dispatch(loadStocks());
  }

  private _filter(value: string): Stock[] {
    const filterValue = value?.toLowerCase();

    if (!filterValue || filterValue.length < 2) {
      return [];
    }

    return this.objects.filter(objects => objects.displaySymbol.toLowerCase().includes(filterValue));
  }

  public callApi() {
    this.store.dispatch(loadStocks());
  }

  public selectSymbol(item: MatAutocompleteSelectedEvent) {
    console.log(item.option.value);
    let found = this.objects.find(element => element.symbol == item.option.value);

    if (!found) {
      return;
    }

    this.store.dispatch(selectStock({ stock: found }));
    this.autocomplete.reset();
  }
}
