import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getCashFlowChartData } from '@/services/FinancialService';
import type { CashFlowChartData } from '@/services/FinancialService';
import { DashboardColors } from '@/constants/DashboardColors';

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

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40; // marginHorizontal * 2

  const dataForChart = {
    labels: chartData?.labels || [],
    datasets: [
      {
        data: chartData?.inflows || [0],
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`, // Verde
        strokeWidth: 2,
      },
      {
        data: chartData?.outflows || [0],
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Vermelho
        strokeWidth: 2,
      },
    ],
    legend: ['Entradas', 'Saídas'],
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Visão Geral</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => setPeriod('monthly')}
            style={[styles.button, period === 'monthly' ? styles.buttonActive : styles.buttonInactive]}
          >
            <Text style={[styles.buttonText, period === 'monthly' ? styles.buttonTextActive : {}]}>Mensal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPeriod('daily')}
            style={[styles.button, period === 'daily' ? styles.buttonActive : styles.buttonInactive]}
          >
            <Text style={[styles.buttonText, period === 'daily' ? styles.buttonTextActive : {}]}>30 dias</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && <ActivityIndicator size="large" color={DashboardColors.primary} style={styles.centered} />}
      {error && <Text style={[styles.centered, styles.errorText]}>{error}</Text>}
      {!loading && !error && chartData && (
        <LineChart
          data={dataForChart}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      )}
    </View>
  );
};

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
  style: {
    borderRadius: 8,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
  },
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DashboardColors.darkText,
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    button: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 15,
        marginLeft: 8,
    },
    buttonActive: {
        backgroundColor: DashboardColors.primary,
    },
    buttonInactive: {
        backgroundColor: '#eee',
    },
    buttonText: {
        fontSize: 12,
        color: DashboardColors.darkText,
    },
    buttonTextActive: {
        color: 'white',
    },
    centered: {
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 8,
    },
});

export default FinancialChart;
