import { CssBaseline, CssVarsProvider } from '@mui/joy'
import { theme } from './theme'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

function App() {
  return (
    <CssVarsProvider theme={theme} defaultMode="system">
      <CssBaseline />
      <RouterProvider router={router} />
    </CssVarsProvider>
  )
}

export default App
