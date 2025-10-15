import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main heading', () => {
  render(<App />);
  const heading = screen.getByText(/welcome to thunder road/i);
  expect(heading).toBeInTheDocument();
});
