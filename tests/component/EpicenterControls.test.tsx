import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EpicenterControls } from '@/features/severity/EpicenterControls';

describe('EpicenterControls Component', () => {
  it('renders magnitude slider and coordinates inputs', () => {
    const handleMagnitudeChange = vi.fn();
    const handleEpicenterChange = vi.fn();
    const handleTogglePick = vi.fn();

    render(
      <EpicenterControls
        epicenter={{ lat: 12.98, lon: 77.60 }}
        magnitude={5.5}
        onMagnitudeChange={handleMagnitudeChange}
        onEpicenterChange={handleEpicenterChange}
        isPickEpicenterMode={false}
        onTogglePickEpicenter={handleTogglePick}
      />
    );

    expect(screen.getByText('5.5')).toBeInTheDocument();
    expect(screen.getByLabelText(/Latitude/i)).toHaveValue(12.98);
    expect(screen.getByLabelText(/Longitude/i)).toHaveValue(77.60);
  });

  it('triggers magnitude change when slider value updates', () => {
    const handleMagnitudeChange = vi.fn();

    render(
      <EpicenterControls
        epicenter={null}
        magnitude={5.5}
        onMagnitudeChange={handleMagnitudeChange}
        onEpicenterChange={vi.fn()}
        isPickEpicenterMode={false}
        onTogglePickEpicenter={vi.fn()}
      />
    );

    const slider = screen.getByLabelText(/Magnitude/i);
    fireEvent.change(slider, { target: { value: '6.5' } });
    expect(handleMagnitudeChange).toHaveBeenCalledWith(6.5);
  });

  it('sets coordinates via preset buttons', () => {
    const handleEpicenterChange = vi.fn();

    render(
      <EpicenterControls
        epicenter={null}
        magnitude={5.5}
        onMagnitudeChange={vi.fn()}
        onEpicenterChange={handleEpicenterChange}
        isPickEpicenterMode={false}
        onTogglePickEpicenter={vi.fn()}
      />
    );

    const cityCenterBtn = screen.getByRole('button', { name: /City Center/i });
    fireEvent.click(cityCenterBtn);
    expect(handleEpicenterChange).toHaveBeenCalledWith({ lat: 12.98, lon: 77.60 });
  });
});
