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
  selector: 'app-not-authorised-overlay',
  template: `
    <div class="overlay-container"
        [hidden]="!visibility"
        (click)="onOverlayClicked()">
      <div
        class="overlay"
        [ngStyle]="overlayStyle"
        [hidden]="!visibility">

        <div
          class="info-title"
          [hidden]="!visibility">
          {{ infoTitleText }}
        </div>
        <div
          class="info-reason"
          [hidden]="!visibility">
          {{ infoReasonText }}
        </div>
        <div
          class="info-proposal"
          [hidden]="!visibility">
          {{ infoProposalText }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay-container {
      position: absolute;
      top: 0% !important;
      width: 100% !important;
      height: 100% !important;
      cursor: pointer;
    }
    .overlay {
      position: absolute;
      top: 10% !important;
      left: 25% !important;
      width: 50% !important;
      height: 50% !important;
      cursor: pointer;
      text-align: center;
    }

    .info-title, .info-reason, .info-proposal {
      color: #000;
      top: 20%;
      margin: 0 auto;
      opacity: 1;
      position: relative;
      z-index: 2;
      font-weight: 700;
      text-align: center;
      font-size: 1.5em;
    }
  `]
})
export class NotAuthorisedOverlayComponent implements OnInit {

  private _visibility = false;
  private _background: string;

  public overlayStyle: IOverlayStyle;

  @Input() targetEl: HTMLElement;
  @Input() padding: number;
  @Input() opacity: number;
  @Input() infoTitleText: string;
  @Input() infoReasonText: string;
  @Input() infoProposalText: string;
  @Output() notAuthorizedLogout = new EventEmitter();

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
      top: '25%',
      left: '25%',
      width: '50%',
      height: '50%',
      background: 'rgba(218, 12, 31, 0.8)',
      opacity: 100,
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

  onOverlayClicked(): void {
    this.notAuthorizedLogout.emit('clicked');
  }
}
