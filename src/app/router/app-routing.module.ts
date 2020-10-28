import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { PairingComponent } from '../views/pairing/pairing.component';
import { UnpairingComponent } from '../views/unpairing/unpairing.component';

const routes: Routes = [
  { path: '', component: PairingComponent },
  { path: 'unpairing', component: UnpairingComponent },
  { path: '**', component: PairingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }