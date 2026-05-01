// Roteiro: intro sobre a Ásia, primeiro scroll dispara a sequência de voo
// São Paulo → Dallas → Pequim. Volta do Istambul NÃO está representada.

export const stops = [
  { id: 'intro',        name: '',              country: '',         coord: null,                 date: '2016-05-04', photos: [] },

  { id: 'gru',          name: 'São Paulo',     country: 'Brasil',   coord: [-46.6333, -23.5505], date: '2016-05-03', photos: [] },
  { id: 'dfw',          name: 'Dallas',        country: 'EUA',      coord: [-96.7970,  32.8998], date: '2016-05-03', photos: [] },

  { id: 'beijing',      name: 'Pequim',        country: 'China',    coord: [116.4074, 39.9042],  date: '2016-05-04',
    photos: ['/photos/beijing/01.jpg', '/photos/beijing/02.jpg'] },
  { id: 'datong',       name: 'Datong',        country: 'China',    coord: [113.3001, 40.0768],  date: '2016-05-11',
    photos: ['/photos/datong/01.jpg', '/photos/datong/02.jpg'] },
  { id: 'ulaanbaatar',  name: 'Ulaanbaatar',   country: 'Mongólia', coord: [106.9057, 47.8864],  date: '2016-05-13',
    photos: ['/photos/ulaanbaatar/01.jpg', '/photos/ulaanbaatar/02.jpg'] },
  { id: 'irkutsk',      name: 'Irkutsk',       country: 'Rússia',   coord: [104.2890, 52.2978],  date: '2016-05-19',
    photos: ['/photos/irkutsk/01.jpg'] },
  { id: 'ekaterinburg', name: 'Ekaterimburgo', country: 'Rússia',   coord: [ 60.6122, 56.8389],  date: '2016-05-23',
    photos: ['/photos/ekaterinburg/01.jpg'] },
  { id: 'kazan',        name: 'Kazan',         country: 'Rússia',   coord: [ 49.1088, 55.7963],  date: '2016-05-27', photos: [] },
  { id: 'moscow',       name: 'Moscou',        country: 'Rússia',   coord: [ 37.6173, 55.7558],  date: '2016-05-29', photos: [] },

  { id: 'tbilisi',      name: 'Tbilisi',       country: 'Geórgia',  coord: [ 44.7930, 41.7151],  date: '2016-05-31',
    photos: ['/photos/tbilisi/01.jpg'] },
  { id: 'yerevan',      name: 'Yerevan',       country: 'Armênia',  coord: [ 44.5152, 40.1792],  date: '2016-06-01',
    photos: ['/photos/yerevan/01.jpg', '/photos/yerevan/02.jpg'] },
  { id: 'tbilisi_r1',   name: 'Tbilisi',       country: 'Geórgia',  coord: [ 44.7930, 41.7151],  date: '2016-06-03', photos: [] },
  { id: 'kazbegi',      name: 'Kazbegi',       country: 'Geórgia',  coord: [ 44.6417, 42.6569],  date: '2016-06-04',
    photos: ['/photos/kazbegi/01.jpg', '/photos/kazbegi/02.jpg'] },
  { id: 'tbilisi_r2',   name: 'Tbilisi',       country: 'Geórgia',  coord: [ 44.7930, 41.7151],  date: '2016-06-04', photos: [] },

  { id: 'istanbul',     name: 'Istambul',      country: 'Turquia',  coord: [ 28.9784, 41.0082],  date: '2016-06-05', photos: [] },
  { id: 'ayvalik',      name: 'Ayvalık',       country: 'Turquia',  coord: [ 26.6906, 39.3112],  date: '2016-06-08', photos: [] },
  { id: 'lesvos',       name: 'Lesvos',        country: 'Grécia',   coord: [ 26.5540, 39.1016],  date: '2016-06-11', photos: [] },
  { id: 'ayvalik_r',    name: 'Ayvalık',       country: 'Turquia',  coord: [ 26.6906, 39.3112],  date: '2016-06-12', photos: [] },
  { id: 'istanbul_r',   name: 'Istambul',      country: 'Turquia',  coord: [ 28.9784, 41.0082],  date: '2016-06-12', photos: [] },

  { id: 'outro',        name: '',              country: '',         coord: null,                 date: '2016-06-13', photos: [] },
];

