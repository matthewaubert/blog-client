import { grid } from 'ldrs'; // https://uiball.com/ldrs/
grid.register();

interface Props {
  color?: string;
}

export default function LoadingIndicator({ color = '#2563eb' }: Props) {
  return (
    <span className="loading-indicator fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <l-grid color={color} size="150" />
    </span>
  );
}
