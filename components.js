// components.js — VectorLogix UI Building Blocks

// ── DOM Utility ───────────────────────────────────────────────
function createElement(tag, options = {}) {
  const el = document.createElement(tag);
  if (options.className)   el.className = options.className;
  if (options.id)          el.id = options.id;
  if (options.innerHTML)   el.innerHTML = options.innerHTML;
  if (options.textContent) el.textContent = options.textContent;
  if (options.styles)      Object.entries(options.styles).forEach(([k,v]) => el.style[k] = v);
  if (options.attributes)  Object.entries(options.attributes).forEach(([k,v]) => el.setAttribute(k,v));
  if (options.onClick)     el.addEventListener('click',  options.onClick);
  if (options.onChange)    el.addEventListener('change', options.onChange);
  if (options.onInput)     el.addEventListener('input',  options.onInput);
  if (options.children)    options.children.forEach(c => { if (c) el.appendChild(c); });
  return el;
}

// ── Bootstrap Icons (inline SVG — 100% offline) ───────────────
const Icons = {
  Home:      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/></svg>`,
  Truck:     `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>`,
  Package:   `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/></svg>`,
  MapPin:    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/><path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg>`,
  LogOut:    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/><path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/></svg>`,
  Menu:      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/></svg>`,
  QrCode:    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5M.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5M4 4h1v1H4z"/><path d="M7 2H2v5h5zM3 3h3v3H3zm2 8H4v1h1z"/><path d="M7 9H2v5h5zM3 10h3v3H3zm8-6h1v1h-1z"/><path d="M9 2h5v5H9zM10 3h3v3h-3zm8 6h1v1h-1z"/><path d="M9 9h5v5H9zm1 1h3v3h-3z"/></svg>`,
  BarChart:  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/></svg>`,
  ArrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/></svg>`,
  ArrowRight:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>`,
  Check:     `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0"/><path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0z"/></svg>`,
  // New icons
  People:    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/></svg>`,
  PersonPlus:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.44 10 6 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/><path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/></svg>`,
  Clipboard: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1H3a1 1 0 0 0-1 1V14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3.5a1 1 0 0 0-1-1h-1v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2"/></svg>`,
  Plus:      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg>`,
  Trash:     `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg>`,
  Pencil:    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/></svg>`,
  Signpost:  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M7 1.414V4H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h5v6h2v-6h3.532a1 1 0 0 0 .768-.36l1.933-2.32a.5.5 0 0 0 0-.64L13.3 4.36a1 1 0 0 0-.768-.36H9V1.414a1 1 0 0 0-2 0M8 5h5.532l1.666 2L13.532 9H8zm-6 0h5v4H2z"/></svg>`,
  Broadcast: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707m2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708m5.656-.708a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 1 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708m2.122-2.12a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.313.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0"/></svg>`,
  List:      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/></svg>`,
  Eye:       `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>`,
  Key:       `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5m0 3.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1"/></svg>`
};

// ── Core UI Components ────────────────────────────────────────
function Card(children, options = {}) {
  return createElement('div', {
    className: `card animate-fade-in ${options.className || ''}`,
    children,
    onClick: options.onClick,
    styles: options.styles || {}
  });
}

function Pill(text, color) {
  return createElement('span', {
    className: 'pill',
    textContent: text,
    styles: { backgroundColor: `${color}18`, color, border: `1px solid ${color}` }
  });
}

function Field(label, inputEl) {
  return createElement('div', {
    className: 'mb-4',
    children: [
      createElement('label', { className: 'label', textContent: label }),
      inputEl
    ]
  });
}

