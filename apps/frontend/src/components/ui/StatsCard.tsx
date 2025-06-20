import { Card } from "./Card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  onClick,
  className = "",
}) => {
  const cardClassName = onClick
    ? `cursor-pointer hover:bg-dark-800 transition-colors ${className}`
    : className;

  return (
    <Card className={cardClassName} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white max-md:truncate max-md:w-24">{value}</p>
        </div>
        <div className="p-3 bg-emerald-500/10 rounded-lg">{icon}</div>
      </div>
    </Card>
  );
};
