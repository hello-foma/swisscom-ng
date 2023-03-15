import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Stock } from './stock.model';
import { Price } from './price.model';
import { QuoteResponse } from './quote-response.type';

@Injectable()
export class StocksDataProviderService {
  private token = environment.finnhubToken;
  private apiUrl = environment.finnhubApiUrl;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Load list of symbols info, heavy request without limit
   * https://finnhub.io/docs/api/stock-symbols
   */
  getSymbolList(): Observable<Stock[]> {
    const url = `${this.apiUrl}stock/symbol?exchange=US&token=${this.token}`;

    return this.http.get<Stock[]>(url);
  }

  /**
   * Get stock for specified symbol
   * https://finnhub.io/docs/api/quote
   * @param symbol
   */
  getPriceBySymbol(symbol: string): Observable<Price> {
    const url = `${this.apiUrl}quote?symbol=${symbol}&token=${this.token}`;

    return this.http.get<QuoteResponse>(url).pipe(
      map(data => new Price(data.c))
    );
  }
}
