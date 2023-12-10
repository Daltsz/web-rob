// import Blockly from 'blockly';
// import getPuzzleData from './data.js'

// export default function Component() {
//   function init() {
//     // Render the HTML.

//     Blockly.init(Blockly.getMsg('Games.puzzle', false));

//     const rtl = Blockly.IS_RTL;
//     const blocklyDiv = Blockly.getElementById('blockly');
//     const onresize = function (_e) {
//       blocklyDiv.style.width = (window.innerWidth - 20) + 'px';
//       blocklyDiv.style.height =
//         (window.innerHeight - blocklyDiv.offsetTop - 15) + 'px';
//     };

//     onresize(null);
//     window.addEventListener('resize', onresize);

//     const savedBlocks =
//       Blockly.loadFromLocalStorage(Blockly.storageName, Blockly.LEVEL);
//     // Add the blocks.
//     let loadOnce;
//     try {
//       loadOnce = window.sessionStorage.loadOnceBlocks;
//     } catch (e) {
//       // Firefox sometimes throws a SecurityError when accessing sessionStorage.
//       // Restarting Firefox fixes this, so it looks like a bug.
//       loadOnce = null;
//     }
//     if (loadOnce) {
//       delete window.sessionStorage.loadOnceBlocks;
//       const xml = Blockly.Xml.textToDom(loadOnce);
//       Blockly.Xml.domToWorkspace(xml, Blockly.Workspace);
//     } else if (savedBlocks) {
//       const xml = Blockly.Xml.textToDom(savedBlocks);
//       Blockly.Xml.domToWorkspace(xml, Blockly.Workspace);
//     } else {
//       // Create one of every block.
//       const blocksAnimals = [];
//       const blocksPictures = [];
//       const blocksTraits = [];
//       const data = getPuzzleData();
//       for (let i = 0; i < data.length; i++) {
//         const animalBlock = Blockly.Workspace.newBlock('animal');
//         animalBlock.populate(i + 1);
//         blocksAnimals.push(animalBlock);
//         const pictureBlock = Blockly.Workspace.newBlock('picture');
//         pictureBlock.populate(i + 1);
//         blocksPictures.push(pictureBlock);
//         for (let j = 0; j < data[i].traits.length; j++) {
//           const traitBlock = Blockly.Workspace.newBlock('trait');
//           traitBlock.populate(i + 1, j + 1);
//           blocksTraits.push(traitBlock);
//         }
//       }
//       shuffle(blocksAnimals);
//       shuffle(blocksPictures);
//       shuffle(blocksTraits);
//       const blocks = [].concat(blocksAnimals, blocksPictures, blocksTraits);
//       if (rtl) {
//         blocks.reverse();
//       }
//       // Initialize all the blocks.
//       for (const block of blocks) {
//         block.setDeletable(false);
//         block.initSvg();
//         block.render();
//       }
//       let totalArea = 0;
//       // Measure the surface area of each block.
//       for (const block of blocks) {
//         const blockBox = block.getSvgRoot().getBBox();
//         block.cached_width_ = blockBox.width;
//         block.cached_height_ = blockBox.height;
//         block.cached_area_ = blockBox.width * blockBox.height;
//         totalArea += block.cached_area_;
//       }
//       // Position the blocks randomly.
//       const MARGIN = 50;
//       Blockly.svgResize(Blockly.Workspace);
//       const workspaceBox = Blockly.Workspace.getCachedParentSvgSize();
//       workspaceBox.width -= MARGIN;
//       workspaceBox.height -= MARGIN;
//       let countedArea = 0;
//       for (const block of blocks) {
//         const blockBox = block.getSvgRoot().getBBox();
//         // Spread the blocks horizontally, grouped by type.
//         // Spacing is proportional to block's area.
//         let dx;
//         if (rtl) {
//           dx = blockBox.width +
//             (countedArea / totalArea) * workspaceBox.width;
//         } else {
//           dx = (countedArea / totalArea) *
//             (workspaceBox.width - blockBox.width);
//         }
//         dx = Math.round(dx + Math.random() * MARGIN);
//         const dy = Math.round(Math.random() *
//           (workspaceBox.height - blockBox.height));
//         block.moveBy(dx, dy);
//         countedArea += block.cached_area_;
//       }
//     }
//     Blockly.Workspace.clearUndo();

