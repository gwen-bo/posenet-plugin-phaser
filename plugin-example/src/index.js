import Phaser from "phaser";

import css from './style.css';
import PoseNetPlugin from './plugins/PoseNetPlugin.js'

import {GameScene} from './scenes/Game.js';

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xFFE5D2,
  plugins: {
    global: [
        { key: 'PoseNetPlugin', plugin: PoseNetPlugin, start: true}
    ]
  },
  physics: {
    default: 'arcade',
    arcade: {
        gravity: 0
    }
  },
  scenes: [],
};

const game = new Phaser.Game(config);

game.scene.add(`gameScene`, GameScene, true);