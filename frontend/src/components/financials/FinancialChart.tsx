import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { getCashFlowChartData } from '../../services/financialService';
import type { CashFlowChartData } from '../../services/financialService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const FinancialChart = () => {
  const [chartData, setChartData] = useState<CashFlowChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'monthly' | 'daily'>('monthly');

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const data = await getCashFlowChartData(period);
        setChartData(data);
        setError(null);
      } catch (err) {
        setError('Não foi possível carregar os dados do gráfico.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [period]);

  const data = {
    labels: chartData?.labels || [],
    datasets: [
      {
        label: 'Entradas',
        data: chartData?.inflows || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Saídas',
        data: chartData?.outflows || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false, // O título já está fora do canvas
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Visão Geral</h3>
        <div>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-3 py-1 text-sm rounded-md ${period === 'monthly' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Mensal
          </button>
          <button
            onClick={() => setPeriod('daily')}
            className={`ml-2 px-3 py-1 text-sm rounded-md ${period === 'daily' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Últimos 30 dias
          </button>
        </div>
      </div>

      <div className="h-64">
        {loading && <p className="text-center">Carregando gráfico...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && chartData && (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
};

export default FinancialChart;
