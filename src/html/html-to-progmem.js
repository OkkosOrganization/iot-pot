const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// Paths
const distHtmlPath = path.resolve(__dirname, 'dist', 'index.html');
const outputHeaderPath = path.resolve(__dirname, 'index.h');

// Read the HTML file
fs.readFile(distHtmlPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading HTML file:', err);
    process.exit(1);
  }

  /* Escape double quotes and newlines for C-style string
  const escapedHtml = data
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/\"/g, '\\\"') // Escape double quotes
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
  const progmemString = `#ifndef INDEX_H\n#define INDEX_H\n\n#include <pgmspace.h>\n\nconst char indexHtml[] PROGMEM = \"${compressedData}\";\n\n#endif // INDEX_H\n`;    
  */

  // GZIP compression
  zlib.gzip(data, { level: 9 }, (err, compressedData) => {
    if (err) {
      process.exit(1);
      console.log(err);
    }

    // Generate the PROGMEM header content
    const progmemString = `
    #ifndef INDEX_H
    #define INDEX_H
    const unsigned char indexHtml[] PROGMEM = {${Array.from(compressedData)
      .map((byte) => `0x${byte.toString(16).padStart(2, '0')}`)
      .join(',')}};
    const unsigned int indexHtmlLen = ${compressedData.length};
    #endif // INDEX_H
    `;

    // Write to the header file
    fs.writeFile(outputHeaderPath, progmemString, 'utf8', (err) => {
      if (err) {
        console.error('Error writing header file:', err);
        process.exit(1);
      }
      console.log('index.h has been created successfully.');
    });
  });
});
