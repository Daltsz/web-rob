import Blockly from 'blockly/blocks';

import duck from "../Puzzle/images/duck.jpg"
import bee from "../Puzzle/images/bee.jpg"
import cat from "../Puzzle/images/cat.jpg"
import snail from "../Puzzle/images/snail.jpg"


/**
 * Assemble the Puzzle's data.
 * Can't be run at the top level since the messages haven't loaded yet.
 */
export const getPuzzleData = () => {
  return [
    {
      name: "Animal1",
      pic: { duck },
      picHeight: 70,
      picWidth: 100,
      legs: 2,
      // traits: [
      //   Blockly.getMsg('Puzzle.animal1Trait1', false),
      //   Blockly.getMsg('Puzzle.animal1Trait2', false)
      // ],
      helpUrl: ""
    },
    {
      name: "Animal2",
      pic: { cat },
      picHeight: 70,
      picWidth: 100,
      legs: 4,
      // traits: [
      //   Blockly.getMsg('Puzzle.animal2Trait1', false),
      //   Blockly.getMsg('Puzzle.animal2Trait2', false)
      // ],
      helpUrl: ""
    },
    {
      name: "Animal3",
      pic: { bee },
      picHeight: 70,
      picWidth: 100,
      legs: 6,
      // traits: [
      //   Blockly.getMsg('Puzzle.animal3Trait1', false),
      //   Blockly.getMsg('Puzzle.animal3Trait2', false)
      // ],
      helpUrl: ""
    },
    {
      name: "Animal4",
      pic: { snail },
      picHeight: 70,
      picWidth: 100,
      legs: 0,
      // traits: [
      //   Blockly.getMsg('Puzzle.animal4Trait1', false),
      //   Blockly.getMsg('Puzzle.animal4Trait2', false)
      // ],
      helpUrl: ""
    },
  ];
}

export default getPuzzleData;