/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createRoot } from 'react-dom/client';
import './index.css';
import Root from './pages/root';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(<Root />);
