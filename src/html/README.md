# Configuration web app

The configuration app is served by the Arduino web server. The app is a single HTML-file with CSS,JS and fonts inlined. The [index.h](./index.h) file contains all the HTML in a string.

## Requirements

1. Make sure you have recent version of Node.js installed
2. Also install the VSCode extension 'Prettier - Code formatter'

## Development

The [src](./src) folder contains all the source code (HTML,CSS,JS) for the app. Webpack is used to bundle all the code into a single HTML file. The script [html-to-progmem] copies the content of the Webpack generated HTML-file into [index.h](./index.h). The script can be executed by running 'npm run build-and-convert'.

To start development:

1. run 'npm install'
2. run 'npm run dev' to start the Webpack dev server
3. open your browser and navigate to [http://localhost:8080/](http://localhost:8080/)

To build the app:

1. run 'npm run build' to build the HTML-file into the [dist](./dist) folder
2. run 'npm run build-and-convert' to copy the contents of the HTML-file into index.h
