// recordPractice.js - 重新设计
Page({
  data: {
    // 技能相关
    skills: [],
    selectedSkillId: '',
    selectedSkillIndex: '',
    selectedSkillName: '请选择技能',
    recentSkills: [], // 最近使用的技能
    
    // 时间选择相关
    practiceHours: 1, // 保留用于向后兼容
    selectedHours: 1,
    selectedMinutes: 0,
    
    // 练习笔记
    practiceNotes: '',
    
    // 最近活动
    recentActivities: [],
    
    // UI相关
    darkMode: false,
    darkModeClass: '',
    greeting: '', // 问候语
    motivationalTip: '', // 激励提示
    error: ''
  },
  
  onLoad: function(options) {
    // 获取全局应用实例
    const app = getApp();
    // 设置初始主题和技能数据
    this.setData({
      skills: app.globalData.skills || [],
      darkMode: app.globalData.darkMode || false
    });
    
    // 初始化页面数据
    this.initPageData();
    
    // 根据主题设置页面样式
    this.updateTheme();
    
    // 获取最近活动
    this.fetchRecentActivities();
    
    // 检查是否有从URL参数传递过来的技能信息
    if (options && options.skillId) {
      // 从URL参数获取技能ID和名称
      const skillId = options.skillId;
      const skillName = options.skillName ? decodeURIComponent(options.skillName) : '';
      
      // 查找该技能在技能列表中的索引
      const skillIndex = app.globalData.skills.findIndex(skill => skill.id === skillId);
      
      // 设置选中的技能
      this.setData({
        selectedSkillIndex: skillIndex >= 0 ? skillIndex : 0,
        selectedSkillId: skillId,
        selectedSkillName: skillName || '请选择技能'
      });
      
      console.log('onLoad - 从URL参数选择技能:', { id: skillId, name: skillName, index: skillIndex });
    } else if (app.globalData.skills && app.globalData.skills.length > 0) {
      // 如果没有传递参数，默认选择第一个技能
      const firstSkill = app.globalData.skills[0];
      
      this.setData({
        selectedSkillIndex: 0,
        selectedSkillId: firstSkill ? firstSkill.id : '',
        selectedSkillName: firstSkill ? firstSkill.name : '请选择技能'
      });
      
      console.log('onLoad - 默认选择第一个技能:', { index: 0, id: firstSkill ? firstSkill.id : '未找到' });
    }
    
    // 获取最近使用的技能
    this.fetchRecentSkills();
  },
  
  // 初始化页面数据
  initPageData: function() {
    this.updateGreeting();
    this.updateMotivationalTip();
  },
  
  // 更新问候语
  updateGreeting: function() {
    const hour = new Date().getHours();
    let greeting = '欢迎';
    
    if (hour < 6) {
      greeting = '夜深了';
    } else if (hour < 12) {
      greeting = '早上好';
    } else if (hour < 14) {
      greeting = '中午好';
    } else if (hour < 18) {
      greeting = '下午好';
    } else {
      greeting = '晚上好';
    }
    
    this.setData({
      greeting: greeting
    });
  },
  
  // 更新激励提示
  updateMotivationalTip: function() {
    const tips = [
      '坚持练习，每天进步一点点！',
      '一万小时定律：持续练习是成功的关键。',
      '今天的努力，明天的收获。',
      '专注当下，享受练习的过程。',
      '记录每一刻，见证你的成长。'
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    this.setData({
      motivationalTip: randomTip
    });
  },
  
  onShow: function() {
    // 每次显示页面时刷新数据
    const app = getApp();
    this.setData({
      skills: app.globalData.skills || [],
      darkMode: app.globalData.darkMode || false
    });
    
    this.updateTheme();
    this.updateGreeting();
    this.updateMotivationalTip();
    this.fetchRecentActivities();
    this.fetchRecentSkills();
    
    // 只有在还没有选择技能的情况下，才默认选择第一个技能
    if (app.globalData.skills && app.globalData.skills.length > 0 && !this.data.selectedSkillId) {
      const firstSkill = app.globalData.skills[0];
      
      this.setData({
        selectedSkillIndex: 0,
        selectedSkillId: firstSkill ? firstSkill.id : '',
        selectedSkillName: firstSkill ? firstSkill.name : '请选择技能'
      });
      
      console.log('默认选择第一个技能:', { index: 0, id: firstSkill ? firstSkill.id : '未找到' });
    } else if (this.data.selectedSkillId) {
      // 如果已经有选择的技能，确保技能名称正确显示
      const selectedSkill = app.globalData.skills.find(skill => skill.id === this.data.selectedSkillId);
      if (selectedSkill) {
        this.setData({
          selectedSkillName: selectedSkill.name
        });
      }
    } else {
      // 如果没有技能数据，重置选择状态
      this.setData({
        selectedSkillIndex: '',
        selectedSkillId: '',
        selectedSkillName: '请选择技能'
      });
    }
  },
  
  // 获取最近使用的技能
  fetchRecentSkills: function() {
    try {
      // 从存储获取练习记录或使用空数组作为后备
      const practiceRecords = wx.getStorageSync('practiceRecords') || [];
      const recentSkillMap = new Map();
      const app = getApp();
      
      // 获取最近5条记录中的技能
      practiceRecords.slice(0, 5).forEach(record => {
        if (!recentSkillMap.has(record.skillId)) {
          recentSkillMap.set(record.skillId, record);
        }
      });
      
      // 转换为数组
      const recentSkills = Array.from(recentSkillMap.values())
        .map(record => {
          // 找到对应的技能索引
          const skillIndex = app.globalData.skills.findIndex(s => s.id === record.skillId);
          return {
            id: record.skillId,
            name: record.skillName,
            index: skillIndex
          };
        })
        .filter(skill => skill.index !== -1); // 过滤掉不存在的技能
      
      this.setData({
        recentSkills: recentSkills
      });
    } catch (e) {
      console.error('获取最近技能失败', e);
      // 出错时设置空数组，避免显示问题
      this.setData({
        recentSkills: []
      });
    }
  },
  
  // 获取最近活动
  fetchRecentActivities: function() {
    try {
      // 从存储获取练习记录或使用空数组作为后备
      const practiceRecords = wx.getStorageSync('practiceRecords') || [];
      
      // 格式化最近5条记录
      const recentActivities = practiceRecords.slice(0, 5).map(record => {
        const date = new Date(record.date);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
        
        return {
          id: record.id,
          skillName: record.skillName,
          hours: record.hours || 0,
          minutes: record.minutes || 0,
          date: formattedDate
        };
      });
      
      this.setData({
        recentActivities: recentActivities
      });
    } catch (e) {
      console.error('获取最近活动失败', e);
      // 出错时设置空数组，避免显示问题
      this.setData({
        recentActivities: []
      });
    }
  },
  
  // 更新页面主题
  updateTheme: function() {
    const app = getApp();
    
    // 重新获取并应用全局样式变量，触发样式更新
    if (app.globalData.darkMode) {
      this.setData({
        theme: 'dark',
        darkModeClass: 'dark'
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
  
  // 处理技能选择
  onSkillSelect: function(e) {
    const selectedIndex = e.detail.value;
    const app = getApp();
    const selectedSkill = app.globalData.skills[selectedIndex];
    
    // 使用实际的技能ID
    this.setData({
      selectedSkillIndex: selectedIndex,
      selectedSkillId: selectedSkill ? selectedSkill.id : '',
      selectedSkillName: selectedSkill ? selectedSkill.name : '请选择技能'
    });
    
    console.log('选择技能:', { index: selectedIndex, id: selectedSkill ? selectedSkill.id : '未找到' });
  },
  
  // 快速选择技能
  selectSkillQuickly: function(e) {
    const { skillId, skillIndex } = e.currentTarget.dataset;
    const app = getApp();
    const selectedSkill = app.globalData.skills[skillIndex];
    
    this.setData({
      selectedSkillIndex: skillIndex,
      selectedSkillId: skillId,
      selectedSkillName: selectedSkill ? selectedSkill.name : '请选择技能'
    });
  },
  
  // 小时滑块变化处理
  onHoursSliderChange: function(e) {
    const hours = e.detail.value;
    // 计算总小时数（保留用于向后兼容）
    const totalHours = hours + this.data.selectedMinutes / 60;
    
    this.setData({
      selectedHours: hours,
      practiceHours: totalHours
    });
  },
  
  // 分钟选择处理
  selectMinutes: function(e) {
    const minutes = parseInt(e.currentTarget.dataset.minutes);
    // 计算总小时数（保留用于向后兼容）
    const totalHours = this.data.selectedHours + minutes / 60;
    
    this.setData({
      selectedMinutes: minutes,
      practiceHours: totalHours
    });
  },
  
  // 练习笔记输入处理
  onNotesInput: function(e) {
    this.setData({
      practiceNotes: e.detail.value
    });
  },
  
  // 处理表单提交
  handleSubmit: function() {
    const { selectedSkillId, practiceHours, selectedSkillName, selectedHours, selectedMinutes, practiceNotes } = this.data;
    const app = getApp();
    
    console.log('当前表单数据:', { selectedSkillId, practiceHours, selectedSkillName, selectedHours, selectedMinutes });
    
    // 表单验证
    if (!selectedSkillId) {
      wx.showToast({
        title: '请选择技能',
        icon: 'none'
      });
      return;
    }
    
    if (practiceHours <= 0) {
      wx.showToast({
        title: '练习时间必须大于0',
        icon: 'none'
      });
      return;
    }
    
    // 创建练习记录（同时用于保存到本地和传递给全局方法）
    const practiceRecord = {
      id: Date.now().toString(),
      skillId: selectedSkillId,
      skillName: selectedSkillName,
      hours: selectedHours,
      minutes: selectedMinutes,
      totalMinutes: selectedHours * 60 + selectedMinutes,
      notes: practiceNotes.trim(),
      date: new Date().toISOString()
    };
    
    // 记录练习时间（调用全局方法）
    app.recordPractice(Number(selectedSkillId), practiceHours);
    
    try {
      // 同时保存到本地存储，用于最近活动显示
      let practiceRecords = wx.getStorageSync('practiceRecords') || [];
      practiceRecords.unshift(practiceRecord);
      wx.setStorageSync('practiceRecords', practiceRecords);
      
    } catch (e) {
      console.error('保存到本地存储失败', e);
      // 这里不中断流程，因为全局方法已经调用成功
    }
    
    // 显示成功提示
    wx.showToast({
      title: '记录成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        // 延迟重置表单和返回上一页，确保用户能看到提示
        setTimeout(() => {
          // 重置表单
          this.setData({
            selectedHours: 1,
            selectedMinutes: 0,
            practiceNotes: '',
            practiceHours: 1
          });
          
          // 返回上一页
          wx.navigateBack();
        }, 1500);
      }
    });
  },
  
  // 跳转到添加技能页面
  navigateToAddSkill: function() {
    wx.navigateTo({
      url: '../addSkill/addSkill',
      fail: (error) => {
        console.error('跳转失败', error);
        wx.showToast({
          title: '跳转失败，请重试',
          icon: 'none'
        });
      }
    });
  },
  
  // 获取选中技能的名称
  getSkillName: function(skillId) {
    const { skills, selectedSkillName } = this.data;
    
    // 如果有直接设置的技能名称，优先使用
    if (selectedSkillName && selectedSkillName !== '请选择技能') {
      return selectedSkillName;
    }
    
    if (!skillId || !skills || skills.length === 0) {
      return '请选择技能';
    }
    
    // 将 skillId 转换为数字进行比较
    const skillIndex = Number(skillId);
    if (skillIndex >= 0 && skillIndex < skills.length) {
      return skills[skillIndex].name;
    }
    
    return '请选择技能';
  }
});