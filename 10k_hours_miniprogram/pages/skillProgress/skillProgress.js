// skillProgress.js
import { initPieChart, initBarChart } from '../../utils/chartUtils';

Page({
  data: {
    skills: [],
    darkMode: false,
    // 图表数据
    pieChartData: {
      labels: [],
      datasets: [{ data: [], backgroundColor: [] }]
    },
    barChartData: {
      labels: [],
      datasets: [{ label: '已练习进度', data: [], backgroundColor: '' }]
    }
  },
  
  onLoad: function() {
    // 获取全局应用实例
    const app = getApp();
    // 设置初始主题和技能数据
    this.setData({
      skills: app.globalData.skills,
      darkMode: app.globalData.darkMode
    });
    
    // 根据主题设置页面样式
    this.updateTheme();
    
    // 准备图表数据
    this.prepareChartData();
  },
  
  onShow: function() {
    // 每次显示页面时刷新技能数据、主题和图表
    const app = getApp();
    this.setData({
      skills: app.globalData.skills,
      darkMode: app.globalData.darkMode
    });
    this.updateTheme();
    this.prepareChartData();
    
    // 延迟重绘图表，确保DOM已更新
    setTimeout(() => {
      this.renderCharts();
    }, 100);
  },
  
  // 更新页面主题
  updateTheme: function() {
    const app = getApp();
    
    // 重新获取并应用全局样式变量，触发样式更新
    if (app.globalData.darkMode) {
      this.setData({
        theme: 'dark',
        // 显式设置深色模式的变量值，确保样式正确应用
        darkModeClass: 'dark-mode'
      });
      wx.setBackgroundColor({ backgroundColor: '#1a1a1a' });
    } else {
      this.setData({
        theme: 'light',
        darkModeClass: ''
      });
      wx.setBackgroundColor({ backgroundColor: '#f8f8f8' });
    }
    
    // 强制重新渲染页面
    this.setData({ renderTrigger: Math.random() });
  },
  
  // 准备图表数据
  prepareChartData: function() {
    const { skills, darkMode } = this.data;
    const app = getApp();
    
    if (skills.length === 0) {
      return;
    }
    
    // 准备饼图数据
    const pieLabels = skills.map(skill => skill.name);
    const pieData = skills.map(skill => skill.hoursPracticed);
    
    // 设置饼图颜色
    const pieColors = darkMode ? [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)'
    ] : [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)'
    ];
    
    // 准备柱状图数据
    const barLabels = skills.map(skill => skill.name);
    const barData = skills.map(skill => {
      if (skill.targetHours === 0) return 0;
      return Number(((skill.hoursPracticed / skill.targetHours) * 100).toFixed(2));
    });
    
    this.setData({
      pieChartData: {
        labels: pieLabels,
        datasets: [{ data: pieData, backgroundColor: pieColors }]
      },
      barChartData: {
        labels: barLabels,
        datasets: [{ 
          label: '已练习进度', 
          data: barData, 
          backgroundColor: darkMode ? 'rgba(97, 218, 251, 0.7)' : 'rgba(54, 162, 235, 0.7)'
        }]
      }
    });
  },
  
  // 渲染图表（在实际使用中，这里会初始化ec-canvas实例）
  renderCharts: function() {
    // 渲染饼图
    initPieChart('pieCanvas', this.data.pieChartData, this.data.darkMode);
    
    // 渲染柱状图
    initBarChart('barCanvas', this.data.barChartData, this.data.darkMode);
  }
});