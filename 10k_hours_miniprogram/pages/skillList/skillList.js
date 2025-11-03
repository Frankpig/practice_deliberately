// 技能列表页面 - 重制版
Page({
  data: {
    skills: [],
    darkMode: false,
    // 默认的模拟技能数据，防止页面空白
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
    ]
  },
  
  // 页面加载
  onLoad: function() {
    this.app = getApp();
    this.loadSkillsData();
    this.updateTheme();
  },
  
  // 页面显示（每次进入页面都会执行）
  onShow: function() {
    if (!this.app) {
      this.app = getApp();
    }
    
    // 检查主题是否发生变化
    if (this.data.darkMode !== this.app.globalData.darkMode) {
      this.updateTheme();
    }
    
    // 重新加载技能数据
    this.loadSkillsData();
  },
  
  // 加载并处理技能数据
  loadSkillsData: function() {
    try {
      let skillsData = this.app.globalData.skills || [];
      
      // 如果没有技能数据，使用默认模拟数据
      if (!Array.isArray(skillsData) || skillsData.length === 0) {
        skillsData = this.data.defaultSkills;
        // 如果使用默认数据，也更新到全局
        this.app.globalData.skills = skillsData;
        wx.setStorageSync('skills', skillsData);
      } else {
        // 数据校验和清洗
        skillsData = skillsData.map(skill => {
          return {
            ...skill,
            hoursPracticed: parseFloat(skill.hoursPracticed) || 0,
            targetHours: parseFloat(skill.targetHours) || 10000,
            name: skill.name || '未命名技能',
            id: skill.id || Date.now() + Math.random() // 确保有ID
          };
        });
      }
      
      // 处理技能数据（添加百分比、阶段等）
      const processedSkills = this.processSkillsData(skillsData);
      
      // 更新数据并添加加载动画效果
      this.setData({
        skills: processedSkills
      });
    } catch (error) {
      console.error('加载技能数据失败:', error);
      // 加载失败时使用默认数据
      this.setData({
        skills: this.processSkillsData(this.data.defaultSkills)
      });
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      });
    }
  },
  
  // 处理技能数据，添加计算字段
  processSkillsData: function(skills) {
    return skills.map(skill => {
      const hours = parseFloat(skill.hoursPracticed) || 0;
      const target = parseFloat(skill.targetHours) || 10000;
      
      // 计算进度百分比
      const percentage = Math.min((hours / target) * 100, 100).toFixed(2);
      
      // 获取技能阶段
      let stage = '初学者';
      if (this.app && typeof this.app.getSkillStage === 'function') {
        stage = this.app.getSkillStage(hours);
      } else {
        // 如果全局方法不可用，使用本地计算
        if (hours >= 10000) stage = '大师';
        else if (hours >= 5000) stage = '专家';
        else if (hours >= 2000) stage = '熟练';
        else if (hours >= 1000) stage = '精通';
        else if (hours >= 500) stage = '进阶';
        else if (hours >= 100) stage = '中级';
      }
      
      return {
        ...skill,
        progressPercentage: percentage,
        stage: stage
      };
    });
  },
  
  // 更新页面主题
  updateTheme: function() {
    const isDarkMode = this.app.globalData.darkMode;
    
    this.setData({
      darkMode: isDarkMode,
      darkModeClass: isDarkMode ? 'dark-mode' : ''
    });
    
    // 设置页面背景色，与app.wxss中定义的颜色保持一致
    wx.setBackgroundColor({
      backgroundColor: isDarkMode ? '#344e41' : '#dad7cd'
    });
  },
  
  // 点击技能名称跳转到记录页面
  onSkillTap: function(e) {
    const { skillId, skillName } = e.currentTarget.dataset;
    
    wx.navigateTo({
      url: `/pages/recordPractice/recordPractice?skillId=${skillId}&skillName=${encodeURIComponent(skillName)}`
    });
  },
  
  // 删除技能功能
  onDeleteSkill: function(e) {
    try {
      const { skillId, skillName } = e.currentTarget.dataset;
      
      // 弹出确认对话框
      wx.showModal({
        title: '确认删除',
        content: `确定要删除"${skillName}"技能吗？删除后相关的练习记录也将被清除。`,
        showCancel: true,
        cancelText: '取消',
        confirmText: '删除',
        confirmColor: '#FF4D4F',
        success: (res) => {
          if (res.confirm) {
            // 删除操作
            this.performDeleteSkill(skillId, skillName);
          }
        }
      });
    } catch (error) {
      console.error('删除技能失败:', error);
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      });
    }
  },
  
  // 执行删除技能的操作
  performDeleteSkill: function(skillId, skillName) {
    // 更新全局数据
    const updatedSkills = this.app.globalData.skills.filter(skill => skill.id !== skillId);
    this.app.globalData.skills = updatedSkills;
    
    // 更新本地存储
    wx.setStorageSync('skills', updatedSkills);
    
    // 更新页面数据
    this.setData({
      skills: this.processSkillsData(updatedSkills)
    });
    
    // 显示成功提示
    wx.showToast({
      title: `已删除${skillName}`,
      icon: 'success',
      duration: 2000
    });
    
    // 添加删除动画效果（可选）
    // 这里可以通过CSS类切换实现更丰富的动画
  },
  
  // 计算预计完成时间
  calculateRemainingTime: function(practicedHours, targetHours) {
    try {
      const practiced = parseFloat(practicedHours) || 0;
      const target = parseFloat(targetHours) || 10000;
      
      // 如果已经完成目标
      if (practiced >= target) {
        return '🎉 已完成目标！';
      }
      
      const remaining = target - practiced;
      
      // 假设平均每天练习2小时
      const avgDailyHours = 2;
      const daysRemaining = Math.ceil(remaining / avgDailyHours);
      
      if (daysRemaining < 30) {
        return `${daysRemaining} 天`;
      } else if (daysRemaining < 365) {
        const months = Math.floor(daysRemaining / 30);
        const remainingDays = daysRemaining % 30;
        if (remainingDays === 0) {
          return `${months} 个月`;
        }
        return `${months} 个月 ${remainingDays} 天`;
      } else {
        const years = Math.floor(daysRemaining / 365);
        const remainingMonths = Math.floor((daysRemaining % 365) / 30);
        if (remainingMonths === 0) {
          return `${years} 年`;
        }
        return `${years} 年 ${remainingMonths} 个月`;
      }
    } catch (error) {
      return '计算中...';
    }
  }
});