//     Blockly.bindClick('checkButton', checkAnswers);
//     Blockly.bindClick('helpButton', function () { showHelp(true); });

//     if (!savedBlocks) {
//       showHelp(false);
//     }

//     //   // Make connecting blocks easier for beginners.
//     //   Blockly.SNAP_RADIUS *= 2;
//     //   Blockly.CONNECTING_SNAP_RADIUS = Blockly.SNAP_RADIUS;
//     //   // Preload the win sound.

//   }

//   function shuffle(arr) {
//     for (let i = arr.length - 1; i > 0; i--) {
//       // Choose a random array index in [0, i] (inclusive with i).
//       const j = Math.floor(Math.random() * (i + 1));
//       const tmp = arr[i];
//       arr[i] = arr[j];
//       arr[j] = tmp;
//     }
//   }

//   /**
//    * Count and highlight the errors.
//    */
//   function checkAnswers() {
//     const blocks = Blockly.Workspace.getAllBlocks(false);
//     let errors = 0;
//     const badBlocks = [];
//     for (const block of blocks) {
//       if (!block.isCorrect()) {
//         errors++;
//         // Bring the offending blocks to the front.
//         block.select();
//         badBlocks.push(block);
//       }
//     }

//     const graphValue = Blockly.getElementById('graphValue');
//     setTimeout(function () {
//       graphValue.style.width =
//         (100 * (blocks.length - errors) / blocks.length) + 'px';
//     }, 500);

//     let messages;
//     // Safe from HTML injection due to createTextNode below.
//     if (errors === 1) {
//       messages = [Blockly.getMsg('Puzzle.error1', false),
//       Blockly.getMsg('Puzzle.tryAgain', false)];
//     } else if (errors) {
//       messages = [Blockly.getMsg('Puzzle.error2', false).replace('%1', errors),
//       Blockly.getMsg('Puzzle.tryAgain', false)];
//     } else {
//       messages = [Blockly.getMsg('Puzzle.error0', false).replace(
//         '%1', blocks.length)];
//       Blockly.executedCode = Blockly.getCode();
//       Blockly.saveToLocalStorage();
//     }
//     const textDiv = Blockly.getElementById('answerMessage');
//     textDiv.textContent = '';
//     for (const message of messages) {
//       const line = document.createElement('div');
//       line.appendChild(document.createTextNode(message));
//       textDiv.appendChild(line);
//     }

//     const content = Blockly.getElementById('answers');
//     const button = Blockly.getElementById('checkButton');
//     const style = {
//       width: '25%',
//       left: Blockly.IS_RTL ? '5%' : '70%',
//       top: '5em',
//     };
//     const action = errors ? Blockly.stopDialogKeyDown :
//       Blockly.indexPage;
//     Blockly.showDialog(content, button, true, true, style, action);
//     Blockly.startDialogKeyDown();

//     if (badBlocks.length) {
//       // Pick a random bad block and blink it until the dialog closes.
//       shuffle(badBlocks);
//       const badBlock = badBlocks[0];
//       const blink = function () {
//         badBlock.select();
//         if (Blockly.isDialogVisible_) {
//           setTimeout(function () { badBlock.unselect(); }, 150);
//           setTimeout(blink, 300);
//         }
//       };
//       blink();
//     } else {
//       // setTimeout(endDance, 2000);
//       if (Blockly.selected) {
//         Blockly.selected.unselect();
//       }
//     }
//   }



