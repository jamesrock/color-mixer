import './app.css';
import {
  makeBitArray,
  makeHexMap,
  makeArray,
  createNode
} from '@jamesrock/rockjs';

const app = document.querySelector('#app');
const bits = makeBitArray(8);
const hexMap = makeHexMap();
const colors = ['#E00000', '#009000', '#0000FF'];
const switches = makeArray(colors.length, () => []);
const collections = createNode('div', 'colors');
const output = createNode('div', 'output');

const calculate = () => {
  let code = '#';
  switches.forEach((collection) => {
    let total = 0;
    collection.forEach(($switch) => {
      if($switch.dataset.active==='Y') {
        total += Number($switch.dataset.value);
      };
    });
    code += hexMap[total];
  });
  document.body.style.backgroundColor = code;
  output.innerText = code;
};

colors.forEach((color, ci) => {
  const collection = createNode('div', 'color');
  collection.style.setProperty('--color', color);
  bits.forEach((bit) => {
    const node = createNode('div', 'switch');
    node.dataset.value = bit;
    node.dataset.active = 'N';
    node.innerText = bit;
    node.addEventListener('click', () => {
      node.dataset.active = node.dataset.active === 'Y' ? 'N' : 'Y';
      calculate();
    });
    switches[ci].push(node);
    collection.appendChild(node);
  });
  collections.appendChild(collection);
});

calculate();

app.appendChild(collections);
app.appendChild(output);


// #C00000 // red
// #A00000 // red

// #007000 // green

// #0000C0 // blue

// #8000C0 // purple
// #800080 // purple

// #F06040 // orange
// #FF7F00 // orange

// #E00080 // pink

// #00E0E0 // cyan

// #E0FF00 // yellow
// #FFFF00 // yellow