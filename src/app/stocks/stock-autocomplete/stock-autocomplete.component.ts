import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, debounceTime, filter, first, map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { Stock } from '../stocks-data-provider/stock.model';
import { StocksService } from '../stocks.service';

@Component({
  selector: 'stocks-autocomplete',
  templateUrl: './stock-autocomplete.component.html',
  styleUrls: ['./stock-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockAutocompleteComponent implements OnInit, OnDestroy {
  private static maxSuggestOptions = 10;
  private static debounceInputTime = 200;

  private readonly destroyEvent = new Subject<void>();
  private readonly srcStocks: Observable<Stock[]> = this.stocks.getStocks();

  readonly autocomplete = new FormControl();
  readonly filteredOptions: Observable<Stock[]> = this.initFilteredStocks();

  constructor(
    private readonly stocks: StocksService
  ) { }

  ngOnInit(): void {
    this.initInitialLoading();
  }

  ngOnDestroy() {
    this.destroyEvent.next();
  }

  private initFilteredStocks(): Observable<Stock[]> {
    const inputChanges = this.autocomplete.valueChanges.pipe(
      startWith(''),
      debounceTime(StockAutocompleteComponent.debounceInputTime),
      filter(val => val !== null)
    );
    return combineLatest(
      [inputChanges, this.srcStocks]
    ).pipe(
      map(([query, srcItems]) => this.filterByString(query, srcItems))
    );
  }

  // todo: search can be improved by correct algorithm by specific case
  // todo: depends on sort, string length, structure
  private filterByString(value: string, items: Stock[]): Stock[] {
    if (value === null || value === '') {
      return items.slice(0, StockAutocompleteComponent.maxSuggestOptions);
    }

    const normalize = (str: string) => str.trim().toLowerCase();
    const filterValue = normalize(value);

    const res = [];
    let i = 0;

    while (res.length < StockAutocompleteComponent.maxSuggestOptions && i < items.length) {
      const item = items[i];
      if (normalize(item.displaySymbol || item.symbol).includes(filterValue)) {
        res.push(item);
      }
      i++;
    }

    return res;
  }

  private initInitialLoading() {
    this.autocomplete.disable();
    this.stocks.updateData();

    this.srcStocks.pipe(
      filter(stocks => stocks.length !== 0),
      first(),
      takeUntil(this.destroyEvent),
    ).subscribe({
      complete: () => {
        this.autocomplete.enable();
      }
    });
  }

  public selectSymbol(item: MatAutocompleteSelectedEvent) {
    const symbol = item.option.value;

    if (!symbol) {
      return;
    }

    this.stocks.selectStock(symbol);
    this.autocomplete.reset();
  }

  trackByStockSymbol(index: number, stock: Stock): string {
    return stock.symbol;
  }
}
