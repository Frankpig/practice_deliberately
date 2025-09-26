// simple.js
Page({
  data: {
    skills: [],
    selectedSkillId: '',
    selectedSkillName: '',
    practiceHours: 1,
    error: '',
    darkMode: false
  },
  
  onLoad: function() {
    const app = getApp();
    this.setData({
      skills: app.globalData.skills,
      darkMode: app.globalData.darkMode
    });
  },
  
  onShow: function() {
    const app = getApp();
    this.setData({
      skills: app.globalData.skills,
      darkMode: app.globalData.darkMode
    });
  },
  
  onSkillSelect: function(e) {
    const index = e.detail.value;
    const selectedSkill = this.data.skills[index];
    
    if (selectedSkill) {
      this.setData({
        selectedSkillId: selectedSkill.id,
        selectedSkillName: selectedSkill.name,
        error: ''
      });
    }
  },
  
  onPracticeHoursInput: function(e) {
    const hours = Number(e.detail.value);
    this.setData({
      practiceHours: hours > 0 ? hours : 0.1
    });
  },
  
  handleSubmit: function() {
    if (!this.data.selectedSkillId) {
      this.setData({
        error: '请选择技能'
      });
      return;
    }
    
    if (this.data.practiceHours <= 0) {
      this.setData({
        error: '请输入有效的练习时长'
      });
      return;
    }
    
    // 记录练习时间
    const app = getApp();
    app.recordPractice(this.data.selectedSkillId, this.data.practiceHours);
    
    // 显示成功提示
    wx.showToast({
      title: '记录成功',
      icon: 'success',
      duration: 2000
    });
    
    // 重置表单
    this.setData({
      selectedSkillId: '',
      selectedSkillName: '',
      practiceHours: 1,
      error: ''
    });
  }
});