import L from 'leaflet';

const colors = {
  default: '#3B82F6', // blue
  run: '#EF4444', // red
  bike: '#10B981', // green
  swim: '#6366F1', // indigo
};

const createSvgIcon = (color: string, selected: boolean = false) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
      <path fill="${color}" stroke="#FFF" stroke-width="2" d="M16 2 C12 2 4 8 4 19 C4 29 16 40 16 40 C16 40 28 29 28 19 C28 8 20 2 16 2 Z"/>
      ${selected ? `<circle cx="16" cy="19" r="6" fill="white"/>` : ''}
    </svg>
  `;

  const svgUrl = `data:image/svg+xml;base64,${btoa(svg)}`;

  return L.icon({
    iconUrl: svgUrl,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

export const icons = {
  default: createSvgIcon(colors.default),
  defaultSelected: createSvgIcon(colors.default, true),
  run: createSvgIcon(colors.run),
  runSelected: createSvgIcon(colors.run, true),
  bike: createSvgIcon(colors.bike),
  bikeSelected: createSvgIcon(colors.bike, true),
  swim: createSvgIcon(colors.swim),
  swimSelected: createSvgIcon(colors.swim, true),
} as const;
