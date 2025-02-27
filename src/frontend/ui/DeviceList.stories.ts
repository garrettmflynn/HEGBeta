// import { fn } from '@storybook/test';

import type { Meta, StoryObj } from '@storybook/web-components';

import type { DeviceListProps } from './DeviceList';
import { DeviceList } from './DeviceList';

const exampleDeviceList = [
    { 
      name: "HEGduino",
      type: "HEG",
      protocols: {
          ble: { label: 'Bluetooth' },
          serial: { label: 'USB' }
      }
    }
]

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'App/Devices',
  tags: ['autodocs'],
  render: (args) => new DeviceList(args)
} satisfies Meta<DeviceListProps>;

export default meta;
type Story = StoryObj<DeviceListProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Populated: Story = {
  args: {
    devices: exampleDeviceList
  },
};