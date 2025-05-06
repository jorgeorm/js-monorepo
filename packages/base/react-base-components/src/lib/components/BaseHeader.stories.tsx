import type { Meta, StoryObj } from '@storybook/react';
import { BaseHeader } from './BaseHeader';
// import { within } from '@storybook/testing-library';
// import { expect } from '@storybook/jest';
import BaseProfileImage from './BaseProfileImage';

const meta: Meta<typeof BaseHeader> = {
  component: BaseHeader,
  title: 'BaseHeader',
};
export default meta;
type Story = StoryObj<typeof BaseHeader>;

export const Primary: Story = {
  args: {},
};

export const CustomChildren: Story = {
  args: {
    children: (
      <>
        <h1 className="text-2xl font-bold text-gray-800">Custom Header</h1>
        <BaseProfileImage />
        <button className="self-end bg-blue-950 text-white p-3 rounded-md active:to-blue-800">
          A button in the
        </button>
      </>
    ),
    className: 'flex flex-row text-white p-3 active:to-blue-800 w-100',
  },
  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);
  //   expect(canvas.getByText(/Base Header Component/gi)).toBeTruthy();
  // },
};
