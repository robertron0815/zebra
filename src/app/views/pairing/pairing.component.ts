import { Component, OnInit, ElementRef, enableProdMode } from '@angular/core';
import { PairingService } from 'src/app/service/pairing.service';
import { HttpErrorResponse } from '@angular/common/http';

declare const EB: any;

@Component({
  selector: 'app-pairing',
  templateUrl: './pairing.component.html',
  styleUrls: ['./pairing.component.css']
})
export class PairingComponent implements OnInit {
  public parentEl: HTMLElement;
  public scanData: string;

  public carId = '';
  public beaconId = '';
  public btnPairingText = 'PAIRING';

  // Overlay
  public overlayVisibility = false;
  public overlayColor: string;

  public isValid = {
    carId: false,
    beaconId: false,
    btnPairing: false,
  };

  public isInvalid = {
    carId: false,
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

    console.log('ENABLE ON INIT');
    console.log('FUNCTION:', typeof this.fnScanEnable);
    EB.Barcode.enable({allDecoders: true}, this.fnBarcodeScanned);
  }

  /** EVENT HANDLER */

  /** Pair IDs Handler invokes postData if car id and beacon id are not empty. */
  pairIDsHandler(): void {
    this.isInvalid.carId = this.carId === '';
    this.isInvalid.beaconId = this.beaconId === '';

    if (this.carId !== '' && this.beaconId !== '') {
      this.pairingService.postPairIds(this.carId, this.beaconId)
        .subscribe(
          res => this.handleSuccessReponse(res),
          err => this.handleErrorResponse(err),
          () => console.log('Pairing completed.')
        );
    }
  }

  /** Removes isInvalid class from element. */
  removeStyleHandler(event: any): void {
    if (event.target.id === 'inp-car-id') {
      this.isInvalid.carId = this.carId === '';
    }

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
    this.isValid.carId = true;
    this.isValid.beaconId = true;
    this.isValid.btnPairing = true;
    this.btnPairingText = '';
    this.infoText = 'Pairing erfolgreich.';

    setTimeout(() => {
      this.parentEl.style.border = '5px solid #64a844';
      this.overlayVisibility = false;
      this.carId = '';
      this.beaconId = '';
      this.isValid.carId = false;
      this.isValid.beaconId = false;
      this.isValid.btnPairing = false;
      this.btnPairingText = 'PAIRING';
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
    this.btnPairingText = 'PAIRING';
  }

  getErrortext(error): string {

    if (error && error.title) {
      switch (error.title) {
        case 'Constraint Violation':
          return 'Die Beacon ID ist nicht korrekt. ' +
          'Die ID muss aus genau 12 Zeichen (Buchstaben und Zahlen) bestehen. Bitte überprüfen Sie Ihre Angabe.';
        case 'Beacon already paired':
          const beaconID = error.beacon;
          return `Die Beacon ID ${beaconID} ist bereits mit einer Kennnummer verbunden. ` +
          `Bitte überprüfen Sie Ihre Angabe.`;
        case 'Kennnummer already paired':
          const kennnr = error.kennnr;
          return `Die Kennnummer ${kennnr} ist bereits mit einem Beacon verbunden. ` +
          `Bitte überprüfen Sie Ihre Angabe.`;
        default:
          return 'Pairing ist zur Zeit nicht möglich. ' +
          'Bitte versuchen Sie es später noch einmal.';
      }
    } else {
      return 'Pairing ist zur Zeit nicht möglich. ' +
      'Bitte versuchen Sie es später noch einmal.';
    }
  }

  fnBarcodeScanned = (scan) => {
    const element = document.getElementById('scanData') as HTMLInputElement;
    console.log('BARCODE:', scan);
    this.scanData = 'barcode: ' + scan.data;
    element.value = scan.data + ' foobar';
  }

  fnScanEnable = () => {
    console.log('ENABLE Test 1', EB, EB.Barcode.enable);
    const element = document.getElementById('scanData') as HTMLInputElement;
    element.value = 'init 1';
    EB.Barcode.enable({allDecoders: true}, this.fnBarcodeScanned);
    element.value = 'init 2 - enabled: press HW trigger to capture.';
    this.scanData = 'enabled: press HW trigger to capture.';
  }

  fnScanDisable = () => {
    const element = document.getElementById('scanData') as HTMLInputElement;
    console.log('DISABLE');
    EB.Barcode.disable();
    this.scanData = 'disabled: press "enable" to scan.';
    element.value = 'disabled: press "enable" to scan.';
  }
}
