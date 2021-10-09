import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import { Midi } from '@tonejs/midi'
import PlayIcon from './functions/PlayIcon.js';
import ShuffleArray from './functions/ShuffleArray.js';

import audio from "../audio/crystals-no-1.ogg";
import midi from "../audio/crystals-no-1.mid";

const P5SketchWithAudio = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.audioLoaded = false;

        p.player = null;

        p.PPQ = 3840 * 4;

        p.colours = ["#FFC618", "#F42539", "#4178F4", "#FE84FE", "#FF8119", "#56AC51", "#9819FA"];

        p.grid = [];

        p.loadMidi = () => {
            Midi.fromUrl(midi).then(
                function(result) {
                    const noteSet1 = result.tracks[3].notes, // Maelstrom 3 - Coins
                        noteSet2 = result.tracks[4].notes; // Maelstrom 4 - Twerpoff
                    p.scheduleCueSet(noteSet1, 'executeCueSet1');
                    p.scheduleCueSet(noteSet2, 'executeCueSet2');
                    p.audioLoaded = true;
                    document.getElementById("loader").classList.add("loading--complete");
                    document.getElementById("play-icon").classList.remove("fade-out");
                }
            );
            
        }

        p.scheduleCueSet = (noteSet, callbackName)  => {
            let lastTicks = -1, 
                currentCue = 1;
            for (let i = 0; i < noteSet.length; i++) {
                const note = noteSet[i],
                    { ticks, time } = note;
                if(ticks !== lastTicks){
                    note.currentCue = currentCue;
                    p.song.addCue(time, p[callbackName], note);
                    lastTicks = ticks;
                    currentCue++;
                }
            }
        } 

        p.preload = () => {
            p.song = p.loadSound(audio, p.loadMidi);
            p.song.onended(p.logCredits);
        }

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.blendMode(p.ADD);
            p.reset();
        }

        p.draw = () => {
            if(p.audioLoaded && p.song.isPlaying()){

            }
        }

        p.drawCrystal = (x, y, delayAmount, width, height = width, shape = 'rect') => {
            const colour = p.color(p.random(p.colours));
            colour.setAlpha(10);
            let t = p.random(88888),
                formArray = [],
                rotation = 0;
            for (let i = 0; i < 1000; i++) {
                rotation = rotation + p.noise(i * 0.01) * 0.03;
                formArray.push(
                    {
                        rotation: rotation,
                        colour: colour,
                        width: width * p.noise(i * 0.007, t),
                        height: height * p.noise(i * 0.01, t)
                    }
                );
                t += 0.001;
            }
            formArray = ShuffleArray(formArray);
            for (let i = 0; i < 1000; i++) {
                setTimeout(
                    function () {
                        const item = formArray[i];
                        p.push();
                        p.translate(x, y);
                        p.rotate(item.rotation);
                        p.stroke(item.colour);
                        p.noFill();
                        p[shape](0, 0, item.width, item.height);
                        t += 0.001;
                        p.translate(-x, -y);
                        p.pop();
                    },
                    (delayAmount * i)
                );
            }
        }

        p.executeCueSet1 = (note) => {
            const { currentCue, duration } = note,
                x = currentCue === 16 ? p.width / 2 : p.random(0, p.width),
                y = currentCue === 16 ? p.height / 2 : p.random(0, p.height),
                delay = parseInt(duration * 1000) / 1000,
                w = currentCue === 16 ? p.width / 2 : p.width / 7  * p.random(0.2, 2),
                h = currentCue === 16 ? p.height / 2 : p.height / 4  * p.random(0.2, 2),
                shape = currentCue === 16 ? 'equilateral' : 'rect';
                
                
            if(currentCue === 16) {
                p.clear();
                p.background(0);
                p.drawCrystal(x, y, delay, w / 4, h / 4, 'hexagon');
            }
            p.drawCrystal(x, y, delay, w, h, shape);
        }

        p.executeCueSet2 = (note) => {
            const { duration } = note,
                x = p.random(0, p.width),
                y = p.random(0, p.height),
                delay = parseInt(duration * 1000) / 1000,
                w = p.width / 7  * p.random(0.5, 2),
                h = p.height / 4  * p.random(0.5, 2),
                shape = p.random(['ellipse', 'rect']);
            p.drawCrystal(x, y, delay, w, h, shape);
        }

        /*
       * function to draw an equilateral triangle with a set width
       * based on x, y co-oridinates that are the center of the triangle
       * @param {Number} x        - x-coordinate that is at the center of triangle
       * @param {Number} y      	- y-coordinate that is at the center of triangle
       * @param {Number} width    - radius of the hexagon
       */
      p.equilateral = (x, y, width) => {
        const x1 = x - width / 2;
        const y1 = y + width / 2;
        const x2 = x;
        const y2 = y - width / 2;
        const x3 = x + width / 2;
        const y3 = y + width / 2;
        p.triangle(x1, y1, x2, y2, x3, y3);
      };

      /*
       * function to draw a hexagon shape
       * adapted from: https://p5js.org/examples/form-regular-polygon.html
       * @param {Number} x        - x-coordinate of the hexagon
       * @param {Number} y      - y-coordinate of the hexagon
       * @param {Number} radius   - radius of the hexagon
       */
      p.hexagon = (x, y, radius) => {
        radius = radius / 2;
        p.angleMode(p.RADIANS);
        const angle = p.TWO_PI / 6;
        p.beginShape();
        for (var a = p.TWO_PI / 12; a < p.TWO_PI + p.TWO_PI / 12; a += angle) {
          let sx = x + p.cos(a) * radius;
          let sy = y + p.sin(a) * radius;
          p.vertex(sx, sy);
        }
        p.endShape(p.CLOSE);
      }

      /*
       * function to draw a octagon shape
       * adapted from: https://p5js.org/examples/form-regular-polygon.html
       * @param {Number} x        - x-coordinate of the octagon
       * @param {Number} y      - y-coordinate of the octagon
       * @param {Number} radius   - radius of the octagon
       */
      p.octagon = (x, y, radius) => {
        radius = radius / 2;
        p.angleMode(p.RADIANS);
        const angle = p.TWO_PI / 8;
        p.beginShape();
        for (var a = p.TWO_PI / 16; a < p.TWO_PI + p.TWO_PI / 16; a += angle) {
          let sx = x + p.cos(a) * radius;
          let sy = y + p.sin(a) * radius;
          p.vertex(sx, sy);
        }
        p.endShape(p.CLOSE);
      }

        p.mousePressed = () => {
            if(p.audioLoaded){
                if (p.song.isPlaying()) {
                    p.song.pause();
                } else {
                    if (parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                        p.reset();
                    }
                    document.getElementById("play-icon").classList.add("fade-out");
                    p.canvas.addClass("fade-in");
                    p.song.play();
                }
            }
        }

        p.creditsLogged = false;

        p.logCredits = () => {
            if (
                !p.creditsLogged &&
                parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
            ) {
                p.creditsLogged = true;
                    console.log(
                    "Music By: http://labcat.nz/",
                    "\n",
                    "Animation By: https://github.com/LABCAT/",
                    "\n",
                    "Coding Inspiration: https://openprocessing.org/sketch/1034762 and https://editor.p5js.org/Nostrada/sketches/fEU5hRoIq"
                );
                p.song.stop();
            }
        };

        p.reset = () => {
            p.clear();
            p.background(0);
            p.randomColor = require('randomcolor');
            if (Math.random() < 0.9){
                console.log('Random colour set created...')
                p.colours = p.randomColor({luminosity: 'bright', count: 7});
            }
            const width = p.width / 7,
                height = p.height / 4;
            for (let x = 0; x < 7; x++) {
                for (let y = 0; y < 4; y++) {
                    p.grid.push(
                        {
                            x: x * width + width / 2,
                            y: y * height + height / 2
                        }
                    )
                }
            }
            p.grid = ShuffleArray(p.grid);
        }

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.canvas = p.resizeCanvas(p.canvasWidth, p.canvasHeight);
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
            <PlayIcon />
        </div>
    );
};

export default P5SketchWithAudio;
