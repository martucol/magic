import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Canvas } from '@/components/canvas'
import { AudioPlayer } from '@/components/audio'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <AudioPlayer />
      <Canvas />
    </main>
  )
}
