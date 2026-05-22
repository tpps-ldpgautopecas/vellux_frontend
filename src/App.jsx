import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import logo from './assets/Logo.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
      
      {/* Ajuste a propriedade 'src' dependendo de onde a sua imagem estiver salva.
        Se estiver na pasta 'public', você pode usar o caminho direto como abaixo.
        A classe 'w-64 md:w-96' controla o tamanho da logo (responsivo).
      */}
      <img src={logo} className="vite" alt="Vite logo" />
      
    </div>
    </>
  )
}

export default App
