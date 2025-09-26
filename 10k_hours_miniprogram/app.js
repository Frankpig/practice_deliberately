// app.js
App({
  onLaunch: function() {
    console.log('App启动开始');
    
    // 初始化全局数据
    this.globalData.skills = [];
    this.globalData.darkMode = false;
    console.log('全局数据已初始化');
    
    // 从本地存储加载技能数据
    const savedSkills = wx.getStorageSync('skills');
    console.log('从本地存储读取技能数据:', savedSkills ? '有数据' : '无数据');
    
    // 如果没有保存的技能数据，提供一些示例数据
    if (savedSkills) {
      try {
        // 检查savedSkills是否已经是对象
        if (typeof savedSkills === 'object') {
          this.globalData.skills = savedSkills;
          console.log('直接使用对象格式的技能数据，数量:', this.globalData.skills.length);
        } else {
          // 如果是字符串，则进行解析
          this.globalData.skills = JSON.parse(savedSkills);
          console.log('成功解析并加载技能数据，数量:', this.globalData.skills.length);
        }
      } catch (e) {
        console.error('解析技能数据失败:', e);
        // 提供默认数据
        this.globalData.skills = [];
      }
    } else {
      console.log('没有保存的技能数据，提供示例数据');
      // 添加示例技能数据
      this.globalData.skills = [
        {
          id: Date.now() + 1,
          name: 'Python编程',
          hoursPracticed: 320,
          targetHours: 10000,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: Date.now() + 2,
          name: '吉他演奏',
          hoursPracticed: 650,
          targetHours: 10000,
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: Date.now() + 3,
          name: '英语口语',
          hoursPracticed: 2340,
          targetHours: 10000,
          createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      // 保存示例数据到本地存储
      wx.setStorageSync('skills', JSON.stringify(this.globalData.skills));
      console.log('已保存示例数据到本地存储');
    }
    
    // 从本地存储加载主题偏好
    const savedTheme = wx.getStorageSync('darkMode');
    this.globalData.darkMode = savedTheme ? JSON.parse(savedTheme) : false;
    console.log('主题设置已加载:', this.globalData.darkMode ? '深色模式' : '浅色模式');
    
    console.log('App启动完成，当前技能数量:', this.globalData.skills.length);
  },
  
  // 全局数据
  globalData: {
    skills: [],
    darkMode: false
  },
  
  // 清除所有本地存储数据（用于调试）
  clearAllData: function() {
    console.log('清除所有本地存储数据');
    wx.removeStorageSync('skills');
    wx.removeStorageSync('darkMode');
    this.globalData.skills = [];
    this.globalData.darkMode = false;
    console.log('本地存储已清空，全局数据已重置');
  },
  
  // 添加新技能
  addSkill: function(skillName, targetHours = 10000) {
    console.log('===== 全局添加技能开始 [DEBUG] =====');
    console.log('当前时间戳:', Date.now());
    console.log('添加技能参数:', { skillName, targetHours });
    
    // 参数验证
    if (!skillName || typeof skillName !== 'string' || skillName.trim() === '') {
      console.error('技能名称无效:', skillName);
      return false;
    }
    
    let numericTargetHours = parseFloat(targetHours) || 10000;
    if (numericTargetHours <= 0) {
      console.warn('目标小时数无效，使用默认值10000:', targetHours);
      numericTargetHours = 10000;
    }
    
    console.log('技能名称类型:', typeof skillName);
    console.log('目标小时数类型:', typeof numericTargetHours);
    
    const newSkill = {
      id: Date.now(),
      name: skillName.trim(),
      hoursPracticed: 0,
      targetHours: numericTargetHours,
      createdAt: new Date().toISOString()
    };
    
    console.log('创建新技能对象:', newSkill);
    console.log('新技能对象JSON序列化结果:', JSON.stringify(newSkill));
    
    // 记录更新前的全局数据状态
    console.log('更新前全局技能数据类型:', Array.isArray(this.globalData.skills) ? '数组' : typeof this.globalData.skills);
    console.log('更新前全局技能数量:', Array.isArray(this.globalData.skills) ? this.globalData.skills.length : 'N/A');
    
    // 更新全局数据
    if (!Array.isArray(this.globalData.skills)) {
      console.warn('全局技能数据不是数组，重新初始化为空数组');
      this.globalData.skills = [];
    }
    
    this.globalData.skills = [...this.globalData.skills, newSkill];
    
    // 记录更新后的全局数据状态
    console.log('更新后全局技能数量:', this.globalData.skills.length);
    console.log('更新后全局技能列表完整内容:', this.globalData.skills);
    
    // 保存到本地存储
    try {
      const skillsStr = JSON.stringify(this.globalData.skills);
      console.log('准备存储的数据长度:', skillsStr.length);
      const storageResult = wx.setStorageSync('skills', skillsStr);
      console.log('存储操作返回结果:', storageResult);
      
      // 立即验证存储结果
      const savedData = wx.getStorageSync('skills');
      console.log('存储验证 - 数据存在:', !!savedData);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('存储验证 - 解析后技能数量:', parsedData.length);
      }
      return true;
    } catch (e) {
      console.error('存储数据失败:', e);
      console.error('存储失败详细错误:', e.stack);
      return false;
    } finally {
      console.log('===== 全局添加技能结束 [DEBUG] =====');
    }
  },
  
  // 记录练习时间
  recordPractice: function(skillId, hours) {
    console.log('记录练习时间开始:', { skillId, hours });
    
    // 参数验证
    const numericSkillId = parseInt(skillId) || 0;
    const numericHours = parseFloat(hours) || 0;
    
    if (numericHours <= 0) {
      console.warn('练习小时数必须大于0:', hours);
      return;
    }
    
    // 确保skills是数组
    if (!Array.isArray(this.globalData.skills)) {
      console.warn('技能数据不是数组，初始化为空数组');
      this.globalData.skills = [];
    }
    
    this.globalData.skills = this.globalData.skills.map(skill => {
      if (skill.id === numericSkillId) {
        // 确保hoursPracticed是数字
        const currentHours = parseFloat(skill.hoursPracticed) || 0;
        return { ...skill, hoursPracticed: currentHours + numericHours };
      }
      return skill;
    });
    
    // 保存到本地存储
    try {
      wx.setStorageSync('skills', JSON.stringify(this.globalData.skills));
      console.log('练习时间记录成功并保存到本地存储');
    } catch (e) {
      console.error('保存练习时间失败:', e);
    }
  },
  
  // 切换深色模式
  toggleDarkMode: function() {
    this.globalData.darkMode = !this.globalData.darkMode;
    wx.setStorageSync('darkMode', JSON.stringify(this.globalData.darkMode));
  },
  
  // 获取技能阶段
  getSkillStage: function(hoursPracticed) {
    // 确保参数是有效的数字
    const hours = parseFloat(hoursPracticed) || 0;
    
    if (hours < 500) return '新手阶段';
    if (hours < 2000) return '进阶阶段';
    if (hours < 5000) return '熟练阶段';
    if (hours < 10000) return '专家阶段';
    return '大师阶段';
  },
  
  // 获取技能进度百分比，返回两位小数格式
  getSkillProgress: function(hoursPracticed, targetHours) {
    // 确保参数是有效的数字
    const hours = parseFloat(hoursPracticed) || 0;
    const target = parseFloat(targetHours) || 1;
    
    // 计算进度百分比并保留两位小数
    const progress = Math.min((hours / target) * 100, 100);
    return progress.toFixed(2);
  }
});