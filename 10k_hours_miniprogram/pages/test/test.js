// test.js
Page({
  data: {
    skills: [],
    testSkillName: '测试技能',
    debugInfo: ''
  },
  
  onLoad: function() {
    console.log('测试页面加载成功');
    this.refreshData();
    this.log('测试页面已加载');
  },
  
  onShow: function() {
    this.refreshData();
    this.log('页面显示，数据已刷新');
  },
  
  // 刷新数据
  refreshData: function() {
    const app = getApp();
    this.setData({
      skills: app.globalData.skills
    });
    this.log('从全局数据刷新技能列表，数量: ' + this.data.skills.length);
  },
  
  // 从存储加载数据
  loadData: function() {
    const savedSkills = wx.getStorageSync('skills');
    const app = getApp();
    
    if (savedSkills) {
      try {
        const skills = JSON.parse(savedSkills);
        app.globalData.skills = skills;
        this.setData({
          skills: skills
        });
        this.log('成功从存储加载数据，数量: ' + skills.length);
        this.log('数据内容: ' + JSON.stringify(skills));
        
        wx.showToast({
          title: '数据加载成功',
          icon: 'success'
        });
      } catch (e) {
        this.log('解析数据失败: ' + e.message);
        wx.showToast({
          title: '数据解析失败',
          icon: 'error'
        });
      }
    } else {
      this.log('存储中没有数据');
      wx.showToast({
        title: '存储中没有数据',
        icon: 'none'
      });
    }
  },
  
  // 保存数据到存储
  saveData: function() {
    const app = getApp();
    try {
      wx.setStorageSync('skills', JSON.stringify(app.globalData.skills));
      this.log('成功保存数据到存储，数量: ' + app.globalData.skills.length);
      wx.showToast({
        title: '数据保存成功',
        icon: 'success'
      });
    } catch (e) {
      this.log('保存数据失败: ' + e.message);
      wx.showToast({
        title: '数据保存失败',
        icon: 'error'
      });
    }
  },
  
  // 清除所有数据
  clearData: function() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有技能数据吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          app.globalData.skills = [];
          wx.removeStorageSync('skills');
          this.setData({
            skills: []
          });
          this.log('已清除所有数据');
          wx.showToast({
            title: '数据已清除',
            icon: 'success'
          });
        }
      }
    });
  },
  
  // 输入技能名称
  onSkillNameInput: function(e) {
    this.setData({
      testSkillName: e.detail.value
    });
  },
  
  // 添加测试技能
  addTestSkill: function() {
    const { testSkillName } = this.data;
    if (!testSkillName.trim()) {
      wx.showToast({
        title: '技能名称不能为空',
        icon: 'none'
      });
      return;
    }
    
    const app = getApp();
    
    // 创建测试技能
    const newSkill = {
      id: Date.now(),
      name: testSkillName,
      hoursPracticed: 0,
      targetHours: 10000,
      createdAt: new Date().toISOString()
    };
    
    // 添加到全局数据
    app.globalData.skills = [...app.globalData.skills, newSkill];
    
    // 更新页面数据
    this.setData({
      skills: app.globalData.skills
    });
    
    this.log('已添加测试技能: ' + testSkillName);
    this.log('当前技能总数: ' + this.data.skills.length);
    
    wx.showToast({
      title: '技能添加成功',
      icon: 'success'
    });
  },
  
  // 记录日志
  log: function(message) {
    console.log('[测试页面]', message);
    // 限制日志长度，避免溢出
    let newDebugInfo = this.data.debugInfo + '\n' + new Date().toLocaleTimeString() + ': ' + message;
    if (newDebugInfo.length > 2000) {
      newDebugInfo = newDebugInfo.substring(newDebugInfo.length - 2000);
    }
    this.setData({
      debugInfo: newDebugInfo
    });
  }
});