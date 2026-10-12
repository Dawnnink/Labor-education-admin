import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles'
import {
  CssBaseline,
  CssVarsProvider as JoyCssVarsProvider,
  extendTheme as joyExtendTheme,
} from '@mui/joy'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
const materialTheme = materialExtendTheme({
  // Disable ripple effect
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
})

const joyTheme = joyExtendTheme({
  components: {
    JoyAutocomplete: {
      defaultProps: {
        clearText: '清空',
        closeText: '关闭',
        loadingText: '加载中……',
        noOptionsText: '没有可用选项',
        openText: '打开',
      },
    },
  },
  colorSchemes: {
    dark: {
      palette: {
        background: { body: '#191921' },
      },
    },
  },
})

// https://mui.com/joy-ui/guides/using-joy-ui-and-material-ui-together/

const App = () => {
  return (
    <MaterialCssVarsProvider
      theme={{ [MATERIAL_THEME_ID]: materialTheme }}
      defaultMode="light"
    >
      <JoyCssVarsProvider theme={joyTheme} defaultMode="light">
        <CssBaseline />
        <RouterProvider router={router} />
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  )
}

export default App
