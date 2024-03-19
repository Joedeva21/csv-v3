const fs = require('fs');
const os = require('os');

class CsvToMarkdown {
  constructor(delimiter = ',', lineEnding = os.EOL) {
    this.delimiter = delimiter;
    this.lineEnding = lineEnding;
  }

  // Converts CSV content to Markdown table string
  convert(csvContent) {
    const lines = csvContent.split(this.lineEnding).filter(line => line);
    if (lines.length === 0) return '';

    const headers = lines[0].split(this.delimiter);
    const rows = lines.slice(1);
    const columnWidths = this.calculateColumnWidths([headers, ...rows]);

    const markdownLines = [];
    markdownLines.push(this.formatLine(headers, columnWidths));
    markdownLines.push(this.generateSeparator(headers.length, columnWidths));

    rows.forEach(row => {
      const cells = row.split(this.delimiter);
      markdownLines.push(this.formatLine(cells, columnWidths));
    });

    return markdownLines.join(this.lineEnding);
  }

  // Reads CSV from a file and converts it to Markdown table string
  convertFromFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(this.convert(data));
      });
    });
  }

  // Helpers
  calculateColumnWidths(rows) {
    return rows[0].map((_, columnIndex) => Math.max(...rows.map(row => row[columnIndex].length)));
  }

  formatLine(cells, columnWidths) {
    return `| ${cells.map((cell, index) => cell.padEnd(columnWidths[index], ' ')).join(' | ')} |`;
  }

  generateSeparator(columnCount, columnWidths) {
    return `|${columnWidths.map(width => '-'.repeat(width + 2)).join('|')}|`;
  }
}

module.exports = CsvToMarkdown;