// skillList.js
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
      }
    ]
  },
  
  onLoad: function() {
    // 获取全局应用实例
    const app = getApp();
    
    // 设置初始主题和技能数据
    let skillsData = app.globalData.skills || [];
    
    // 如果没有技能数据，使用默认模拟数据
    if (skillsData.length === 0) {
      skillsData = this.data.defaultSkills;
    }
    
    // 为每个技能预先计算并添加百分比
    const skillsWithPercentage = skillsData.map(skill => {
      const hours = parseFloat(skill.hoursPracticed) || 0;
      const target = parseFloat(skill.targetHours) || 10000;
      const percentage = ((hours / target) * 100).toFixed(2);
      
      return {
        ...skill,
        progressPercentage: percentage // 预先计算好的百分比
      };
    });
    
    this.setData({
      skills: skillsWithPercentage,
      darkMode: app.globalData.darkMode
    });
    
    // 根据主题设置页面样式
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
  
  // 获取技能阶段
  getSkillStage: function(hoursPracticed) {
    const app = getApp();
    return app.getSkillStage(hoursPracticed);
  },
  
  // 获取技能进度百分比（用于进度条宽度）
  getSkillProgress: function(hoursPracticed, targetHours) {
    // 先验证并确保参数是数字
    const hours = parseFloat(hoursPracticed) || 0;
    const target = parseFloat(targetHours) || 10000; // 使用默认目标小时数
    
    // 防止除以0
    if (target <= 0) {
      target = 10000;
    }
    
    // 直接计算进度百分比
    return Math.min((hours / target) * 100, 100);
  },

  // 在onShow中添加调试日志和防御性代码
  onShow: function() {
    // 每次显示页面时刷新技能数据和主题
    const app = getApp();
    
    // 获取技能数据并确保其格式正确
    let skillsData = app.globalData.skills || [];
    
    // 如果没有技能数据或数据格式不正确，使用默认数据
    if (!Array.isArray(skillsData) || skillsData.length === 0) {
      console.log('使用默认技能数据，因为全局数据为空或格式不正确');
      skillsData = this.data.defaultSkills;
    } else {
      // 检查并修复每个技能项的字段
      skillsData = skillsData.map(skill => {
        // 确保必要字段存在且类型正确
        return {
          ...skill,
          hoursPracticed: parseFloat(skill.hoursPracticed) || 0,
          targetHours: parseFloat(skill.targetHours) || 10000,
          name: skill.name || '未命名技能'
        };
      });
    }
    
    // 为每个技能预先计算并添加百分比
    const skillsWithPercentage = skillsData.map(skill => {
      const hours = parseFloat(skill.hoursPracticed) || 0;
      const target = parseFloat(skill.targetHours) || 10000;
      const percentage = ((hours / target) * 100).toFixed(2);
      
      return {
        ...skill,
        progressPercentage: percentage // 预先计算好的百分比
      };
    });
    
    this.setData({
      skills: skillsWithPercentage,
      darkMode: app.globalData.darkMode
    });
    
    this.updateTheme();
  },
  

  
  // 重置技能数据到示例数据
  onResetSkills: function() {
    try {
      // 弹出确认对话框
      wx.showModal({
        title: '确认重置',
        content: '确定要重置所有技能数据吗？这将恢复为示例数据，当前数据将丢失。',
        success: (res) => {
          if (res.confirm) {
            // 获取全局应用实例
            const app = getApp();
            
            // 清除本地存储中的技能数据
            wx.removeStorageSync('skills');
            
            // 添加示例技能数据
            app.globalData.skills = [];
            app.addSkill('编程', 10000);
            app.addSkill('吉他', 10000);
            app.addSkill('绘画', 10000);
            
            // 更新页面数据
            this.setData({
              skills: app.globalData.skills
            });
            
            // 显示成功提示
            wx.showToast({
              title: '技能数据已重置',
              icon: 'success'
            });
          }
        }
      });
    } catch (error) {
      wx.showToast({
        title: '重置失败',
        icon: 'none'
      });
    }
  }
});