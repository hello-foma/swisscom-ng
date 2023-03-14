import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public get isMenuOpened() {
    return this.drawer?.opened;
  }

  @ViewChild('drawer') drawer!: MatDrawer;

  public toggleMenu() {
    this.drawer.toggle();
  }
}
