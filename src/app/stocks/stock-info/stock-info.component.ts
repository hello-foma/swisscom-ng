import { ChangeDetectionStrategy, Component } from '@angular/core';

import { StocksService } from '../stocks.service';

@Component({
  selector: 'stocks-info',
  templateUrl: './stock-info.component.html',
  styleUrls: ['./stock-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockInfoComponent {
  readonly selectedStock = this.stocks.getSelectedStock();

  constructor(private readonly stocks: StocksService) { }
}
