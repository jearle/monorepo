import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app';

const rootElement = document.getElementById('root');

if (rootElement === null) {
  throw Error(`#root element is missing`);
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
