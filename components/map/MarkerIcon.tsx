import L from 'leaflet';

const colors = {
  run: '#FF2E63',
  bike: '#9B5DE5',
  swim: '#00BBF9',
};

const lucidePaths = {
  run: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-footprints-icon lucide-footprints"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>`,
  bike: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bike-icon lucide-bike"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>>`,
  swim: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-waves-icon lucide-waves"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`,
};

const createCircleIcon = (color: string, icon: keyof typeof lucidePaths) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="36" height="36">
      <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" strokeWidth="2"/>
      <g transform="translate(6,6)" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        ${lucidePaths[icon]}
      </g>
    </svg>
  `;

  const svgUrl = `data:image/svg+xml;base64,${btoa(svg)}`;

  return L.icon({
    iconUrl: svgUrl,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

export const icons = {
  run: createCircleIcon(colors.run, 'run'),
  bike: createCircleIcon(colors.bike, 'bike'),
  swim: createCircleIcon(colors.swim, 'swim'),
} as const;

export const startIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#22c55e;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export const endIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export const swimIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="36" height="36"><circle cx="18" cy="18" r="16" fill="#00BBF9" stroke="white" stroke-width="2"/><g transform="translate(8,10)" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M0 4c.4.3.8.7 1.7.7 1.7 0 1.7-1.3 3.3-1.3 1.7 0 1.6 1.3 3.3 1.3 1.7 0 1.7-1.3 3.3-1.3 .9 0 1.3.3 1.7.7"/><path d="M0 8c.4.3.8.7 1.7.7 1.7 0 1.7-1.3 3.3-1.3 1.7 0 1.6 1.3 3.3 1.3 1.7 0 1.7-1.3 3.3-1.3 .9 0 1.3.3 1.7.7"/><path d="M0 12c.4.3.8.7 1.7.7 1.7 0 1.7-1.3 3.3-1.3 1.7 0 1.6 1.3 3.3 1.3 1.7 0 1.7-1.3 3.3-1.3 .9 0 1.3.3 1.7.7"/></g></svg>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});
