// import React, { useRef, useState, useEffect, useContext } from "react";
// import Tone from 'tone'
// import { Midi } from '@tonejs/midi'
// import { Context } from "./context/Context.js";

// import audio from "../audio/rectangles-no-3.ogg";
// import midi from "../audio/rectangles-no-3.mid";

// const Audio = () => {
//     const { updateNotes, updateIsAudioPlaying } = useContext(Context);

//     Tone.Transport.PPQ = 3840 * 4;
//     const player = useRef(),
//         [loaded, setLoaded] = useState(false),
//         mousePressed = () => {
//           if (player.current.state === "started") {
//             updateIsAudioPlaying(false);
//             Tone.Transport.pause(); // Use the Tone.Transport to pause audio
            
//           } 
//           else if (player.current.state === "stopped") {
//             updateIsAudioPlaying(true);
//             Tone.Transport.start(); // Use the Tone.Transport to start again
//           }
//         };

//     useEffect(
//         () => {
//             const initPlayer = () => {
//                 if(!loaded){
//                     document.body.addEventListener('click',  async () => { setLoaded(true) }, true);
//                     setLoaded(true);
//                 }
//             };
//             if(!loaded){
//                 Midi.fromUrl(midi).then(
//                     function(result) {
//                         console.log(result.tracks);
//                         const noteSet1 = result.tracks[3].notes; // Sampler 1 - Heavy guitar
//                         player.current = new Tone.Player(audio, () => { initPlayer(); }).toMaster();
//                         player.current.sync().start(0);
//                         let lastTicks = -1;
//                         for (let i = 0; i < noteSet1.length; i++) {
//                             const note = noteSet1[i],
//                                 { ticks, midi, time } = note;
//                             if(ticks !== lastTicks){
//                                 Tone.Transport.schedule(
//                                     () => {
//                                         //update the global contect provider
//                                         updateNotes(midi);
//                                     }, 
//                                     time
//                                 );
//                                 lastTicks = ticks;
//                             }
//                         } 
//                     }
//                 );
//             }
//         }, 
//         [loaded, setLoaded]
//     );

//     return <></>;
// }
 
// export default Audio;
