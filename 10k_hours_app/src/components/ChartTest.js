import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

const ChartTest = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    console.log('ChartTest组件已加载');

    // 销毁旧图表
    if (chartInstance.current) {
      chartInstance.current.destroy();
      console.log('旧图表已销毁');
    }

    // 注册所有必要的组件
    Chart.register(...registerables);
    console.log('Chart.js组件已注册');

    // 创建测试数据
    const data = {
      labels: ['编程', '英语', '吉他'],
      datasets: [{
        label: '练习时间(小时)',
        data: [500, 1000, 200],
        backgroundColor: [
          'rgba(97, 218, 251, 0.5)',
          'rgba(33, 161, 241, 0.5)',
          'rgba(123, 31, 162, 0.5)'
        ],
        borderColor: [
          'rgba(97, 218, 251, 1)',
          'rgba(33, 161, 241, 1)',
          'rgba(123, 31, 162, 1)'
        ],
        borderWidth: 1
      }]
    };

    console.log('测试数据已创建:', data);

    // 创建图表
    if (chartRef.current) {
      try {
        chartInstance.current = new Chart(chartRef.current, {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                display: true
              },
              tooltip: {
                enabled: true
              }
            }
          }
        });
        console.log('图表创建成功');
      } catch (error) {
        console.error('创建图表时出错:', error);
      }
    } else {
      console.error('chartRef.current为空');
    }

    // 组件卸载时销毁图表
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        console.log('组件卸载，图表已销毁');
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartTest;