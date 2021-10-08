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

        p.colors = ["#FFC618", "#F42539", "#4178F4", "#FE84FE", "#FF8119", "#56AC51", "#9819FA"];

        p.grid = [];

        p.loadMidi = () => {
            Midi.fromUrl(midi).then(
                function(result) {
                    const noteSet1 = result.tracks[5].notes; // Synth 1
                    p.scheduleCueSet(noteSet1, 'executeCueSet1');
                    p.audioLoaded = true;
                    document.getElementById("loader").classList.add("loading--complete");
                    document.getElementById("play-icon").classList.remove("fade-out");
                }
            );
            
        }

        p.scheduleCueSet = (noteSet, callbackName)  => {
            let lastTicks = -1;
            for (let i = 0; i < noteSet.length; i++) {
                const note = noteSet[i],
                    { ticks, time } = note;
                if(ticks !== lastTicks){
                    note.currentCue = i + 1;
                    p.song.addCue(time, p[callbackName], note);
                    lastTicks = ticks;
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

        p.form = (x, y, delayAmount, width, height = width) => {
            let t = p.random(88888);
            let a = p.random(888888);
            let col1 = p.color(p.random(p.colors));
            let col2 = p.color(p.random(p.colors));
            col1.setAlpha(10);
            col2.setAlpha(30);
            p.push();
            p.translate(x, y);
            p.rotate(a);
            p.stroke(col1);
            p.noFill();
            for (let i = 0; i < 1000; i++) {
                p.rotate(p.noise(i * 0.01) * 0.03);
                p.stroke(col1);
                if (p.random() < 0.01) p.stroke(col2);
                p.rect(0, 0, width * p.noise(i * 0.007, t), height * p.noise(i * 0.01, t));
                t += 0.001;
            }
            p.pop();
        }

        p.executeCueSet1 = (note) => {
            const w = p.width / 7  * p.random(0.2, 2),
                h = p.height / 4  * p.random(0.2, 2),
                x = p.random(0, p.width),
                y = p.random(0, p.height),
                delay = parseInt(note.duration * 1000) / 1000;
            p.form(x, y, delay, w, h);

            // for (let i = 0; i < 1000; i++) {
            //     setTimeout(
            //         function () {
            //             p.drawTriangleGroup(triangles[i])
            //         },
            //         (delayAmount * i)
            //     );
            // }
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
            p.background(0);
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
