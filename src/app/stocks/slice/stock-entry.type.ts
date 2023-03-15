import { Stock } from '../stocks-data-provider/stock.model';

/**
 * Entry for Stock state
 */
export type StockEntry = {
  id: string;
  stock: Stock
}
