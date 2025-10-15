/*
  Purpose:
  - Simple smoke test to ensure the application's main heading renders. This
    file demonstrates basic React Testing Library usage; add more targeted
    tests under `/src` as components gain behavior.
*/

import { render, screen } from '@testing-library/react';
 
import App from './App';

// Some linters may not detect JSX usage; keep a tiny used-symbol reference.
const __usedTest = { App };
void __usedTest;

test('renders main heading', () => {
  render(<App />);
  const heading = screen.getByText(/welcome to thunder road/i);
  expect(heading).toBeInTheDocument();
});
