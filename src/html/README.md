# Configuration web app

The configuration app is served by the Arduino web server. The app is basically a single HTML-string with CSS, JS and fonts inlined. The file [index.h](./index.h) contains the HTML-string as a 'PROGMEM'-string, which means that the string is saved in the Arduino's Flash memory and saves RAM.

## Requirements

1. Make sure you have recent version of Node.js installed
2. Also install the VSCode extension 'Prettier - Code formatter'

## Development

The [/src](./src) folder contains all the source code (HTML,CSS,JS) and assets (fonts) for the app. Webpack is used to bundle all the code into a single HTML file. The JS-script [html-to-progmem.js](./html-to-progmem.js) copies the content of the Webpack generated HTML-file into [index.h](./index.h). The script can be executed by running `npm run build-and-convert`.

To start development:

1. run `npm install`
2. run `npm run dev` to start the Webpack dev server
3. open a browser and navigate to [http://localhost:8080/](http://localhost:8080/)

To build the app:

1. run `npm run build` to build the HTML-file into the [/dist](./dist) folder
2. run `npm run build-and-convert` to copy the contents of the HTML-file into [index.h](./index.h)
