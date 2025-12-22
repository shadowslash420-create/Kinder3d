interface GradientDividerProps {
  fromColor: string;
  toColor: string;
  height?: string;
}

export default function GradientDivider({ 
  fromColor, 
  toColor, 
  height = "h-32"
}: GradientDividerProps) {
  return (
    <div 
      className={`w-full ${height} relative overflow-hidden`}
      style={{
        background: `linear-gradient(180deg, ${fromColor} 0%, ${toColor} 100%)`,
      }}
    />
  );
}
