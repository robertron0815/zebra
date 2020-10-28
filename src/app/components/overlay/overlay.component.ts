import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface IOverlayStyle {
  top: string;
  left: string;
  width: string;
  height: string;
  background: string;
  opacity: number;
}

@Component({
  selector: 'app-overlay',
  template: `
    <div
      class="info-text"
      [hidden]="!visibility">
      {{infoText}}
    </div>
    <div
      class="overlay"
      [ngStyle]="overlayStyle"
      [hidden]="!visibility"
      (click)="onClick()"
    >
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      cursor: pointer;
      text-align: center;
    }

    .info-text {
      color: #fff;
      width: 80%;
      /* top: 15%; */
      top: -150px;
      margin: 0 auto;
      height: 0px;
      opacity: 1;
      position: relative;
      z-index: 2;
      text-shadow: 0 0 2px rgba(0,0,0,1);
    }
  `],
})
export class OverlayComponent implements OnInit {
  private _visibility = false;
  private _background: string;

  public overlayStyle: IOverlayStyle;

  @Input() targetEl: HTMLElement;
  @Input() padding: number;
  @Input() opacity: number;
  @Input() infoText: string;

  @Input('visibility')
  set visibility(visibility: boolean) {
    this._visibility = visibility;

    if (this.targetEl) {
      this.setPositionOfElement(this.targetEl.getBoundingClientRect(), this.padding);
      window.addEventListener('resize', event => {
        this.setPositionOfElement(this.targetEl.getBoundingClientRect(), this.padding);
      });
      window.addEventListener('scroll', event => {
        this.setPositionOfElement(this.targetEl.getBoundingClientRect(), this.padding);
      });
    }
  }

  get visibility(): boolean { return this._visibility; }

  @Input('background')
  set background(background: string) {
    this._background = background;
    this.overlayStyle.background = background;
  }

  get background() { return this._background; }

  @Output() resetOverlay = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.overlayStyle = {
      top: '0px',
      left: '0px',
      width: '0px',
      height: '0px',
      background: this.background,
      opacity: this.opacity,
    };
  }

  setPositionOfElement({ top, left, width, height }: { top: number, left: number, width: number, height: number }, padding: number): void {
    this.overlayStyle = {
      ...this.overlayStyle,
      top: (top + padding * 1) + 'px',
      left: (left + padding * 1) + 'px',
      width: (width - 2 * padding) + 'px',
      height: (height - 2 * padding) + 'px'
    };
  }

  onClick(): void {
    this.resetOverlay.emit('clicked');
  }
}
