import '/css/app.css';
import {
  Storage,
  DisplayObject,
  setDocumentHeight,
  makeBitArray,
  makeHexMap,
  makeBitMap,
  makeArray,
  createContainer,
  createNode,
  createButton,
  empty
} from '@jamesrock/rockjs';

setDocumentHeight();

const app = document.querySelector('#app');
const defaultFaves = [
  '#C00000',
  '#A00000',
  '#007000',
  '#0000C0',
  '#8000C0',
  '#800080',
  '#F06040',
  '#FF7F00',
  '#F08800',
  '#E00080',
  '#E000C0',
  '#00E0E0',
  '#E0FF00',
  '#FFFF00',
  '#F8E3E5',
  '#008CC0',
  '#0000FF',
  '#808000',
  '#00E0F0',
  '#00FF00',
  '#F800C0',
  '#F000E0',
  '#213F95',
  '#C8A2C9',
  '#FEFBCE',
  '#0D3B66',
  '#FAF0CA',
  '#A1E1BC',
  '#A1211C',
];

const hexToArray = (hex) => {
  const [hash, R1, R2, G1, G2, B1, B2] = hex.split('');
  return [`${R1}${R2}`, `${G1}${G2}`, `${B1}${B2}`];
};

class ColorMixer extends DisplayObject {
  constructor() {

    super();

    const node = this.node = createContainer('color-mixer');
    const output = this.output = createContainer('output');
    const swatches = this.swatches = createContainer('swatches');
    const collections = createContainer('colors');
    const foot = createContainer('foot');
    const faveBtn = this.faveBtn = createContainer('fave');
    const clearBtn = createButton('clear', 'clear');
    const copyBtn = createButton('copy', 'copy');

    copyBtn.innerHTML = `<span class="copied">copied!</span><span class="default">copy</span>`;
    copyBtn.dataset.state = 'default';

    faveBtn.innerHTML = '+';
    faveBtn.title = 'create new swatch';

    const switches = this.switches = makeArray(this.colors.length, () => []);

    this.colors.forEach((color, ci) => {
      const collection = createNode('div', 'color');
      collection.style.setProperty('--color', color);
      this.bits.forEach((bit) => {
        const node = createNode('div', 'switch');
        node.dataset.value = bit;
        node.dataset.active = 'N';
        node.innerText = bit;
        node.addEventListener('click', () => {
          node.dataset.active = node.dataset.active === 'Y' ? 'N' : 'Y';
          this.calculate();
        });
        switches[ci].push(node);
        collection.appendChild(node);
      });
      collections.appendChild(collection);
    });

    foot.appendChild(clearBtn);
    foot.appendChild(output);
    foot.appendChild(copyBtn);

    node.appendChild(collections);
    node.appendChild(foot);
    node.appendChild(swatches);

    faveBtn.addEventListener('click', () => {
      
      this.addToFaves();

    });

    clearBtn.addEventListener('click', () => {
      
      this.clear();

    });

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(this.code);
      copyBtn.dataset.state = 'copied';
      setTimeout(() => {
        copyBtn.dataset.state = 'default';
      }, 1500);
    });

    this.calculate();
    this.getFaves();
    this.renderSwatches();

  };
  calculate() {

    let code = '#';
    
    this.switches.forEach((collection) => {
      let total = 0;
      collection.forEach(($switch) => {
        if($switch.dataset.active==='Y') {
          total += Number($switch.dataset.value);
        };
      });
      code += this.hexMap[total];
    });

    document.body.style.backgroundColor = code;
    this.output.innerText = code;
    this.code = code;
    
  };
  addToFaves() {

    this.faves.push(this.code);
    this.storage.set('faves', this.faves);
    this.renderSwatches();
    return this;

  };
  getFaves() {

    const faves = this.storage.get('faves') || defaultFaves;
    this.faves = faves;
    return this.faves;

  };
  renderSwatches() {

    empty(this.swatches);

    this.faves.forEach((swatch) => {
      const node = createContainer('swatch');
      node.style.backgroundColor = swatch;
      node.addEventListener('click', () => {
        this.setColor(swatch);
      });
      this.swatches.appendChild(node);
    });

    this.swatches.appendChild(this.faveBtn);

    return this;

  };
  setColor(hex) {

    hexToArray(hex).forEach((value, i) => {
      this.bitMap[this.hexMap.indexOf(value)].forEach((onOff, x) => {
        this.switches[i][x].dataset.active = onOff ? 'Y' : 'N';
      });
    });

    this.calculate();

    return this;

  };
  clear() {
    
    this.switches.forEach((collection) => {
      collection.forEach(($switch) => {
        $switch.dataset.active = 'N';
      });
    });

    this.calculate();

    return this;

  };
  hexMap = makeHexMap();
  bitMap = makeBitMap(8);
  bits = makeBitArray(8);
  storage = new Storage('me.jamesrock.hex-maker');
  colors = ['#E00000', '#009000', '#0000FF'];
  faves = [];
};

const mixer = window.mixer = new ColorMixer();
mixer.appendTo(app);

// const switchSize = 37;
// const switchGap = 4;
// const switchesPerRow = 8;

// const swatchSize = 25;
// const swatchGap = 2;
// const swatchesPerRow = 12;

// document.documentElement.style.setProperty('--swatch-size', `${swatchSize}px`);
// document.documentElement.style.setProperty('--swatch-gap', `${swatchGap}px`);
// document.documentElement.style.setProperty('--switch-size', `${switchSize}px`);
// document.documentElement.style.setProperty('--switch-gap', `${switchGap}px`);

// console.log('switch max width', (switchSize * switchesPerRow) + (switchGap * (switchesPerRow-1)));
// console.log('swatch max width', (swatchSize * swatchesPerRow) + (swatchGap * (swatchesPerRow-1)));
