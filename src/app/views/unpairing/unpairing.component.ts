import { Component, OnInit, ElementRef } from '@angular/core';
import { PairingService } from 'src/app/service/pairing.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-unpairing',
  templateUrl: './unpairing.component.html',
  styleUrls: ['./unpairing.component.css']
})
export class UnpairingComponent implements OnInit {
  public parentEl: HTMLElement;

  public beaconId = '';
  public btnPairingText = 'UNPAIRING';

  // Overlay
  public overlayVisibility = false;
  public overlayColor: string;

  public isValid = {
    beaconId: false,
    btnPairing: false,
  };

  public isInvalid = {
    beaconId: false,
    btnPairing: false,
  };

  infoText: string;

  constructor(
    public elRef: ElementRef,
    private pairingService: PairingService,
  ) { }

  ngOnInit() {
    this.parentEl = this.elRef.nativeElement.parentElement;
  }

  /** EVENT HANDLER */

  /** Pair IDs Handler invokes postData if car id and beacon id are not empty. */
  unpairIDsHandler(): void {
    this.isInvalid.beaconId = this.beaconId === '';

    if (this.beaconId !== '') {
      this.pairingService.postUnpairIds(this.beaconId)
        .subscribe(
          res => this.handleSuccessReponse(res),
          err => this.handleErrorResponse(err),
          () => console.log('Unpairing completed.')
        );
    }
  }

  /** Removes isInvalid class from element (arrow func to keep this to app). */
  removeStyleHandler(event: any): void {
    if (event.target.id === 'inp-beacon-id') {
      this.isInvalid.beaconId = this.beaconId === '';
    }

    // Remove borde from parent div
    this.parentEl.style.border = '1px solid black';
  }

  /** HELPER FUNCTIONS */
  handleSuccessReponse(res: JSON): void {
    this.overlayColor = '#64a844';
    this.overlayVisibility = true;
    this.isValid.beaconId = true;
    this.isValid.btnPairing = true;
    this.btnPairingText = '';
    this.infoText = 'Unpairing erfolgreich.';

    setTimeout(() => {
      this.parentEl.style.border = '5px solid #64a844';
      this.overlayVisibility = false;
      this.beaconId = '';
      this.isValid.beaconId = false;
      this.isValid.btnPairing = false;
      this.btnPairingText = 'UNPAIRING';
    }, 2000);
  }

  handleErrorResponse(error: HttpErrorResponse): void {
    this.overlayColor = '#da0c1f';
    this.overlayVisibility = true;
    this.isInvalid.btnPairing = true;
    this.btnPairingText = '';
    this.infoText = this.getErrortext(error.error);
  }

  resetOverlay() {
    this.parentEl.style.border = '5px solid #da0c1f';
    this.overlayVisibility = false;
    this.isInvalid.btnPairing = false;
    this.btnPairingText = 'UNPAIRING';
  }

  getErrortext(error): string {

    switch (error.title) {
      case 'Constraint Violation':
        return 'Die Beacon ID ist nicht korrekt. ' +
        'Die ID muss aus genau 12 Zeichen (Buchstaben und Zahlen) bestehen. Bitte überprüfen Sie Ihre Angabe.';
      case 'Beacon not paired':
        const beaconID = error.beacon;
        return `Die Beacon ID ${beaconID} ist mit keiner Kennnummer verbunden. ` +
        `Bitte überprüfen Sie Ihre Angabe.`;
      default:
        return 'Unpairing ist zur Zeit nicht möglich. ' +
        'Bitte versuchen Sie es später noch einmal.';
    }
  }
}
