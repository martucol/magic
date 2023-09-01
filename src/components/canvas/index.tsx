import { useEffect, useLayoutEffect, useRef } from "react";


export const Canvas = ( ) => {
const html = useRef<any>(null)
const canvas = useRef<any>(null)
const context = useRef<any | null>(null)

	
const frameCount = 60; // no of frames
// Images url. Name your images in sequence from 0001.png (or jpg) to 0xxx.jpg
const currentFrame = (index: number) => (
  `/img/sequence/${index.toString().padStart(4, '0')}.png`
)

const preloadImages = () => {
  for (let i = 1; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
  }
};

useLayoutEffect(() => {
    if (document) {
        html.current =  document.documentElement;
        canvas.current = document.getElementById("scroll-canvas") as HTMLCanvasElement;
    }

    if (canvas.current) {
        context.current = canvas.current.getContext("2d");
    }

    if (!!context.current) {
        context.current.clearRect(0, 0, canvas.current.width, canvas.current.height);

        const img = new Image()
        img.src = currentFrame(1);
        canvas.current.width = window.innerWidth;
        canvas.current.height = window.innerHeight;
            
        img.onload=function(){
            if (!!context.current) {
          context.current.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
            }
        }
        
        const updateImage = (index : number)  => {
        //   context.current.clearRect(0, 0, canvas.current.width, canvas.current.height);

          img.src = currentFrame(index);
          if (!!context.current) {
          context.current.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
          }
        }
        const handleScroll = () => {  

          const scrollTop = html.current.scrollTop;
          const maxScrollTop = html.current.scrollHeight - window.innerHeight;
          const scrollFraction = scrollTop / maxScrollTop;
          const frameIndex = Math.min(
            frameCount - 1,
            Math.ceil(scrollFraction * frameCount)
          );
          
          requestAnimationFrame(() => updateImage(frameIndex + 1))
        }
        
        window.addEventListener('scroll', handleScroll);
        
        preloadImages()


        return () => {
          window.removeEventListener('scroll', handleScroll);
        }

    }
}, [])


  return (
    <div className="canvas-container">
    <canvas id="scroll-canvas"></canvas>
    </div>
  )
}
