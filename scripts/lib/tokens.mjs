// Shared token parsing and color utilities for apple-design scripts.
// Node built-ins only.

export const TOKEN_DECLARATION = /--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;

export function parseTokenDeclarations(markdown) {
  const light = {};
  const dark = {};
  const all = {};
  const order = [];
  const darkStart = markdown.indexOf('@media (prefers-color-scheme: dark)');

  for (const match of markdown.matchAll(TOKEN_DECLARATION)) {
    const rawName = match[1];
    const name = rawName.startsWith('apple-') ? rawName : `apple-${rawName}`;
    const value = match[2].trim();
    const isDark = darkStart >= 0 && match.index > darkStart;

    if (!(name in all)) {
      all[name] = value;
      order.push(name);
    }

    if (isDark) dark[name] = value;
    else light[name] = value;
  }

  return { light, dark, all, order };
}

export function readTokenSource(inputPath, fs) {
  return parseTokenDeclarations(fs.readFileSync(inputPath, 'utf8'));
}

export function parseColor(value) {
  const hex = /^#([0-9a-f]{3,8})$/i.exec(value.trim());
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map((char) => char + char).join('');
    if (h.length === 6 || h.length === 8) {
      const r = parseInt(h.slice(0, 2), 16) / 255;
      const g = parseInt(h.slice(2, 4), 16) / 255;
      const b = parseInt(h.slice(4, 6), 16) / 255;
      const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
      return { r, g, b, a };
    }
  }

  const rgba = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(value.trim());
  if (rgba) {
    return {
      r: Number(rgba[1]) / 255,
      g: Number(rgba[2]) / 255,
      b: Number(rgba[3]) / 255,
      a: rgba[4] === undefined ? 1 : Number(rgba[4])
    };
  }

  return null;
}

export function compositeColor(foreground, background) {
  const a = foreground.a;
  return {
    r: foreground.r * a + background.r * (1 - a),
    g: foreground.g * a + background.g * (1 - a),
    b: foreground.b * a + background.b * (1 - a),
    a: 1
  };
}

function channelLuminance(channel) {
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(color) {
  const rgb = compositeColor(color, { r: 1, g: 1, b: 1, a: 1 });
  return 0.2126 * channelLuminance(rgb.r) + 0.7152 * channelLuminance(rgb.g) + 0.0722 * channelLuminance(rgb.b);
}

export function contrastRatio(foreground, background) {
  const fg = compositeColor(foreground, background);
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function camelCase(tokenName) {
  return tokenName
    .replace(/^apple-/, '')
    .split('-')
    .map((part, index) => index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export function categoryOf(tokenName) {
  const name = tokenName.replace(/^apple-/, '');
  if (name.startsWith('color-')) return 'color';
  if (name.startsWith('font-')) return 'font';
  if (name.startsWith('type-')) return 'type';
  if (name.startsWith('space-')) return 'space';
  if (name.startsWith('radius-')) return 'radius';
  if (name.startsWith('duration-')) return 'duration';
  if (name.startsWith('ease-')) return 'ease';
  if (name.startsWith('spring-')) return 'spring';
  if (name.startsWith('shadow-') || name === 'hairline') return 'shadow';
  if (name.startsWith('z-')) return 'z';
  return 'size';
}

export function writeIfChanged(filePath, content, fs, path) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8') === content) return false;
  fs.writeFileSync(filePath, content);
  return true;
}

export function commaArgs() {
  return process.argv.slice(2);
}
