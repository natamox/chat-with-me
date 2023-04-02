/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createRoot } from 'react-dom/client';
import './index.css';
import { STORES } from '@stores';
import Root from './root';

const container = document.getElementById('root');
const root = createRoot(container!);

window._STORES = STORES;

root.render(<Root />);
