// addSkill.js
Page({
  data: {
    skillName: '',
    targetHours: 10000,
    error: '',
    darkMode: false
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
  
  // 处理技能名称输入
  onSkillNameInput: function(e) {
    this.setData({
      skillName: e.detail.value
    });
  },
  
  // 处理目标小时数输入
  onTargetHoursInput: function(e) {
    this.setData({
      targetHours: Number(e.detail.value)
    });
  },
  
  // 处理表单提交
  handleSubmit: function() {
    console.log('===== 表单提交开始 [DEBUG] =====');
    console.log('当前时间戳:', Date.now());
    const { skillName, targetHours } = this.data;
    const app = getApp();
    
    // 记录全局应用实例引用
    console.log('全局应用实例获取成功:', !!app);
    console.log('表单数据:', { skillName, targetHours });
    console.log('技能名称原始值长度:', skillName.length);
    console.log('技能名称去空格后长度:', skillName.trim().length);
    
    // 表单验证
    if (!skillName.trim()) {
      console.log('验证失败: 技能名称为空');
      this.setData({
        error: '技能名称不能为空'
      });
      return;
    }
    
    if (targetHours <= 0) {
      console.log('验证失败: 目标小时数不合法');
      this.setData({
        error: '目标小时数必须大于0'
      });
      return;
    }
    
    console.log('验证通过，准备添加技能');
    console.log('添加前全局技能数据类型:', Array.isArray(app.globalData.skills) ? '数组' : typeof app.globalData.skills);
    console.log('添加前全局技能数量:', Array.isArray(app.globalData.skills) ? app.globalData.skills.length : 'N/A');
    
    // 检查是否已存在相同名称的技能
    const trimmedSkillName = skillName.trim();
    if (Array.isArray(app.globalData.skills)) {
      const skillExists = app.globalData.skills.some(skill => 
        skill.name.toLowerCase() === trimmedSkillName.toLowerCase()
      );
      
      if (skillExists) {
        console.log('验证失败: 已存在相同名称的技能');
        this.setData({
          error: '已存在相同名称的技能'
        });
        return;
      }
      
      if (app.globalData.skills.length > 0) {
        console.log('添加前全局技能列表示例:', app.globalData.skills[0]);
      }
    }
    
    // 创建新技能对象
    const newSkill = {
      id: Date.now(),
      name: skillName.trim(),
      hoursPracticed: 0,
      targetHours: targetHours,
      createdAt: new Date().toISOString()
    };
    
    console.log('创建新技能对象:', newSkill);
    console.log('新技能对象JSON序列化结果:', JSON.stringify(newSkill));
    
    try {
      // 更新全局技能数据 - 使用与app.js相同的方式创建新数组确保引用正确更新
      if (!Array.isArray(app.globalData.skills)) {
        console.log('全局技能数据不是数组，重新初始化为空数组');
        app.globalData.skills = [];
      }
      
      // 记录更新前的数组引用
      const beforeUpdateRef = app.globalData.skills;
      
      // 更新全局数据
      app.globalData.skills = [...app.globalData.skills, newSkill];
      
      // 验证数组引用是否已更新
      console.log('数组引用是否已更新:', app.globalData.skills !== beforeUpdateRef);
      console.log('全局技能数据已更新(使用展开运算符创建新数组)，数量:', app.globalData.skills.length);
      console.log('更新后技能列表:', app.globalData.skills);
      
      // 保存到本地存储
      try {
        const skillsStr = JSON.stringify(app.globalData.skills);
        console.log('序列化后的数据:', skillsStr);
        
        const storageResult = wx.setStorageSync('skills', skillsStr);
        console.log('存储操作返回结果:', storageResult);
        console.log('技能数据已保存到本地存储，数据大小:', skillsStr.length);
        
        // 立即重新读取验证保存是否成功
        setTimeout(() => {
          const savedData = wx.getStorageSync('skills');
          console.log('延迟验证保存结果: 存储中数据长度:', savedData ? savedData.length : 0);
          
          if (savedData) {
            try {
              const parsedData = JSON.parse(savedData);
              console.log('延迟验证保存结果: 解析后技能数量:', parsedData.length);
              console.log('延迟验证保存结果: 解析后技能列表:', parsedData);
            } catch (e) {
              console.error('延迟验证时解析数据失败:', e);
            }
          }
        }, 500);
        
        // 立即验证保存是否成功
        const savedData = wx.getStorageSync('skills');
        console.log('立即验证保存结果: 存储中数据长度:', savedData ? savedData.length : 0);
        
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            console.log('立即验证保存结果: 解析后技能数量:', parsedData.length);
            console.log('立即验证保存结果: 解析后技能列表:', parsedData);
          } catch (e) {
            console.error('立即验证时解析数据失败:', e);
          }
        }
      } catch (e) {
        console.error('保存数据到本地存储失败:', e.message);
        console.error('保存失败详细错误:', e);
      }
      
      // 显示成功提示
      wx.showToast({
        title: '技能添加成功',
        icon: 'success',
        duration: 2000,
        success: function() {
          console.log('成功提示显示成功');
        },
        fail: function(err) {
          console.error('成功提示显示失败:', err);
        }
      });
      
      // 重置表单
      this.setData({
        skillName: '',
        targetHours: 10000,
        error: ''
      }, () => {
        console.log('表单重置回调执行，表单数据已清空');
      });
      
      console.log('表单已重置，准备跳转到技能列表页面');
      
      // 直接跳转到技能列表页面，不再延迟
      console.log('执行页面跳转');
      wx.switchTab({
        url: '/pages/skillList/skillList',
        success: function(res) {
          console.log('跳转成功，返回结果:', res);
          // 跳转成功后再次验证全局数据
          console.log('跳转成功后全局技能数量:', app.globalData.skills.length);
        },
        fail: function(err) {
          console.error('跳转失败:', err);
          console.error('跳转失败详细信息:', JSON.stringify(err));
        },
        complete: function() {
          console.log('跳转操作已完成');
        }
      });
    } catch (e) {
      console.error('添加技能过程中发生错误:', e.message);
      console.error('添加错误详细信息:', e);
      console.error('错误堆栈:', e.stack);
      wx.showToast({
        title: '添加失败，请重试',
        icon: 'error'
      });
    }
    
    console.log('===== 表单提交流程结束 [DEBUG] =====');
  }
});