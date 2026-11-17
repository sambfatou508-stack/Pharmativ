import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, colorHex, isMaskable = false) {
  // Parse hex color
  const r = parseInt(colorHex.slice(1, 3), 16);
  const g = parseInt(colorHex.slice(3, 5), 16);
  const b = parseInt(colorHex.slice(5, 7), 16);

  // Raw RGBA scanlines
  const rowSize = width * 4 + 1; // 1 filter byte per row
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const crossThickness = width * 0.15;
  const crossLength = width * (isMaskable ? 0.45 : 0.6);
  const cornerRadius = isMaskable ? 0 : width * 0.22;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      // Check if inside rounded rect for background
      let inBg = true;
      if (!isMaskable) {
        const dx = Math.max(0, Math.abs(x - cx) - (cx - cornerRadius));
        const dy = Math.max(0, Math.abs(y - cy) - (cy - cornerRadius));
        inBg = Math.sqrt(dx * dx + dy * dy) <= cornerRadius;
      }

      if (!inBg) {
        rawData[pixelOffset] = 0;
        rawData[pixelOffset + 1] = 0;
        rawData[pixelOffset + 2] = 0;
        rawData[pixelOffset + 3] = 0; // Transparent
        continue;
      }

      // Check if inside medical cross
      const inVBar = Math.abs(x - cx) <= crossThickness / 2 && Math.abs(y - cy) <= crossLength / 2;
      const inHBar = Math.abs(y - cy) <= crossThickness / 2 && Math.abs(x - cx) <= crossLength / 2;
      const distFromCenter = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

      if (distFromCenter <= crossThickness * 0.4) {
        // Inner emerald dot
        rawData[pixelOffset] = 0x00;
        rawData[pixelOffset + 1] = 0x69;
        rawData[pixelOffset + 2] = 0x48;
        rawData[pixelOffset + 3] = 255;
      } else if (distFromCenter <= crossThickness * 0.65) {
        // Light mint ring
        rawData[pixelOffset] = 0x85;
        rawData[pixelOffset + 1] = 0xf8;
        rawData[pixelOffset + 2] = 0xc4;
        rawData[pixelOffset + 3] = 255;
      } else if (inVBar || inHBar) {
        // White cross
        rawData[pixelOffset] = 255;
        rawData[pixelOffset + 1] = 255;
        rawData[pixelOffset + 2] = 255;
        rawData[pixelOffset + 3] = 255;
      } else {
        // Background color
        rawData[pixelOffset] = r;
        rawData[pixelOffset + 1] = g;
        rawData[pixelOffset + 2] = b;
        rawData[pixelOffset + 3] = 255;
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(4 + 4 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4);
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  const chunks = [
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', deflated),
    makeChunk('IEND', Buffer.alloc(0))
  ];

  return Buffer.concat(chunks);
}

// Simple CRC32 implementation
function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c;
  }

  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

const outDir = path.resolve(process.cwd(), 'public');
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPNG(180, 180, '#006948', false));
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), createPNG(192, 192, '#006948', false));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), createPNG(512, 512, '#006948', false));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, '#006948', true));
fs.writeFileSync(path.join(outDir, 'favicon.ico'), createPNG(32, 32, '#006948', false));
console.log('PNG Icons generated successfully in public/');
