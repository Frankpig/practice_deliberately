import React, { useEffect, useRef, useContext, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
import SkillContext from '../contexts/SkillContext';

// 注册所有Chart.js组件
Chart.register(...registerables);

function SkillProgress() {
  const { skills } = useContext(SkillContext);
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  // 使用useMemo缓存skills数组，避免在每次渲染时都改变
  const memoizedSkills = useMemo(() => skills, [skills]);

  console.log('SkillProgress component mounted');
  console.log('Skills data:', memoizedSkills);

  useEffect(() => {
    // 确保有技能数据且DOM已经渲染
    if (memoizedSkills.length === 0) {
      console.log('No skills data available');
      return;
    }

    const timer = setTimeout(() => {
      // 准备饼图数据
      const pieData = {
        labels: memoizedSkills.map(skill => skill.name),
        datasets: [{
          data: memoizedSkills.map(skill => skill.hoursPracticed),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      };

      // 准备柱状图数据
      const barData = {
        labels: memoizedSkills.map(skill => skill.name),
        datasets: [{
          label: '已练习进度',
          data: memoizedSkills.map(skill => {
            // 计算百分比并保留两位小数，避免除以零
            if (skill.targetHours === 0) return 0;
            return Number(((skill.hoursPracticed / skill.targetHours) * 100).toFixed(2));
          }),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          barThickness: 40
        }]
      };

      // 创建饼图
      if (pieChartRef.current && !pieChartInstance.current) {
        try {
          pieChartInstance.current = new Chart(pieChartRef.current, {
            type: 'pie',
            data: {
              labels: pieData.labels,
              datasets: [{
                label: '练习时间分布',
                data: pieData.datasets[0].data,
                backgroundColor: [
                  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'
                ],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const value = context.raw;
                      return `${context.label}: ${value.toFixed(1)}小时`;
                    }
                  }
                }
              },
              animation: {
                animateScale: true,
                animateRotate: true
              }
            }
          });
          console.log('Pie chart created successfully');
        } catch (error) {
          console.error('Error creating pie chart:', error);
        }
      }

      // 创建柱状图
      if (barChartRef.current && !barChartInstance.current) {
        try {
          barChartInstance.current = new Chart(barChartRef.current, {
            type: 'bar',
            data: barData,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: '百分比 (%)'
                  },
                  ticks: {
                    callback: function(value) {
                      return value + '%';
                    }
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: '技能'
                  }
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: '技能练习进度'
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return context.dataset.label + ': ' + context.raw + '%';
                    }
                  }
                }
              }
            }
          });
          console.log('Bar chart created successfully');
        } catch (error) {
          console.error('Error creating bar chart:', error);
        }
      }
    }, 500); // 增加延迟时间到500ms

    // 组件卸载时销毁图表
    return () => {
      clearTimeout(timer);
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
        pieChartInstance.current = null;
        console.log('Pie chart destroyed');
      }
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
        barChartInstance.current = null;
        console.log('Bar chart destroyed');
      }
    };
  }, [memoizedSkills]);

  return (
    <div className="skill-progress-container" style={{ padding: '20px' }}>
      <h2>技能练习进度</h2>
      {memoizedSkills.length === 0 ? (
        <p>暂无技能数据，请先添加技能</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ width: '400px', height: '300px' }}>
            <canvas ref={pieChartRef}></canvas>
          </div>
          <div style={{ width: '500px', height: '300px' }}>
            <canvas ref={barChartRef}></canvas>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillProgress;