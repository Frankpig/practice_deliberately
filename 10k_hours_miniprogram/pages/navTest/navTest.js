Page({
  data: {
    // 页面数据
  },
  
  onLoad: function() {
    console.log('导航测试页面加载完成');
  },
  
  // switchTab 导航测试函数
  testSwitchTabToIndex: function() {
    console.log('尝试使用 switchTab 跳转到首页');
    wx.switchTab({
      url: '/pages/index/index',
      success: function() {
        console.log('✅ switchTab 到首页成功');
        wx.showToast({ title: 'switchTab 到首页成功', icon: 'success' });
      },
      fail: function(err) {
        console.error('❌ switchTab 到首页失败:', err);
        wx.showToast({ title: 'switchTab 到首页失败', icon: 'none' });
      }
    });
  },
  
  testSwitchTabToSkillList: function() {
    console.log('尝试使用 switchTab 跳转到我的技能');
    wx.switchTab({
      url: '/pages/skillList/skillList',
      success: function() {
        console.log('✅ switchTab 到我的技能成功');
        wx.showToast({ title: 'switchTab 到我的技能成功', icon: 'success' });
      },
      fail: function(err) {
        console.error('❌ switchTab 到我的技能失败:', err);
        wx.showToast({ title: 'switchTab 到我的技能失败', icon: 'none' });
      }
    });
  },
  
  testSwitchTabToAddSkill: function() {
    console.log('尝试使用 switchTab 跳转到添加技能');
    wx.switchTab({
      url: '/pages/addSkill/addSkill',
      success: function() {
        console.log('✅ switchTab 到添加技能成功');
        wx.showToast({ title: 'switchTab 到添加技能成功', icon: 'success' });
      },
      fail: function(err) {
        console.error('❌ switchTab 到添加技能失败:', err);
        wx.showToast({ title: 'switchTab 到添加技能失败', icon: 'none' });
      }
    });
  },
  
  testSwitchTabToSkillProgress: function() {
    console.log('尝试使用 switchTab 跳转到进度统计');
    wx.switchTab({
      url: '/pages/skillProgress/skillProgress',
      success: function() {
        console.log('✅ switchTab 到进度统计成功');
        wx.showToast({ title: 'switchTab 到进度统计成功', icon: 'success' });
      },
      fail: function(err) {
        console.error('❌ switchTab 到进度统计失败:', err);
        wx.showToast({ title: 'switchTab 到进度统计失败', icon: 'none' });
      }
    });
  },
  
  // navigateTo 导航测试函数
  testNavigateToRecordPractice: function() {
    console.log('尝试使用 navigateTo 跳转到记录练习');
    wx.navigateTo({
      url: '/pages/recordPractice/recordPractice',
      success: function() {
        console.log('✅ navigateTo 到记录练习成功');
        wx.showToast({ title: 'navigateTo 到记录练习成功', icon: 'success' });
      },
      fail: function(err) {
        console.error('❌ navigateTo 到记录练习失败:', err);
        wx.showToast({ title: 'navigateTo 到记录练习失败', icon: 'none' });
      }
    });
  },
  
  testNavigateToTest: function() {
    console.log('尝试使用 navigateTo 跳转到测试页面');
    wx.navigateTo({
      url: '/pages/test/test',
      success: function() {
        console.log('✅ navigateTo 到测试页面成功');
        wx.showToast({ title: 'navigateTo 到测试页面成功', icon: 'success' });
      },
      fail: function(err) {
        console.error('❌ navigateTo 到测试页面失败:', err);
        wx.showToast({ title: 'navigateTo 到测试页面失败', icon: 'none' });
      }
    });
  },
  
  // 相对路径测试
  testRelativePath: function() {
    console.log('尝试使用相对路径导航');
    wx.navigateTo({
      url: '../../pages/test/test',
      success: function() {
        console.log('✅ 相对路径导航成功');
        wx.showToast({ title: '相对路径导航成功', icon: 'success' });
      },
      fail: function(err) {
        console.error('❌ 相对路径导航失败:', err);
        wx.showToast({ title: '相对路径导航失败', icon: 'none' });
      }
    });
  }
});