function TopBar(title, subtitle = null, onBackClick = null, onForwardClick = null) {
  const leftGroup = createElement('div', {
    className: 'flex-center',
    styles: { gap: '4px' },
    children: [
      createElement('button', {
        className: 'btn-text',
        innerHTML: Icons.ArrowLeft,
        attributes: { title: 'Go Back' },
        onClick: () => {
          if (onBackClick) onBackClick();
          else window.history.back();
        }
      }),
      createElement('button', {
        className: 'btn-text',
        innerHTML: Icons.ArrowRight,
        attributes: { title: 'Go Forward' },
        onClick: () => {
          if (onForwardClick) onForwardClick();
          else window.history.forward();
        }
      })
    ]
  });

  const titleGroup = createElement('div', {
    styles: { flex: 1, marginLeft: '8px' },
    children: [
      createElement('h3', { textContent: title, styles: { fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)' } }),
      subtitle ? createElement('div', { textContent: subtitle, styles: { fontSize: '11px', color: 'var(--text-muted)' } }) : null
    ]
  });

  const rightGroup = createElement('div', {
    className: 'flex-center',
    styles: { gap: '6px' },
    children: [
      Pill(store.currentUser?.role, 'var(--primary)'),
      createElement('button', {
        className: 'btn-text',
        innerHTML: Icons.LogOut,
        attributes: { title: 'Sign Out' },
        onClick: () => store.logout()
      })
    ]
  });

  return createElement('div', { className: 'topbar animate-fade-in', children: [leftGroup, titleGroup, rightGroup] });
}

function BottomNav(activeTab, onNavClick, tabs = null) {
  const defaultTabs = [
    { id: 'dashboard', label: 'Home',     icon: Icons.Home },
    { id: 'packages',  label: 'Packages', icon: Icons.Package },
    { id: 'tracking',  label: 'Track',    icon: Icons.MapPin }
  ];
  const useTabs = tabs || defaultTabs;
  return createElement('div', {
    className: 'bottom-nav',
    children: useTabs.map(tab =>
      createElement('button', {
        className: `nav-tab ${activeTab === tab.id ? 'active' : ''}`,
        children: [
          createElement('span', { innerHTML: tab.icon }),
          createElement('span', { textContent: tab.label, styles: { fontSize: '10px', marginTop: '2px' } })
        ],
        onClick: () => onNavClick(tab.id)
      })
    )
  });
}

// ── SVG Pie Chart (offline, no dependencies) ──────────────────
function generatePieChart(data, size = 150) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0);
  if (total === 0) {
    const empty = createElement('div', {
      className: 'flex-center',
      styles: { width: `${size}px`, height: `${size}px`, margin: '0 auto', color: 'var(--text-muted)', fontSize: '13px' },
      textContent: 'No data'
    });
    const wrap = createElement('div', { className: 'flex-center mt-4 mb-4' });
    wrap.appendChild(empty);
    return wrap;
  }
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', '-1 -1 2 2');
  svg.style.transform = 'rotate(-90deg)';
  svg.style.display = 'block';
  svg.style.margin = '0 auto';

  let angle = 0;
  data.forEach(slice => {
    if (!slice.value) return;
    const sa = (slice.value / total) * Math.PI * 2;
    const x1 = Math.cos(angle), y1 = Math.sin(angle);
    angle += sa;
    const x2 = Math.cos(angle), y2 = Math.sin(angle);
    const large = sa > Math.PI ? 1 : 0;
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', `M 0 0 L ${x1} ${y1} A 1 1 0 ${large} 1 ${x2} ${y2} Z`);
    path.setAttribute('fill', slice.color);
    svg.appendChild(path);
  });

  // Legend
  const legend = createElement('div', {
    styles: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginTop: '12px' }
  });
  data.forEach(slice => {
    if (!slice.value) return;
    legend.appendChild(createElement('div', {
      styles: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' },
      children: [
        createElement('div', { styles: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: slice.color, flexShrink: '0' } }),
        createElement('span', { textContent: `${slice.label} (${slice.value})`, styles: { color: 'var(--text-muted)' } })
      ]
    }));
  });

  const wrap = createElement('div', { className: 'mt-4 mb-2' });
  wrap.appendChild(svg);
  wrap.appendChild(legend);
  return wrap;
}

// ── Progress Bar ──────────────────────────────────────────────
function ProgressBar(value, max, color = 'var(--primary)') {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return createElement('div', {
    className: 'progress-bar',
    children: [
      createElement('div', {
        className: 'progress-fill',
        styles: { width: `${pct}%`, backgroundColor: color }
      })
    ]
  });
}

