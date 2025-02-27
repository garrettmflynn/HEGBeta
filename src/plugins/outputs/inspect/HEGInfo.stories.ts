// import { fn } from '@storybook/test';

import type { Meta, StoryObj } from '@storybook/web-components';

import type { HEGInfoProps } from './HEGInfo';
import { HEGInfo } from './HEGInfo';

const getHEGData = (red, ir, range) => {
  const [ min = 0, max = 1 ] = range
  const score = min + (max - min) * (red / ir)
  return {
    red,
    ir,
    score
  }
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Plugins/HEGInfo',
  tags: [ 'plugin', 'output', 'inspect' ],
  render: (args) => new HEGInfo(args)
} satisfies Meta<HEGInfoProps>;

export default meta;
type Story = StoryObj<HEGInfoProps>;


export const Populated: Story = {
  args: {
    data: getHEGData(0.5, 1.0, [ 0.1, 0.75 ])
  },
};

export const Empty: Story = {
  args: {
    data: {}
  },
};