export const segments = [
  // Voo de abertura São Paulo → Dallas → Pequim (arcos).
  { id: 'gru-dfw',              from: 'gru',        to: 'dfw',         mode: 'flight' },
  { id: 'dfw-beijing',          from: 'dfw',        to: 'beijing',     mode: 'flight' },

  // Transiberiano / Trans-Mongoliano.
  { id: 'beijing-datong',       from: 'beijing',    to: 'datong',      mode: 'rail',
    waypoints: [[116.4074, 39.9042], [115.66, 40.37], [115.03, 40.40], [114.88, 40.82], [114.18, 40.77], [113.30, 40.0768]] },
  { id: 'datong-ulaanbaatar',   from: 'datong',     to: 'ulaanbaatar', mode: 'rail',
    waypoints: [[113.3001, 40.0768], [112.43, 41.03], [111.69, 40.82], [111.97, 43.65], [111.90, 43.70], [109.70, 45.47], [108.30, 46.42], [106.9057, 47.8864]] },
  { id: 'ulaanbaatar-irkutsk',  from: 'ulaanbaatar', to: 'irkutsk',    mode: 'rail',
    waypoints: [[106.9057, 47.8864], [106.19, 48.72], [106.10, 49.63], [106.45, 50.40], [106.83, 51.83], [105.00, 51.85], [104.29, 52.2978]] },
  { id: 'irkutsk-ekaterinburg', from: 'irkutsk',    to: 'ekaterinburg', mode: 'rail',
    waypoints: [[104.2890, 52.2978], [97.14, 54.60], [92.87, 56.01], [86.08, 55.35], [82.93, 55.02], [73.37, 54.99], [68.26, 54.97], [65.34, 55.15], [60.6122, 56.8389]] },

  { id: 'ekaterinburg-kazan',   from: 'ekaterinburg', to: 'kazan',      mode: 'rail',
    waypoints: [[60.6122, 56.8389], [59.20, 56.95], [56.25, 58.00], [55.00, 57.70], [53.21, 56.85], [52.98, 56.51], [51.60, 56.35], [49.1088, 55.7963]] },
  { id: 'kazan-moscow',         from: 'kazan',      to: 'moscow',      mode: 'rail',
    waypoints: [[49.1088, 55.7963], [47.50, 55.80], [45.00, 56.25], [43.90, 56.30], [40.40, 56.13], [37.6173, 55.7558]] },

  { id: 'moscow-tbilisi',       from: 'moscow',     to: 'tbilisi',     mode: 'flight' },

  // Cáucaso — chronológico.
  { id: 'tbilisi-yerevan',      from: 'tbilisi',    to: 'yerevan',     mode: 'road',
    waypoints: [[44.7930, 41.7151], [44.90, 41.40], [45.00, 41.00], [44.80, 40.60], [44.5152, 40.1792]] },
  { id: 'yerevan-tbilisi',      from: 'yerevan',    to: 'tbilisi_r1',  mode: 'road',
    waypoints: [[44.5152, 40.1792], [44.80, 40.60], [45.00, 41.00], [44.90, 41.40], [44.7930, 41.7151]] },
  { id: 'tbilisi-kazbegi',      from: 'tbilisi_r1', to: 'kazbegi',     mode: 'road',
    waypoints: [[44.7930, 41.7151], [44.71, 42.00], [44.70, 42.30], [44.62, 42.52], [44.6417, 42.6569]] },
  { id: 'kazbegi-tbilisi',      from: 'kazbegi',    to: 'tbilisi_r2',  mode: 'road',
    waypoints: [[44.6417, 42.6569], [44.62, 42.52], [44.70, 42.30], [44.71, 42.00], [44.7930, 41.7151]] },

  { id: 'tbilisi-istanbul',     from: 'tbilisi_r2', to: 'istanbul',    mode: 'flight' },
  { id: 'istanbul-ayvalik',     from: 'istanbul',   to: 'ayvalik',     mode: 'bus',
    waypoints: [
      [28.9784, 41.0082], [29.25, 40.92], [29.28, 40.65], [29.06, 40.18],
      [28.36, 40.21], [27.88, 39.65], [27.30, 39.45], [26.6906, 39.3112],
    ] },
  { id: 'ayvalik-lesvos',       from: 'ayvalik',    to: 'lesvos',      mode: 'boat',
    waypoints: [[26.6906, 39.3112], [26.62, 39.25], [26.58, 39.18], [26.5540, 39.1016]] },
  { id: 'lesvos-ayvalik',       from: 'lesvos',     to: 'ayvalik_r',   mode: 'boat',
    waypoints: [[26.5540, 39.1016], [26.58, 39.18], [26.62, 39.25], [26.6906, 39.3112]] },
  { id: 'ayvalik-istanbul',     from: 'ayvalik_r',  to: 'istanbul_r',  mode: 'bus',
    waypoints: [
      [26.6906, 39.3112], [27.30, 39.45], [27.88, 39.65], [28.36, 40.21],
      [29.06, 40.18], [29.28, 40.65], [29.25, 40.92], [28.9784, 41.0082],
    ] },
];

function kf(lon, lat, distance) { return { lon, lat, distance }; }

export const cameraKeyframes = {
  // Intro: Pequim → Lesvos enquadrados (foco da viagem antes da partida).
  intro:        kf( 75,   42,   2.55),
  // Primeiro scroll: gira para São Paulo.
  gru:          kf(-46.6, -23.5, 1.70),
  // Escala em Dallas.
  dfw:          kf(-96.8, 33.0,  1.70),
  // Chegada em Pequim — aqui fica o salto final de arco.
  beijing:      kf(116.4, 39.9,  1.42),

  datong:       kf(113.3, 40.1, 1.38),
  ulaanbaatar:  kf(106.9, 47.9, 1.42),
  irkutsk:      kf(104.3, 52.3, 1.42),
  ekaterinburg: kf( 60.6, 56.8, 1.48),
  kazan:        kf( 49.1, 55.8, 1.42),
  moscow:       kf( 37.6, 55.8, 1.42),
  tbilisi:      kf( 44.8, 41.7, 1.35),
  yerevan:      kf( 44.5, 40.2, 1.32),
  tbilisi_r1:   kf( 44.8, 41.7, 1.32),
  kazbegi:      kf( 44.6, 42.6, 1.22),
  tbilisi_r2:   kf( 44.8, 41.7, 1.32),
  istanbul:     kf( 28.9, 41.0, 1.35),
  ayvalik:      kf( 26.7, 39.3, 1.20),
  lesvos:       kf( 26.6, 39.1, 1.14),
  ayvalik_r:    kf( 26.7, 39.3, 1.20),
  istanbul_r:   kf( 28.9, 41.0, 1.35),
  // Outro: retorna para overview Ásia → Europa.
  outro:        kf( 75,   42,   2.55),
};
