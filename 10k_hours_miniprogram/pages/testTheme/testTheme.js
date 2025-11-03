// 主题测试页面
Page({
  data: {
    darkMode: false
  },

  onLoad: function() {
    // 获取全局应用实例
    this.app = getApp();
    // 同步当前主题状态
    this.setData({
      darkMode: this.app.globalData.darkMode
    });
    // 设置页面背景色
    wx.setBackgroundColor({
      backgroundColor: this.app.globalData.darkMode ? '#344e41' : '#dad7cd'
    });
  },

  onShow: function() {
    // 每次页面显示时检查主题是否变化
    if (this.app && this.data.darkMode !== this.app.globalData.darkMode) {
      this.setData({
        darkMode: this.app.globalData.darkMode
      });
      wx.setBackgroundColor({
        backgroundColor: this.app.globalData.darkMode ? '#344e41' : '#dad7cd'
      });
    }
  },

  // 切换主题模式
  toggleTheme: function() {
    // 调用全局方法切换主题
    if (this.app && typeof this.app.toggleDarkMode === 'function') {
      this.app.toggleDarkMode();
      
      // 更新本地状态
      const newDarkMode = this.app.globalData.darkMode;
      this.setData({
        darkMode: newDarkMode
      });
      
      // 更新页面背景色
      wx.setBackgroundColor({
        backgroundColor: newDarkMode ? '#344e41' : '#dad7cd'
      });
      
      // 显示提示
      wx.showToast({
        title: newDarkMode ? '已切换到深色模式' : '已切换到浅色模式',
        icon: 'success',
        duration: 1500
      });
    } else {
      console.error('无法切换主题，全局方法不存在');
    }
  },

  // 跳转到技能列表页面
  goToSkillList: function() {
    wx.navigateTo({
      url: '/pages/skillList/skillList'
    });
  },

  // 跳转到添加技能页面
  goToAddSkill: function() {
    wx.navigateTo({
      url: '/pages/addSkill/addSkill'
    });
  }
});