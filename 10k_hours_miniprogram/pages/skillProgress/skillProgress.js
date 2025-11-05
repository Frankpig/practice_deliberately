// skillProgress.js
import { initPieChart, initBarChart } from '../../utils/chartUtils';

Page({
  data: {
    skills: [],
    darkMode: false,
    lastUpdateTime: '',
    // 默认的模拟技能数据，防止图表显示为空
    defaultSkills: [
      {
        id: 1,
        name: '编程',
        hoursPracticed: 320.5,
        targetHours: 10000,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: '吉他',
        hoursPracticed: 650.25,
        targetHours: 10000,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: '绘画',
        hoursPracticed: 150.75,
        targetHours: 10000,
        createdAt: new Date().toISOString()
      }
    ],
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
    console.log('skillProgress页面加载');
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
    console.log('skillProgress页面显示');
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
  
  // 格式化时间显示
  formatUpdateTime: function() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },
  
  // 准备图表数据
  prepareChartData: function() {
    const { skills, darkMode, defaultSkills } = this.data;
    const app = getApp();
    
    console.log('开始准备图表数据，技能数量:', skills.length);
    
    // 更新最后更新时间
    this.setData({
      lastUpdateTime: this.formatUpdateTime()
    });
    
    // 如果没有技能数据，使用默认模拟数据
    let skillsToUse = skills;
    if (skills.length === 0) {
      console.log('使用默认技能数据，因为全局数据为空');
      skillsToUse = defaultSkills;
    }
    
    // 准备饼图数据
    const pieLabels = skillsToUse.map(skill => skill.name);
    const pieData = skillsToUse.map(skill => skill.hoursPracticed);
    
    // 设置饼图颜色 - 使用指定的五种颜色
    const pieColors = [
      '#dad7cd',
      '#a3b18a',
      '#588157',
      '#3a5a40',
      '#344e41'
    ];
    
    // 准备柱状图数据
    const barLabels = skillsToUse.map(skill => skill.name);
    const barData = skillsToUse.map(skill => {
      if (skill.targetHours === 0) return 0;
      return Number(((skill.hoursPracticed / skill.targetHours) * 100).toFixed(2));
    });
    
    const pieChartData = {
      labels: pieLabels,
      datasets: [{ data: pieData, backgroundColor: pieColors }]
    };
    
    const barChartData = {
      labels: barLabels,
      datasets: [{ 
        label: '已练习进度', 
        data: barData, 
        backgroundColor: darkMode ? '#588157' : '#a3b18a'
      }]
    };
    
    console.log('饼图数据准备完成:', pieChartData);
    console.log('柱状图数据准备完成:', barChartData);
    
    this.setData({
      pieChartData: pieChartData,
      barChartData: barChartData
    });
    
    // 渲染图表
    wx.nextTick(() => {
      this.renderCharts();
    });
  },
  
  // 渲染图表（在实际使用中，这里会初始化ec-canvas实例）
  renderCharts: function() {
    console.log('开始渲染图表');
    
    // 保存当前页面实例，供initPieChart使用
    if (typeof this.pieChartRedraw === 'function') {
      console.log('饼图重绘方法已存在');
    }
    
    // 检查数据是否有效
    if (!this.data.pieChartData || !this.data.pieChartData.labels || this.data.pieChartData.labels.length === 0) {
      console.error('饼图数据无效');
    } else {
      console.log('饼图数据有效，标签数量：', this.data.pieChartData.labels.length);
      console.log('饼图标签：', this.data.pieChartData.labels);
      console.log('饼图数据：', this.data.pieChartData.datasets[0].data);
      // 渲染饼图
      try {
          // 保存饼图重绘方法
          this.pieChartRedraw = initPieChart('pieCanvas', this.data.pieChartData, this.data.darkMode, this);
          console.log('饼图渲染完成');
        } catch (error) {
          console.error('渲染饼图时出错:', error);
        }
    }
    
    if (!this.data.barChartData || !this.data.barChartData.labels || this.data.barChartData.labels.length === 0) {
      console.error('柱状图数据无效');
    } else {
      console.log('柱状图数据有效，标签数量：', this.data.barChartData.labels.length);
      console.log('柱状图标签列表：', this.data.barChartData.labels);
      console.log('柱状图数据：', this.data.barChartData.datasets[0].data);
      
      // 渲染柱状图
      // 使用nextTick确保DOM完全加载后再绘制
      wx.nextTick(() => {
        console.log('在nextTick中绘制柱状图');
        try {
          initBarChart('barCanvas', this.data.barChartData, this.data.darkMode);
          console.log('柱状图渲染完成');
        } catch (error) {
          console.error('绘制柱状图时出错:', error);
        }
      });
    }
  },
  
  // 处理饼图点击事件
  onChartTap: function(e) {
    console.log('饼图被点击', e);
    // 添加点击反馈
    wx.showToast({
      title: '点击了饼图',
      icon: 'none',
      duration: 1500
    });
  },
  
  // 处理饼图长按事件
  onChartLongPress: function(e) {
    console.log('饼图被长按', e);
    wx.showToast({
      title: '长按查看详情',
      icon: 'none',
      duration: 1500
    });
  },
  
  // 处理柱状图点击事件
  onBarChartTap: function(e) {
    console.log('柱状图被点击', e);
    wx.showToast({
      title: '点击了柱状图',
      icon: 'none',
      duration: 1500
    });
  }
});