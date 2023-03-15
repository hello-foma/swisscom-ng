import { Currency } from './currency.type';

/**
 * Stock model, partial response from Symbols request
 * see https://finnhub.io/docs/api/stock-symbols
 */
export class Stock {
    public currency: Currency = "USD";
    public symbol = "";
    public displaySymbol = "";
    public description = "";
}
