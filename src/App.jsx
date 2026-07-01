import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1526',
            color: '#e2e8f0',
            border: '1px solid rgba(56,189,248,0.2)',
            fontFamily: "'Inter', sans-serif",
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#0d1526' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#0d1526' } },
        }}
      />
      <Home />
    </>
  )
}
