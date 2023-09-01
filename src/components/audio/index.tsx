'use client'

import { useEffect, useLayoutEffect, useRef, useState } from "react";


export const AudioPlayer = ( ) => {
    const html = useRef<any>(null)

    const audioCtx= useRef<AudioContext | null>(null)
    const filter = useRef<any>(null)
    const audioFile = useRef<any>(null)    

    const [dataPlaying, setDataPlaying] = useState(false);

    useLayoutEffect(() => {
        if (document) {
            html.current =  document.documentElement;
        }
    
    
        const AudioContext = window.AudioContext
        const ctx = new AudioContext()

        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = 110;
        osc.start();



        const biquadFilter = ctx.createBiquadFilter();
        biquadFilter.type = "lowpass"
        biquadFilter.frequency.setValueAtTime(0, ctx.currentTime)

        const convolver = ctx.createConvolver();

        const gainNode = ctx.createGain();

        const audio =  new Audio('mp3/loop.mp3')
        const loop = ctx.createMediaElementSource(audio);

        loop.connect(biquadFilter);

        biquadFilter.connect(gainNode)
        gainNode.connect(ctx.destination);






        audioCtx.current = ctx
        filter.current = biquadFilter
        audioFile.current = audio


        return () => {
            gainNode.disconnect(ctx.destination)
        }



    }, [])


    useEffect(() => {

        const handleScroll = () => {  


            const scrollTop = html.current.scrollTop;
            const maxScrollTop = html.current.scrollHeight - window.innerHeight;
            const scrollFraction = scrollTop / maxScrollTop;
            
            const cutOffFrequency = scrollFraction * 4 * 700
            if (filter.current && audioCtx.current) {

                audioCtx.current.resume()


                filter.current.frequency.setValueAtTime(cutOffFrequency, audioCtx.current.currentTime)
            }


        
            
        }
          
          window.addEventListener('scroll', handleScroll);

          return () => {
            window.removeEventListener('scroll', handleScroll);
          }
    }, [])





    const toggleOscillator = () => {
        if (audioCtx.current) {
            if (dataPlaying) {
                audioCtx.current.suspend();
            } else {
                audioFile.current.play();
                audioCtx.current.resume();
            }
            
        } 
        setDataPlaying((play) => !play);
      };



  return (
    <div className="audio">
        <button className="fixed text-center" onClick={toggleOscillator} data-playing={dataPlaying}>
            {dataPlaying ? 'pause' : 'play'}
      </button>

    </div>
  )
}
