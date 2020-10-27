import { Component, OnInit } from '@angular/core';

declare const EB: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'zebra-tutorial';
  scanData: string;

  ngOnInit() {

    console.log('FUNCTION:', EB);
  }

  fnBarcodeScanned = (scan) => {
    const element = document.getElementById('scanData') as HTMLInputElement;
    console.log('BARCODE:', scan);
    this.scanData = 'barcode: ' + scan.data;
    element.value = scan.data + ' foobar';
  }

  fnScanEnable = () => {
    console.log('ENABLE');
    const element = document.getElementById('scanData') as HTMLInputElement;
    element.value = 'init';
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
