import { Line } from 'react-konva';

interface HorizontalLineGuideConfig {
  y: number;
  direction: 'horizontal';
}

interface VerticalLineGuideConfig {
  x: number;
  direction: 'vertical';
}

export type LineGuideConfig = HorizontalLineGuideConfig | VerticalLineGuideConfig;

const LineGuide = (line: LineGuideConfig): JSX.Element => {
  const points = line.direction === 'horizontal'
  ? [-6000, line.y, 6000, line.y]
  : [line.x, -6000, line.x, 6000];

  return (
    <Line
      points={points}
      stroke="rgb(0, 161, 255)"
      strokeWidth={1}
      dash={[4, 6]}
    />
  );
};

export default LineGuide;
