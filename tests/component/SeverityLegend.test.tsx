import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeverityLegend } from '@/features/severity/SeverityLegend';

describe('SeverityLegend Component', () => {
  it('renders all severity bands for a given magnitude', () => {
    render(<SeverityLegend magnitude={5.0} />);

    expect(screen.getByText(/Disaster Severity Bands/i)).toBeInTheDocument();
    expect(screen.getByText('Severe')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Moderate')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();

    // At magnitude 5.0, Severe band is 0 - 5 km
    expect(screen.getByText('0 – 5 km')).toBeInTheDocument();
  });

  it('updates distance ranges dynamically when magnitude increases', () => {
    const { rerender } = render(<SeverityLegend magnitude={5.0} />);
    expect(screen.getByText('0 – 5 km')).toBeInTheDocument();

    rerender(<SeverityLegend magnitude={7.0} />);
    // At M7.0, Severe band expands
    expect(screen.queryByText('0 – 5 km')).not.toBeInTheDocument();
    expect(screen.getByText(/M7.0/i)).toBeInTheDocument();
  });
});
