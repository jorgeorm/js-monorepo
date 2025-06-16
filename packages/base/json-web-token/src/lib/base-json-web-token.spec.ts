import { baseJsonWebToken } from './base-json-web-token';

describe('baseJsonWebToken', () => {
  it('should work', () => {
    expect(baseJsonWebToken()).toEqual('BaseJsonWebToken');
  });
});
