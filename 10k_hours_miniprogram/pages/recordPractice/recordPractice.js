// recordPractice.js
Page({
  data: {
    skills: [],
    selectedSkillId: '',
    selectedSkillIndex: '',
    selectedSkillName: '请选择技能',
    practiceHours: 1, // 保留用于向后兼容
    error: '',
    darkMode: false,
    // 时间选择器相关数据
    timeValues: [0, 0], // [小时索引, 分钟索引]
    timeRanges: [[], [0, 10, 20, 30, 40, 50]], // [小时选项数组, 分钟选项数组]
    selectedHours: 1,
    selectedMinutes: 0
  },
  
  onLoad: function(options) {
    // 获取全局应用实例
    const app = getApp();
    // 设置初始主题和技能数据
    this.setData({
      skills: app.globalData.skills,
      darkMode: app.globalData.darkMode
    });
    
    // 初始化时间选择器
    this.initTimeRanges();
    
    // 根据主题设置页面样式
    this.updateTheme();
    
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
  },
  
  // 初始化时间选择器的选项
  initTimeRanges: function() {
    // 获取最大小时数（目标小时数，这里假设为10000小时）
    const maxHours = 10000; // 可以根据实际需求调整
    const hourOptions = [];
    
    // 生成1到maxHours的小时选项，添加单位便于识别
    for (let i = 1; i <= maxHours; i++) {
      hourOptions.push(i + '小时');
    }
    
    // 分钟选项固定为0, 10, 20, 30, 40, 50，添加单位便于识别
    const minuteOptions = ['0分钟', '10分钟', '20分钟', '30分钟', '40分钟', '50分钟'];
    
    this.setData({
      timeRanges: [hourOptions, minuteOptions],
      selectedHours: 1,
      selectedMinutes: 0
    });
  },
  
  onShow: function() {
    // 每次显示页面时刷新技能数据和主题
    const app = getApp();
    this.setData({
      skills: app.globalData.skills,
      darkMode: app.globalData.darkMode
    });
    this.updateTheme();
    
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
  
  // 处理技能选择
  onSkillSelect: function(e) {
    const selectedIndex = e.detail.value;
    const app = getApp();
    const selectedSkill = app.globalData.skills[selectedIndex];
    
    // 修复：使用实际的技能ID而不是数组索引
    this.setData({
      selectedSkillIndex: selectedIndex,
      selectedSkillId: selectedSkill ? selectedSkill.id : '',
      selectedSkillName: selectedSkill ? selectedSkill.name : '请选择技能'
    });
    
    console.log('选择技能:', { index: selectedIndex, id: selectedSkill ? selectedSkill.id : '未找到' });
  },
  
  // 处理练习时间选择变化
  onPracticeTimeChange: function(e) {
    const [hourIndex, minuteIndex] = e.detail.value;
    
    // 从选项文本中提取数值
    const selectedHours = parseInt(this.data.timeRanges[0][hourIndex]);
    const selectedMinutes = parseInt(this.data.timeRanges[1][minuteIndex]);
    
    // 计算总小时数（保留用于向后兼容）
    const totalHours = selectedHours + selectedMinutes / 60;
    
    this.setData({
      timeValues: [hourIndex, minuteIndex],
      selectedHours: selectedHours,
      selectedMinutes: selectedMinutes,
      practiceHours: totalHours
    });
  },
  
  // 处理时间选择器列值变化
  onTimeColumnChange: function(e) {
    const column = e.detail.column;
    const value = e.detail.value;
    
    // 更新对应列的值
    const timeValues = this.data.timeValues;
    timeValues[column] = value;
    
    this.setData({
      timeValues: timeValues
    });
  },
  
  // 处理表单提交
  handleSubmit: function(e) {
    console.log('===== handleSubmit函数开始执行 =====');
    console.log('接收到的事件参数:', e);
    
    const { selectedSkillId, practiceHours, selectedSkillName, selectedHours, selectedMinutes } = this.data;
    const app = getApp();
    
    console.log('当前表单数据:', { selectedSkillId, practiceHours, selectedSkillName, selectedHours, selectedMinutes });
    console.log('app.globalData.skills长度:', app.globalData.skills ? app.globalData.skills.length : 0);
    
    // 表单验证
    if (selectedSkillId === '') {
      console.log('未选择技能，显示提示框');
      // 弹出报警框
      wx.showModal({
        title: '提示',
        content: '请选择技能',
        showCancel: false,
        success: function(res) {
          console.log('未选择技能提示框回调:', res);
          if (res.confirm) {
            console.log('用户点击确定');
          }
        }
      });
      return;
    }
    
    if (practiceHours <= 0) {
      console.log('练习小时数不合法，显示提示框');
      // 弹出报警框
      wx.showModal({
        title: '提示',
        content: '练习小时数必须大于0',
        showCancel: false,
        success: function(res) {
          console.log('练习小时数不合法提示框回调:', res);
          if (res.confirm) {
            console.log('用户点击确定');
          }
        }
      });
      return;
    }
    
    console.log('开始记录练习时间');
    console.log('传递给recordPractice的参数:', { skillId: Number(selectedSkillId), hours: practiceHours });
    
    // 记录练习时间
    app.recordPractice(Number(selectedSkillId), practiceHours);
    
    // 检查是否成功更新了数据
    console.log('练习时间记录后，检查全局技能数据:');
    const updatedSkill = app.globalData.skills.find(skill => skill.id === Number(selectedSkillId));
    console.log('更新后的技能数据:', updatedSkill);
    
    console.log('练习时间记录成功，准备显示成功提示框');
    // 显示成功提示
    wx.showToast({
      title: '已记录',
      icon: 'success',
      duration: 2000,
      success: () => {
        console.log('成功提示框显示成功回调触发');
        // 延迟重置表单和返回上一页，确保用户能看到提示
        setTimeout(() => {
          console.log('开始重置表单');
          // 重置表单
          this.setData({
            selectedSkillId: '',
            selectedSkillIndex: '',
            practiceHours: 1,
            error: ''
          });
          
          console.log('表单重置完成，准备返回上一页');
          // 返回上一页
          wx.navigateBack();
        }, 1500); // 提前500ms返回，确保在toast消失前开始导航
      },
      fail: (err) => {
        console.error('显示成功提示框失败:', err);
      },
      complete: () => {
        console.log('成功提示框显示操作完成');
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