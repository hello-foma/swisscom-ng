import { Price } from './price.model';
import { Stock } from './stock.model';

/**
 * Enriched Stock with Price
 */
export type StockWithPrice = Stock & {price: Price};
