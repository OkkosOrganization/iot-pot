const fs = require('fs');
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

  // Escape double quotes and newlines for C-style string
  const escapedHtml = data
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/\"/g, '\\\"') // Escape double quotes
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');

  // Wrap the HTML content in a PROGMEM declaration
  const progmemString = `#ifndef INDEX_H\n#define INDEX_H\n\n#include <pgmspace.h>\n\nconst char indexHtml[] PROGMEM = \"${escapedHtml}\";\n\n#endif // INDEX_H\n`;

  // Write to the header file
  fs.writeFile(outputHeaderPath, progmemString, 'utf8', (err) => {
    if (err) {
      console.error('Error writing header file:', err);
      process.exit(1);
    }
    console.log('index.h has been created successfully.');
  });
});
