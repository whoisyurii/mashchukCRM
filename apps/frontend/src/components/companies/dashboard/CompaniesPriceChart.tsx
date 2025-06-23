import { useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useCompaniesQuery } from "../../../hooks/useCompaniesQuery";
import { shortenName, shortenNumber } from "../../../utils/shortener-helpers";

const CompaniesPriceChart = () => {
  const { data: companiesResponse, isLoading } = useCompaniesQuery({
    page: 1,
    limit: 6,
    sortBy: "capital",
    sortOrder: "desc",
  });
  const [activeIndex, setActiveIndex] = useState(0);

  const chartData = (companiesResponse?.data ?? []).map((company) => ({
    name: shortenName(company.name),
    capital: company.capital,
    fullName: company.name,
  }));
  const handleClick = (_data: any, index: number) => {
    setActiveIndex(index);
  };

  if (isLoading)
    return <div className="text-center py-4">Loading chart...</div>;

  if (chartData.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No companies to display
      </div>
    );
  }

  const activeItem = chartData[activeIndex];

  return (
    <div style={{ width: "100%" }}>
      <p className="text-sm text-gray-600 mb-2">
        Click each bar to see details
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
          <YAxis
            tickFormatter={shortenNumber}
            tick={{ fontSize: 12 }}
            stroke="#64748b"
          />
          <Tooltip
            formatter={(value: number) => [
              `$${shortenNumber(value)}`,
              "Capital",
            ]}
            labelFormatter={(label: string) => `Company: ${label}`}
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #38bdf8",
              borderRadius: "6px",
              color: "#fff",
            }}
          />
          <Bar dataKey="capital" onClick={handleClick} cursor="pointer">
            {chartData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === activeIndex ? "#38bdf8" : "#1A334F"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 p-3 bg-dark-800 rounded-lg">
        <p className="text-sm font-medium text-white-800">
          Capital of "{activeItem?.fullName}":{" "}
          <span className="text-blue-600">
            ${shortenNumber(activeItem?.capital || 0)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CompaniesPriceChart;
