import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'

import '@mdi/font/css/materialdesignicons.css'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export const vuetify = createVuetify({
  components,
  directives,

  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#FF8747',
          background: '#121212',
          surface: '#1E1E1E',
          error: '#CF6679',
        },
      },
      light: {
        colors: {
          primary: '#FF8747',
          background: '#FFFFFF',
          surface: '#FFFFFF',
          error: '#B00020',
        },
      },
    },
  },
  
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})
