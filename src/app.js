import './app.css';
import {
  Storage,
  DisplayObject,
  makeBitArray,
  makeHexMap,
  makeArray,
  createContainer,
  createNode,
  createButton
} from '@jamesrock/rockjs';

const app = document.querySelector('#app');

class ColorMixer extends DisplayObject {
  constructor() {

    super();

    const node = this.node = createContainer('color-mixer');
    const output = this.output = createContainer('output');
    const collections = createContainer('colors');
    const foot = createContainer('color-mixer-foot');
    const faveBtn = createButton('fave');
    const clearBtn = createButton('clear');

    const colors = ['#E00000', '#009000', '#0000FF'];
    const switches = this.switches = makeArray(colors.length, () => []);
    const storage = this.storage = new Storage('me.jamesrock.color-mixer');

    colors.forEach((color, ci) => {
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

    foot.appendChild(faveBtn);
    foot.appendChild(output);
    foot.appendChild(clearBtn);

    node.appendChild(collections);
    node.appendChild(foot);

    this.calculate();

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

    this.faves.push([this.code, prompt('name?')]);
    this.storage.set('faves', this.faves);
    return this;

  };
  hexMap = makeHexMap();
  bits = makeBitArray(8);
  faves = [
    ['#C00000', 'red'],
    ['#A00000', 'red'],
    ['#007000', 'green'],
    ['#0000C0', 'blue'],
    ['#8000C0', 'purple'],
    ['#800080', 'purple'],
    ['#F06040', 'orange'],
    ['#FF7F00', 'orange'],
    ['#E00080', 'pink'],
    ['#E000C0', 'pink'],
    ['#00E0E0', 'cyan'],
    ['#E0FF00', 'yellow'],
    ['#FFFF00', 'yellow'],
    ['#F8E3E5', 'lavender blush'],
  ];
};

const mixer = new ColorMixer();
mixer.appendTo(app);
