import React from 'react';
import ChatContainer from './components/ChatContainer';
import { createTheme, MantineProvider} from '@mantine/core'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

const theme = createTheme({
  colorScheme: 'light',
  primaryColor: 'teal',
  secondaryColor: 'gray',
  fontFamily: 'Inter, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, Arial, sans-serif',
    fontWeight: 600,
  },
  components: {
    Paper: {
      defaultProps: {
        shadow: 'md',
        radius: 'md',
      },
    },
    Button: {
      defaultProps: {
        variant: 'filled',
        radius: 'md',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});


const App = () => {
  return (
    <MantineProvider theme={theme}>
      <ChatContainer />
    </MantineProvider>
  );
};

export default App;