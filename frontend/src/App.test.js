/*
  Purpose:
  - Simple smoke test to ensure the application's main heading renders. This
    file demonstrates basic React Testing Library usage; add more targeted
    tests under `/src` as components gain behavior.
*/

import { render, screen } from '@testing-library/react';
 
import App from './App';

// Keep module-scope reference to avoid false-positive `no-unused-vars` from some linters
void App;

test('renders main heading', () => {
  render(<App />);
  const heading = screen.getByText(/welcome to thunder road/i);
  expect(heading).toBeInTheDocument();
});
