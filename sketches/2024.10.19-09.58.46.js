const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const colorPalettes = require('nice-color-palettes');
const dat = require('dat.gui');

const settings = {
  dimensions: [2048, 2048],
  animate: true,
  duration: 15,
  fps: 60
};

function scale(val, start1, stop1, start2, stop2) {
  return start2 + (val - start1) * (stop2 - start2) / (stop1 - start1);
}

function radians(angle) {
  return angle * Math.PI / 180.0;
}

const params = {
  numTilesX: 4,
  waveSpeed: 0.2,
  waveType: 'sine',
  bg: '#FFC0CB',
  fg: '#0000ff'
}

const gui = new dat.GUI();
gui.add(params, 'numTilesX', 2, 24, 1).name('Grid size');
gui.add(params, 'waveSpeed', 0.1, 1, 0.1).name('Wave speed');
gui.add(params, 'waveType', ['sine', 'noise']).name('Wave type');
gui.addColor(params, 'bg').name('Background');
gui.addColor(params, 'fg').name('Foreground');

const sketch = () => {
  const palette = random.pick(colorPalettes);
  return ({ context, width, height, time }) => {
    const numTilesX = params.numTilesX;
    const numTilesY = numTilesX;

    context.fillStyle = params.bg;
    context.fillRect(0, 0, width, height);
    
    const tileWidth = width / numTilesX;
    const tileHeight = height / numTilesY;

    for (let x = 0; x < numTilesX; x++) {
      for (let y = 0; y < numTilesY; y++) {
        let tilePosX = tileWidth * x;
        let tilePosY = tileHeight * y;

        let wave;
        if (params.waveType === 'sine') {
          wave = Math.sin(radians(time * 360 * params.waveSpeed + x * 10 + y * 10));
        } else {
          wave = random.noise3D(x * 0.1, y * 0.1, time * params.waveSpeed);
        }
        
        let mappedWave = scale(wave, -1, 1, 0, 5);
        let selectTile = Math.floor(mappedWave);

        context.fillStyle = params.fg;
        context.save();
        context.translate(tilePosX, tilePosY);

        const arcRadius = tileWidth;

        if (selectTile === 0) {
          context.beginPath();
          context.moveTo(0, 0);
          context.arc(0, 0, arcRadius, radians(0), radians(90));
          context.fill();
        } else if (selectTile === 1) {
          context.beginPath();
          context.moveTo(tileWidth, 0);
          context.arc(tileWidth, 0, arcRadius, radians(90), radians(180));
          context.fill();
        } else if (selectTile === 2) {
          context.beginPath();
          context.moveTo(tileWidth, tileHeight);
          context.arc(tileWidth, tileHeight, arcRadius, radians(180), radians(270));
          context.fill();
        } else if (selectTile === 3) {
          context.beginPath();
          context.moveTo(0, tileWidth);
          context.arc(0, tileWidth, arcRadius, radians(270), radians(360));
          context.fill();
        } else {
          context.fillRect(0, 0, tileWidth, tileHeight);
        }
        context.restore();
      }
    }
  };
};

canvasSketch(sketch, settings);
