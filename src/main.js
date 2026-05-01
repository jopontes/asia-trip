import { createGlobe } from './globe.js';
import { createBorders } from './borders.js';
import { createLabels } from './labels.js';
import { createCameraRig } from './camera-rig.js';
import { createRouteLine, updateLineResolutions } from './routes.js';
import { createTimelineUI } from './timeline-ui.js';
import { createDateOverlay } from './date-overlay.js';
import { setupScroll } from './scroll.js';
import { renderSections } from './sections.js';
import { setupLightbox } from './lightbox.js';
import { stops, segments, cameraKeyframes } from './data/itinerary.js';

renderSections(stops, segments);
setupLightbox();

const canvas = document.getElementById('globe-canvas');
const globe = createGlobe(canvas);

createBorders(globe.overlay);
createLabels(globe.overlay, stops);

const stopsById = Object.fromEntries(stops.map((s) => [s.id, s]));
stops.forEach((s) => globe.addMarker(s.coord));
globe.finalizeMarkers();

const routes = await Promise.all(
  segments.map((seg) => createRouteLine(seg, stopsById, globe.overlay)),
);

// Resize — mantém rótulos e linhas Line2 com resolução correta.
globe.onResize((w, h) => updateLineResolutions(w, h));

const rig = createCameraRig(globe.camera, cameraKeyframes, stops.map((s) => s.id));
rig.update(0);

const timeline = createTimelineUI(stops);
const dateOverlay = createDateOverlay(stops);

setupScroll({ rig, routes, timeline, dateOverlay, stops, segments });
