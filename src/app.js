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
const colors = ['red', 'green', 'blue'];
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
  console.log(code);
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
