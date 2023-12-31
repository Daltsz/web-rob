import BlocklyGames from "./libs/lib-games";
import duck from '../Puzzle/images/duck.jpg'
import bee from '../Puzzle/images/bee.jpg'
import cat from '../Puzzle/images/cat.jpg'
import snail from '../Puzzle/images/snail.jpg'
import messages from './message.json';


const getData = () => {
  return [
    {
      name: 'Teste',
      pic: duck,
      picHeight: 70,
      picWidth: 100,
      legs: 2,
      traits: [
        'Pernas',
        'Pernas'
      ],
      helpUrl: ''
    },
    {
      name: 'Teste',
      pic: cat,
      picHeight: 70,
      picWidth: 100,
      legs: 4,
      traits: [
        'Pernas',
        'Pernas'
      ],
      helpUrl: ''
    },
    {
      name: 'Teste',
      pic: bee,
      picHeight: 70,
      picWidth: 100,
      legs: 6,
      traits: [
        'Pernas',
        'Pernas'
      ],
      helpUrl: ''
    },
    {
      name: 'Teste',
      pic: snail,
      picHeight: 70,
      picWidth: 100,
      legs: 0,
      traits: [
        'Pernas',
        'Pernas'
      ],
      helpUrl: ''
    },
  ];
};

export default getData;
