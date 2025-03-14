import { render } from '@testing-library/react';

import BaseHeader from './BaseHeader';

describe('BaseHeader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BaseHeader />);
    expect(baseElement).toBeTruthy();
  });
});