// ── Stat Box ──────────────────────────────────────────────────
function StatBox(label, value, color = 'var(--primary)') {
  return createElement('div', {
    styles: { background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: `1px solid ${color}33` },
    children: [
      createElement('div', { textContent: String(value), styles: { fontSize: '24px', fontWeight: 'bold', color } }),
      createElement('div', { textContent: label, styles: { fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' } })
    ]
  });
}

// ── Divider ───────────────────────────────────────────────────
function Divider() {
  return createElement('div', { styles: { borderTop: '1px solid var(--border)', margin: '12px 0' } });
}

// ── Web Audio Warning Sound (Offline) ─────────────────────────
function playWarningSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (err) {
    console.warn('[Audio Warning]', err);
  }
}

// ── Load Manifest PDF / Printable Document Generator ───────────
function generateLoadManifestPDF(veh, pkgs) {
  const printWin = window.open('', '_blank', 'width=800,height=900');
  if (!printWin) {
    alert('Pop-up blocked! Please allow pop-ups to generate PDF.');
    return;
  }

  const pkgRowsHtml = pkgs.map((p, idx) => {
    const itemsStr = p.items.map(it => `${it.name} (${it.weight}kg)`).join(', ');
    return `
      <tr>
        <td style="border: 1px solid #333; padding: 8px; text-align: center;">${idx + 1}</td>
        <td style="border: 1px solid #333; padding: 8px; font-weight: bold;">${p.id}</td>
        <td style="border: 1px solid #333; padding: 8px;">${p.name}<br/><span style="font-size:11px;color:#555;">Items: ${itemsStr}</span></td>
        <td style="border: 1px solid #333; padding: 8px; text-align: right; font-weight: bold;">${p.totalWeight} kg</td>
      </tr>
    `;
  }).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Load Manifest - ${veh.id}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 25px; color: #111; line-height: 1.4; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .title { font-size: 22px; font-weight: bold; letter-spacing: 1px; }
        .subtitle { font-size: 13px; color: #444; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; background: #f8f9fa; padding: 15px; border: 1px solid #ccc; border-radius: 6px; }
        .details-item { font-size: 13px; }
        .details-item strong { display: inline-block; width: 140px; color: #222; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #000; color: #fff; border: 1px solid #000; padding: 8px; font-size: 12px; }
        .signatures { margin-top: 60px; display: flex; justify-content: space-between; padding: 0 30px; }
        .sig-box { text-align: center; width: 220px; border-top: 1px dashed #000; padding-top: 8px; font-size: 13px; font-weight: bold; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px; text-align: right;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Print / Save as PDF</button>
      </div>

      <div class="header">
        <div class="title">VECTORLOGIX LOGISTICS MANIFEST</div>
        <div class="subtitle">Official Cargo & Vehicle Transport Load Manifest</div>
      </div>

      <div class="details-grid">
        <div class="details-item"><strong>Vehicle Registration:</strong> ${veh.reg}</div>
        <div class="details-item"><strong>Vehicle ID:</strong> ${veh.id}</div>
        <div class="details-item"><strong>Vehicle Type:</strong> ${veh.type}</div>
        <div class="details-item"><strong>Payload Capacity:</strong> ${veh.capacity} kg</div>
        <div class="details-item"><strong>Current Total Load:</strong> ${veh.load} kg</div>
        <div class="details-item"><strong>Destination:</strong> ${veh.destination || 'Unspecified'}</div>
        <div class="details-item"><strong>Driver Name:</strong> ${veh.driver}</div>
        <div class="details-item"><strong>Driver Mobile No:</strong> ${veh.driverPhone || 'N/A'}</div>
        <div class="details-item"><strong>Co-Driver Name:</strong> ${veh.coDriver}</div>
        <div class="details-item"><strong>Co-Driver Mobile No:</strong> ${veh.coDriverPhone || 'N/A'}</div>
      </div>

      <h3 style="margin-bottom: 5px; font-size: 15px;">CARGO PACKAGES BREAKDOWN</h3>
      <table>
        <thead>
          <tr>
            <th style="width: 50px;">Sr No</th>
            <th style="width: 100px;">Package ID</th>
            <th>Items & Description</th>
            <th style="width: 90px;">Weight</th>
          </tr>
        </thead>
        <tbody>
          ${pkgRowsHtml || '<tr><td colspan="4" style="padding: 15px; text-align: center;">No packages loaded</td></tr>'}
        </tbody>
      </table>

      <div class="signatures">
        <div class="sig-box">Signature of NSQM<br/><span style="font-size:11px;font-weight:normal;color:#555;">(Branch Manager)</span></div>
        <div class="sig-box">Signature of Dispatch Officer<br/><span style="font-size:11px;font-weight:normal;color:#555;">(Adjutant)</span></div>
      </div>
    </body>
    </html>
  `;

  printWin.document.write(htmlContent);
  printWin.document.close();
}
