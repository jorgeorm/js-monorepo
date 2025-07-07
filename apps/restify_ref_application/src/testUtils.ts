import { jest } from '@jest/globals';
import { Request, Response, Next } from 'restify';

export type RestifyHandlerMocks = {
  req: Request;
  res: Response;
  next: Next;
};

export function getRestifyHandlerMocks(
  request?: Partial<Request>
): RestifyHandlerMocks {
  const req = (request ?? {}) as Request;
  const res = {
    send: jest.fn(),
  } as Partial<Response> as Response;
  const next = jest.fn() as jest.Mock<Next>;

  return { req, res, next };
}
