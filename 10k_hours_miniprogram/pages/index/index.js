// index.js - 重新设计
Page({
  data: {
    darkMode: false,
    darkModeClass: '',
    // 问候语
    greeting: '',
    // 统计数据
    hasSkills: true,
    totalSkills: 3,
    totalHours: 128,
    streakDays: 15,
    // 今日目标
    todayHours: 1.5,
    dailyGoal: 2,
    goalProgressPercentage: 75,
    // 最近活动
    recentActivities: [],
    // 激励语录
    motivationalQuote: ''
  },
  
  // 激励语录数组
  motivationalQuotes: [
    '每天进步一点点，时间会给你惊喜。',
    '刻意练习是通往卓越的必经之路。',
    '坚持比天赋更重要，10000小时的专注练习能让你成为专家。',
    '不要害怕失败，害怕的是没有开始。',
    '成功的秘诀就是每天重复做简单的事情。',
    '练习不是为了完美，而是为了进步。',
    '耐心是智慧的开始，坚持是成功的基石。',
    '今天的努力，明天的实力。'
  ],
  
  onLoad: function() {
    // 获取全局应用实例
    const app = getApp();
    
    // 设置初始主题
    this.setData({
      darkMode: app.globalData.darkMode
    });
    
    // 初始化页面数据
    this.initPageData();
    
    // 根据主题设置页面样式
    this.updateTheme();
  },
  
  onShow: function() {
    // 每次显示页面时检查主题是否变化
    const app = getApp();
    
    // 如果主题变化，更新状态
    if (this.data.darkMode !== app.globalData.darkMode) {
      this.setData({
        darkMode: app.globalData.darkMode
      });
      this.updateTheme();
    }
    
    // 刷新页面数据
    this.updatePageData();
  },
  
  // 初始化页面数据
  initPageData: function() {
    // 设置问候语
    this.setGreeting();
    
    // 设置最近活动数据
    this.setRecentActivities();
    
    // 设置随机激励语录
    this.setRandomMotivationalQuote();
    
    // 计算目标进度百分比
    this.calculateGoalProgress();
  },
  
  // 更新页面数据
  updatePageData: function() {
    // 这里可以添加从全局数据或存储中获取最新数据的逻辑
    // 目前使用模拟数据
    const app = getApp();
    
    // 模拟从全局数据获取技能数量
    const skillsCount = app.globalData.skills ? app.globalData.skills.length : 3;
    
    this.setData({
      hasSkills: skillsCount > 0,
      totalSkills: skillsCount,
      // 重新设置随机激励语录（可选）
      motivationalQuote: this.getRandomQuote()
    });
  },
  
  // 设置问候语
  setGreeting: function() {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour >= 5 && hour < 12) {
      greeting = '早上好';
    } else if (hour >= 12 && hour < 18) {
      greeting = '下午好';
    } else if (hour >= 18 && hour < 22) {
      greeting = '晚上好';
    } else {
      greeting = '夜深了';
    }
    
    this.setData({ greeting });
  },
  
  // 设置最近活动数据
  setRecentActivities: function() {
    // 模拟最近活动数据
    const activities = [
      {
        icon: '💻',
        text: '记录了编程练习 1.5 小时',
        time: '今天 14:30'
      },
      {
        icon: '🎸',
        text: '练习吉他 45 分钟',
        time: '昨天 20:15'
      },
      {
        icon: '📚',
        text: '学习英语 1 小时',
        time: '昨天 08:45'
      }
    ];
    
    this.setData({ recentActivities: activities });
  },
  
  // 获取随机激励语录
  getRandomQuote: function() {
    const randomIndex = Math.floor(Math.random() * this.motivationalQuotes.length);
    return this.motivationalQuotes[randomIndex];
  },
  
  // 设置随机激励语录
  setRandomMotivationalQuote: function() {
    const quote = this.getRandomQuote();
    this.setData({ motivationalQuote: quote });
  },
  
  // 计算目标进度百分比
  calculateGoalProgress: function() {
    const { todayHours, dailyGoal } = this.data;
    const percentage = Math.min(Math.round((todayHours / dailyGoal) * 100), 100);
    
    this.setData({ goalProgressPercentage: percentage });
  },
  
  // 切换深色模式
  toggleDarkMode: function() {
    const app = getApp();
    app.toggleDarkMode();
    
    this.setData({
      darkMode: app.globalData.darkMode
    });
    
    // 添加切换动画反馈
    this.themeToggleAnimation();
    this.updateTheme();
  },
  
  // 主题切换动画
  themeToggleAnimation: function() {
    // 创建动画实例
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    });
    
    // 执行缩放动画
    animation.scale(1.1).step();
    animation.scale(1).step();
    
    // 这里可以根据需要应用动画到元素
  },
  
  // 更新页面主题
  updateTheme: function() {
    const app = getApp();
    
    // 设置深色模式类
    if (app.globalData.darkMode) {
      this.setData({
        darkModeClass: 'dark-mode'
      });
      wx.setBackgroundColor({ backgroundColor: '#344e41', animation: true });
    } else {
      this.setData({
        darkModeClass: ''
      });
      wx.setBackgroundColor({ backgroundColor: '#dad7cd', animation: true });
    }
    
    // 强制重新渲染页面
    this.setData({ renderTrigger: Math.random() });
  },
  
  // 跳转到添加技能页面
  navigateToAddSkill: function() {
    wx.switchTab({
      url: '/pages/addSkill/addSkill',
      success: function() {
        console.log('跳转到添加技能页面成功');
      },
      fail: function(err) {
        console.error('跳转到添加技能页面失败:', err);
        wx.showToast({
          title: '导航失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  
  // 跳转到记录练习页面
  navigateToRecordPractice: function() {
    wx.navigateTo({
      url: '/pages/recordPractice/recordPractice',
      success: function() {
        console.log('跳转到记录练习页面成功');
      },
      fail: function(err) {
        console.error('跳转到记录练习页面失败:', err);
        wx.showToast({
          title: '导航失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  
  // 跳转到我的技能页面
  navigateToSkillList: function() {
    wx.switchTab({
      url: '/pages/skillList/skillList',
      success: function() {
        console.log('跳转到我的技能页面成功');
      },
      fail: function(err) {
        console.error('跳转到我的技能页面失败:', err);
        wx.showToast({
          title: '导航失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  
  // 跳转到数据统计页面（tabBar页面需使用switchTab）
  navigateToStatistics: function() {
    wx.switchTab({
      url: '/pages/skillProgress/skillProgress',
      fail: function(err) {
        console.error('跳转到数据统计页面失败:', err);
        wx.showToast({
          title: '导航失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  
  // 刷新页面数据
  refreshPage: function() {
    // 显示刷新动画（可选）
    wx.showLoading({
      title: '刷新中...',
    });
    
    // 更新页面数据
    setTimeout(() => {
      this.updatePageData();
      wx.hideLoading();
      
      // 显示刷新成功提示
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500
      });
    }, 500);
  }
});