import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCompaniesQuery } from '../../hooks/useCompaniesQuery';
import { shortenName, shortenNumber } from '../../utils/shortener-helpers';

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