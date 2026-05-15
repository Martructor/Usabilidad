export function applySettings() {
  const fontSize = localStorage.getItem('boticario_font_size') || 'normal';
  const colorTheme = localStorage.getItem('boticario_color_theme') || 'verde';
  
  if (fontSize === 'grande') {
    document.documentElement.style.setProperty('--font-size', '18px');
  } else if (fontSize === 'muy_grande') {
    document.documentElement.style.setProperty('--font-size', '20px');
  } else {
    document.documentElement.style.setProperty('--font-size', '16px');
  }

  document.documentElement.setAttribute('data-color-theme', colorTheme);
}
