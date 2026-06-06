# SeisApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


uild at: 2026-06-05T16:47:03.278Z - Time: 3373ms
#13 5.274 
#13 6.406 No entry point found for socket.io-client/debug
#13 6.419  WARN  Sharing mapped paths with wildcards (*) not supported
#13 6.420  INFO  Building federation artefacts
#13 9.695 ✘ [ERROR] TS2300: Duplicate identifier 'AppDrawerComponent'. [plugin angular-compiler]
#13 9.695 
#13 9.695     projects/seis-portal/src/app/contenedor/componentes/app-drawer/app-drawer.component.ts:204:13:
#13 9.695       204 │ export class AppDrawerComponent implements OnDestroy {
#13 9.695           ╵              ~~~~~~~~~~~~~~~~~~
#13 9.695 
#13 9.695 ✘ [ERROR] TS2300: Duplicate identifier 'AppDrawerComponent'. [plugin angular-compiler]
#13 9.695 
#13 9.695     projects/seis-portal/src/app/contenedor/componentes/app-drawer/app-drawer.component.ts:398:13:
#13 9.695       398 │ export class AppDrawerComponent implements OnDestroy {
#13 9.695           ╵              ~~~~~~~~~~~~~~~~~~
#13 9.695 
#13 10.96 Error: Build failed with 2 errors:
#13 10.96 projects/seis-portal/src/app/contenedor/componentes/app-drawer/app-drawer.component.ts:204:13: ERROR: [plugin: angular-compiler] TS2300: Duplicate identifier 'AppDrawerComponent'.
#13 10.96 projects/seis-portal/src/app/contenedor/componentes/app-drawer/app-drawer.component.ts:398:13: ERROR: [plugin: angular-compiler] TS2300: Duplicate identifier 'AppDrawerComponent'.
#13 10.96     at failureErrorWithLog (/app/node_modules/esbuild/lib/main.js:1463:15)
#13 10.96     at /app/node_modules/esbuild/lib/main.js:924:25
#13 10.96     at /app/node_modules/esbuild/lib/main.js:1341:9
#13 10.96     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
#13 10.96   errors: [Getter/Setter],
#13 10.96   warnings: [Getter/Setter]
#13 10.96 }
#13 ERROR: process "/bin/sh -c rm -rf node_modules/.cache &&     rm -rf node_modules/.vite &&     ./node_modules/.bin/ng build shared-utils &&     ./node_modules/.bin/ng build seis-portal --configuration development --base-href=/portal/" did not complete successfully: exit code: 1
------
 > [builder 6/8] RUN rm -rf node_modules/.cache &&     rm -rf node_modules/.vite &&     ./node_modules/.bin/ng build shared-utils &&     ./node_modules/.bin/ng build seis-portal --configuration development --base-href=/portal/:
10.96 Error: Build failed with 2 errors:
10.96 projects/seis-portal/src/app/contenedor/componentes/app-drawer/app-drawer.component.ts:204:13: ERROR: [plugin: angular-compiler] TS2300: Duplicate identifier 'AppDrawerComponent'.
10.96 projects/seis-portal/src/app/contenedor/componentes/app-drawer/app-drawer.component.ts:398:13: ERROR: [plugin: angular-compiler] TS2300: Duplicate identifier 'AppDrawerComponent'.
10.96     at failureErrorWithLog (/app/node_modules/esbuild/lib/main.js:1463:15)
10.96     at /app/node_modules/esbuild/lib/main.js:924:25
10.96     at /app/node_modules/esbuild/lib/main.js:1341:9
10.96     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
10.96   errors: [Getter/Setter],
10.96   warnings: [Getter/Setter]
10.96 }