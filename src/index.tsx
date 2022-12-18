/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ChakraProvider } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client';
import theme from './config/theme';
import './index.css';
import Root from './pages/root';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <ChakraProvider theme={theme}>
    <Root />
  </ChakraProvider>,
);
