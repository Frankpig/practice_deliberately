// addSkill.js - 现代化添加技能页面逻辑
const app = getApp();

Page({
  data: {
    skillName: '',
    targetHours: 10000,
    error: '',
    darkMode: false,
    darkModeClass: '',
    submitting: false, // 防止重复提交
    showSuccessToast: false // 自定义成功提示
  },

  onLoad: function(options) {
    // 页面加载时初始化数据和主题
    this.initPage();
    console.log('添加技能页面已加载');
  },

  onShow: function() {
    // 每次页面显示时更新主题
    this.updateTheme();
    console.log('添加技能页面已显示');
  },

  /**
   * 初始化页面数据
   */
  initPage: function() {
    this.setData({
      darkMode: app.globalData.darkMode || false,
      darkModeClass: app.globalData.darkMode ? 'dark-mode' : '',
      skillName: '',
      targetHours: 10000,
      error: ''
    });
    
    console.log('页面初始化完成，主题模式:', this.data.darkMode ? '深色' : '浅色');
  },

  /**
   * 更新页面主题
   */
  updateTheme: function() {
    const darkMode = app.globalData.darkMode || false;
    
    if (darkMode !== this.data.darkMode) {
      console.log('更新页面主题:', darkMode ? '深色模式' : '浅色模式');
      
      this.setData({
        darkMode: darkMode,
        darkModeClass: darkMode ? 'dark-mode' : ''
      });
      
      // 根据主题设置背景色
      wx.setBackgroundColor({
        backgroundColor: darkMode ? '#1a1a1a' : '#f8f8f8'
      });
    }
  },

  /**
   * 处理技能名称输入
   */
  onSkillNameInput: function(e) {
    const value = e.detail.value;
    
    // 实时清除错误信息
    if (this.data.error) {
      this.setData({ error: '' });
    }
    
    this.setData({ skillName: value });
  },

  /**
   * 处理目标小时数输入
   */
  onTargetHoursInput: function(e) {
    let value = e.detail.value;
    
    // 输入验证和格式化
    if (value) {
      // 只允许输入数字
      value = value.replace(/[^0-9]/g, '');
      
      // 转换为整数
      value = parseInt(value) || 10000;
      
      // 限制最大值
      if (value > 99999) {
        value = 99999;
      }
    } else {
      value = 10000;
    }
    
    // 实时清除错误信息
    if (this.data.error) {
      this.setData({ error: '' });
    }
    
    this.setData({ targetHours: value });
  },

  /**
   * 验证表单数据
   */
  validateForm: function() {
    const { skillName, targetHours } = this.data;
    
    // 验证技能名称
    const trimmedSkillName = skillName.trim();
    if (!trimmedSkillName) {
      this.setData({ error: '请输入技能名称' });
      return false;
    }
    
    // 验证技能名称长度
    if (trimmedSkillName.length > 20) {
      this.setData({ error: '技能名称不能超过20个字符' });
      return false;
    }
    
    // 验证目标小时数
    if (!targetHours || targetHours <= 0) {
      this.setData({ error: '请输入有效的目标小时数' });
      return false;
    }
    
    // 验证是否存在相同技能
    if (this.isSkillExists(trimmedSkillName)) {
      this.setData({ error: '已存在相同名称的技能' });
      return false;
    }
    
    return true;
  },

  /**
   * 检查技能是否已存在
   */
  isSkillExists: function(skillName) {
    const trimmedSkillName = skillName.trim().toLowerCase();
    
    if (!Array.isArray(app.globalData.skills)) {
      return false;
    }
    
    return app.globalData.skills.some(skill => 
      skill.name.toLowerCase() === trimmedSkillName
    );
  },

  /**
   * 创建新技能对象
   */
  createNewSkill: function() {
    return {
      id: Date.now(),
      name: this.data.skillName.trim(),
      hoursPracticed: 0,
      targetHours: this.data.targetHours,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * 保存技能到全局数据和本地存储
   */
  saveSkill: function(newSkill) {
    // 初始化全局技能数组（如果不存在）
    if (!Array.isArray(app.globalData.skills)) {
      app.globalData.skills = [];
    }
    
    // 创建新的技能数组，确保更新引用
    const updatedSkills = [...app.globalData.skills, newSkill];
    
    // 更新全局数据
    app.globalData.skills = updatedSkills;
    
    // 保存到本地存储
    try {
      wx.setStorageSync('skills', JSON.stringify(updatedSkills));
      console.log('技能数据已成功保存到本地存储');
      return true;
    } catch (error) {
      console.error('保存技能数据到本地存储失败:', error);
      return false;
    }
  },

  /**
   * 显示成功提示并跳转页面
   */
  showSuccessAndRedirect: function() {
    wx.showToast({
      title: '技能添加成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        // 重置表单
        this.setData({
          skillName: '',
          targetHours: 10000,
          error: ''
        });
        
        // 延迟跳转，确保用户看到成功提示
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/skillList/skillList',
            success: () => {
              console.log('成功跳转到技能列表页面');
            },
            fail: (error) => {
              console.error('页面跳转失败:', error);
            }
          });
        }, 1000);
      }
    });
  },

  /**
   * 表单提交处理
   */
  handleSubmit: function() {
    // 防止重复提交
    if (this.data.submitting) {
      return;
    }
    
    this.setData({ submitting: true });
    
    try {
      console.log('开始处理表单提交');
      
      // 验证表单
      if (!this.validateForm()) {
        console.log('表单验证失败');
        return;
      }
      
      // 创建新技能对象
      const newSkill = this.createNewSkill();
      console.log('创建新技能:', newSkill);
      
      // 保存技能
      if (!this.saveSkill(newSkill)) {
        console.error('保存技能失败');
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'error'
        });
        return;
      }
      
      // 显示成功提示并跳转
      this.showSuccessAndRedirect();
      
    } catch (error) {
      console.error('添加技能过程中发生错误:', error);
      wx.showToast({
        title: '添加失败，请重试',
        icon: 'error'
      });
    } finally {
      // 重置提交状态
      setTimeout(() => {
        this.setData({ submitting: false });
      }, 500);
    }
  }
});