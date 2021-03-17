import React from 'react';
import Box from '../utils/Box';

type Props = {
  width?: number;
};
const LibraryIcon: React.FC<Props> = ({ width = '30px' }) => {
  const color = '#999';
  const transparent = 'rgba(0,0,0,0)';
  // <defs><style>.cls-1,.cls-2{fill:none;stroke:#000;stroke-linejoin:round;stroke-width:32px;}.cls-2{stroke-linecap:round;}</style></defs>
  return (
    <Box>
      <svg
        id="Library_Icon"
        width="30px"
        data-name="Library_Icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 480 448">
        <rect fill={color} x="16" y="64" width="64" height="368" rx="16" />
        <path
          d="M112,224H240M112,400H240"
          transform="translate(-16 -32)"
          fill={transparent}
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="32px"
        />
        <rect
          x="96"
          y="128"
          width="128"
          height="304"
          rx="16"
          fill={transparent}
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="32px"
        />
        <rect
          x="240"
          y="16"
          width="96"
          height="416"
          rx="16"
          fill={transparent}
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="32px"
        />
        <path
          d="M422.46,96.11l-40.4,4.25c-11.12,1.17-19.18,11.57-17.93,23.1l34.92,321.59c1.26,11.53,11.37,20,22.49,18.84l40.4-4.25c11.12-1.17,19.18-11.57,17.93-23.1L445,115C443.69,103.42,433.58,94.94,422.46,96.11Z"
          transform="translate(-16 -32)"
          fill={transparent}
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="32px"
        />
      </svg>
    </Box>
  );
};

export default LibraryIcon;
