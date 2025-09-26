// index.js
Page({
  data: {
    darkMode: false,
    welcomeMessage: '欢迎使用刻意练习',
    introText: '记录你的技能练习时间，追踪10000小时定律进度'
  },
  
  onLoad: function() {
    // 获取全局应用实例
    const app = getApp();
    // 设置初始主题
    this.setData({
      darkMode: app.globalData.darkMode
    });
    
    // 根据主题设置页面样式
    this.updateTheme();
  },
  
  onShow: function() {
    // 每次显示页面时检查主题是否变化
    const app = getApp();
    this.setData({
      darkMode: app.globalData.darkMode
    });
    this.updateTheme();
  },
  
  // 切换深色模式
  toggleDarkMode: function() {
    const app = getApp();
    app.toggleDarkMode();
    this.setData({
      darkMode: app.globalData.darkMode
    });
    this.updateTheme();
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
  
  // 跳转到技能进度页面
  navigateToSkillProgress: function() {
    wx.switchTab({
      url: '/pages/skillProgress/skillProgress',
      success: function() {
        console.log('跳转到技能进度页面成功');
      },
      fail: function(err) {
        console.error('跳转到技能进度页面失败:', err);
        wx.showToast({
          title: '导航失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  
  // 清除所有数据（调试用）
  clearAllData: function() {
    wx.showModal({
      title: '确认清除',
      content: '此操作将清除所有数据并重置应用，是否继续？',
      success: function(res) {
        if (res.confirm) {
          const app = getApp();
          app.clearAllData();
          
          wx.showToast({
            title: '数据已清除',
            icon: 'success',
            duration: 2000
          });
          
          // 重新加载页面数据
          this.onShow();
        }
      }.bind(this)
    });
  },
  
  // 跳转到数据测试页面
  gotoTestPage: function() {
    wx.navigateTo({
      url: '/pages/test/test',
      success: function() {
        console.log('跳转到测试页面成功');
      },
      fail: function(err) {
        console.error('跳转到测试页面失败:', err);
      }
    });
  },
  
  // 跳转到导航测试页面
  gotoNavTestPage: function() {
    wx.navigateTo({
      url: '/pages/navTest/navTest',
      success: function() {
        console.log('跳转到导航测试页面成功');
      },
      fail: function(err) {
        console.error('跳转到导航测试页面失败:', err);
      }
    });
  }
});