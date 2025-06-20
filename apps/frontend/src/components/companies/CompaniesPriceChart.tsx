import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';

const CompaniesPriceChart = () => {

    const data = [
        { date: '2023-01-01', price: 100 },
        { date: '2023-01-02', price: 120 },
        { date: '2023-01-03', price: 90 },
        { date: '2023-01-04', price: 150 },
        { date: '2023-01-05', price: 130 },
    ];

  return (
    <div>
        <ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="price" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>
    </div>
  )
}

export default CompaniesPriceChart