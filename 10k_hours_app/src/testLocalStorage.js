// 测试localStorage中的技能数据
console.log('===== 测试LocalStorage数据 =====');

// 查看localStorage中的原始数据
console.log('LocalStorage原始数据:', localStorage.getItem('skills'));

// 尝试解析技能数据
let skills = [];
try {
  skills = JSON.parse(localStorage.getItem('skills') || '[]');
  console.log('解析后的技能数据:', skills);
} catch (error) {
  console.error('解析技能数据出错:', error);
  skills = [];
}

// 检查技能数据是否为空
if (skills.length === 0) {
  console.log('技能数据为空，添加测试数据...');

  // 添加测试数据
  const testSkills = [
    {
      id: '1',
      name: '编程',
      hoursPracticed: 500,
      targetHours: 10000,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: '英语',
      hoursPracticed: 1000,
      targetHours: 10000,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: '吉他',
      hoursPracticed: 200,
      targetHours: 10000,
      createdAt: new Date().toISOString()
    }
  ];

  // 保存到localStorage
  localStorage.setItem('skills', JSON.stringify(testSkills));
  console.log('已添加测试数据:', testSkills);

  // 提示用户刷新页面
  console.log('===== 请刷新页面以查看更新后的数据 =====');
} else {
  console.log('技能数据不为空，共有', skills.length, '个技能');
  console.log('第一个技能:', skills[0]);
}

console.log('=====================================');