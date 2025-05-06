import { PropsWithChildren } from 'react';
import BaseProfileImage from './BaseProfileImage';

export interface BaseHeaderProps {
  className?: string;
}

export function BaseHeader({
  className,
  children,
}: PropsWithChildren<BaseHeaderProps>): JSX.Element {
  // Default child to be rendered if no children are provided
  const defaultChild = (
    <>
      <h1 className="text-2xl font-bold text-gray-800">
        Base Header Component
      </h1>
      <BaseProfileImage />
    </>
  );

  return (
    <header
      className={
        className ??
        'bg-white border-b border-gray-200 py-4 px-6 shadow-sm flex items-center justify-between'
      }
    >
      {children ?? defaultChild}
    </header>
  );
}

export default BaseHeader;
