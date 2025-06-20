import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCompaniesQuery } from '../../hooks/useCompaniesQuery';

function shortenNumber(num: number) {
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

function shortenName(name: string, maxLen = 10) {
  return name.length > maxLen ? name.slice(0, maxLen) + '…' : name;
}

const CompaniesPriceChart = () => {
  const { data: companiesResponse, isLoading } = useCompaniesQuery({ page: 1, limit: 4, sortBy: 'capital', sortOrder: 'desc' });

  const chartData = (companiesResponse?.data ?? []).map(company => ({
    name: shortenName(company.name),
    price: company.capital,
    label: `${shortenName(company.name)}: $${shortenNumber(company.capital)}`
  }));

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={shortenNumber} />
          <Tooltip
            formatter={(value: number) => `$${shortenNumber(value)}`}
            labelFormatter={(label: string) => `Company: ${label}`}
          />
          <Area type="monotone" dataKey="price" stroke="#38bdf8" fill="#1A334F" />
          <Area type="monotone" dataKey="price" stroke="#38bdf8" fill="#1A334F" fillOpacity={0.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompaniesPriceChart;