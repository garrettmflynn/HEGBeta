// import { fn } from '@storybook/test';

import type { Meta, StoryObj } from '@storybook/web-components';

import type { HEGInfoProps } from './HEGInfo';
import { HEGInfo } from './HEGInfo';

const red = 526.2
const ir = 1452.4
const range = Math.max(red, ir) - Math.min(red, ir)

const getHEGInfo = (red, ir, range) => {
  const rawScore = red / ir
  const [ min = rawScore, max = rawScore ] = range
  const score = Math.max(0, Math.min(1, (rawScore - min) / (max - min)))

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
    data: getHEGInfo(red, ir, [ 0.1, 0.4 ]),
    norm: {
      min: Math.min(red, ir) - range * 0.3,
      max: Math.max(red, ir) + range * 0.3
    }
  }
};

export const Empty: Story = {
  args: {
    data: {}
  },
};