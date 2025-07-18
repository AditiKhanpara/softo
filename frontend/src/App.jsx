import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <div className="flex justify-center items-center gap-8 mb-8">
          <a href="https://vite.dev" target="_blank" className="hover:scale-110 transition-transform duration-300">
            <img src={viteLogo} className="h-24 w-24 p-6 hover:drop-shadow-[0_0_2em_#646cffaa] transition-all duration-300" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" className="hover:scale-110 transition-transform duration-300">
            <img src={reactLogo} className="h-24 w-24 p-6 hover:drop-shadow-[0_0_2em_#61dafbaa] transition-all duration-300 animate-spin" alt="React logo" />
          </a>
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-8">Vite + React</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
          >
            count is {count}
          </button>
          <p className="text-gray-600">
            Edit <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="text-gray-500">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