//   // function animate(block, angleOffset) {
//   //   if (!BlocklyDialogs.isDialogVisible_) {
//   //     // Firefox can navigate 'back' to this page with the animation running
//   //     // but the dialog gone.
//   //     return;
//   //   }
//   //   // Collect all the metrics.
//   //   const workspaceMetrics = BlocklyInterface.workspace.getMetrics();
//   //   const halfHeight = workspaceMetrics.viewHeight / 2;
//   //   const halfWidth = workspaceMetrics.viewWidth / 2;
//   //   const blockHW = block.getHeightWidth();
//   //   const blockXY = block.getRelativeToSurfaceXY();
//   //   if (BlocklyGames.IS_RTL) {
//   //     blockXY.x -= blockHW.width;
//   //   }
//   //   let radius = Math.max(175, Math.min(halfHeight, halfWidth) -
//   //     Math.max(blockHW.height, blockHW.width) / 2);

//   //   const ms = Date.now();
//   //   // Rotate the blocks around the centre.
//   //   const angle = angleOffset + (ms / 50 % 360);
//   //   // Vary the radius sinusoidally.
//   //   radius *= Math.sin(((ms % 5000) / 5000) * (Math.PI * 2)) / 8 + 7 / 8;
//   //   const targetX = angleDx(angle, radius) + halfWidth -
//   //     blockHW.width / 2;
//   //   const targetY = angleDy(angle, radius) + halfHeight -
//   //     blockHW.height / 2;
//   //   const speed = 5;

//   //   const distance = Math.sqrt(Math.pow(targetX - blockXY.x, 2) +
//   //     Math.pow(targetY - blockXY.y, 2));
//   //   let dx, dy;
//   //   if (distance < speed) {
//   //     dx = targetX - blockXY.x;
//   //     dy = targetY - blockXY.y;
//   //   } else {
//   //     const heading = pointsToAngle(blockXY.x, blockXY.y, targetX, targetY);
//   //     dx = Math.round(angleDx(heading, speed));
//   //     dy = Math.round(angleDy(heading, speed));
//   //   }
//   //   block.moveBy(dx, dy);
//   //   setTimeout(animate, 50, block, angleOffset);
//   // }


//   function angleDx(degrees, radius) {
//     return radius * Math.cos(Blockly.utils.math.toRadians(degrees));
//   }


//   function angleDy(degrees, radius) {
//     return radius * Math.sin(Blockly.utils.math.toRadians(degrees));
//   }


//   function pointsToAngle(x1, y1, x2, y2) {
//     const angle = Blockly.utils.math.toDegrees(Math.atan2(y2 - y1, x2 - x1));
//     return Blockly.normalizeAngle(angle);
//   }

//   function showHelp(animate) {
//     const xml = [
//       '<xml>',
//       '<block type="animal" x="5" y="5">',
//       '<mutation animal="1"></mutation>',
//       '<title name="LEGS">1</title>',
//       '<value name="PIC">',
//       '<block type="picture">',
//       '<mutation animal="1"></mutation>',
//       '</block>',
//       '</value>',
//       '<statement name="TRAITS">',
//       '<block type="trait">',
//       '<mutation animal="1" trait="2"></mutation>',
//       '<next>',
//       '<block type="trait">',
//       '<mutation animal="1" trait="1"></mutation>',
//       '</block>',
//       '</next>',
//       '</block>',
//       '</statement>',
//       '</block>',
//       '</xml>'];
//     Blockly.injectReadonly('sample', xml);

//     const help = Blockly.getElementById('help');
//     const button = Blockly.getElementById('helpButton');
//     const style = {
//       width: '50%',
//       left: '25%',
//       top: '5em',
//     };
//     Blockly.showDialog(help, button, animate, true, style,
//       Blockly.stopDialogKeyDown);
//     Blockly.startDialogKeyDown();
//   }

//   Blockly.callWhenLoaded(init);
// };
