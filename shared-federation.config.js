const { shareAll } = require('@angular-architects/native-federation/config');

module.exports = {
  sharedConfig: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
    '@angular/material/icon': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular/material/menu': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular/material/divider': { singleton: true, strictVersion: true, requiredVersion: 'auto' },

    // 'shared-utils': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/common': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/router': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/forms': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/platform-browser': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/platform-browser/animations': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/cdk': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/cdk/a11y': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/cdk/coercion': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/cdk/keycodes': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/cdk/platform': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/material': { singleton: true, strictVersion: true, requiredVersion: 'auto' },

    // '@angular/material/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },

    // '@angular/material/menu': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/material/button': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // 
    // '@angular/material/list': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/material/toolbar': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/material/sidenav': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/material/badge': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/material/card': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/material/form-field': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/material/stepper': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // '@angular/material/input': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // 'ngx-dropzone': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  }
};