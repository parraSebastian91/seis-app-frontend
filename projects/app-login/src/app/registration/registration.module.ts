import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegistrationPageComponent } from './registration-page/registration-page.component';

const routes: Routes = [
  { path: '', component: RegistrationPageComponent },
];

// Este módulo ya sólo enruta: en Angular 19 los componentes son standalone por
// defecto, así que las 5 páginas del registro se IMPORTAN, no se declaran. El
// código venía de Angular <=18 (donde el default era `standalone: false`) y por
// eso el build de app-login estaba roto en main con 5 errores TS-996008.
// Cada componente declara ahora sus propias dependencias; el módulo no tiene
// que arrastrar las de todos.
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    RegistrationPageComponent,
  ],
})
export class RegistrationModule {}
