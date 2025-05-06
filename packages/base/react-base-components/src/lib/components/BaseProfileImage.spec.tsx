import { render } from '@testing-library/react';

import BaseHeaderImage from './BaseProfileImage';

describe('BaseHeaderImage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BaseHeaderImage />);
    expect(baseElement).toBeTruthy();
  });
});
