import React, { createContext, useState, useEffect } from 'react';

// 创建上下文
const SkillContext = createContext();

// 上下文提供者组件
export const SkillProvider = ({ children }) => {
  // 从本地存储加载技能数据
  const [skills, setSkills] = useState(() => {
    const savedSkills = localStorage.getItem('skills');
    return savedSkills ? JSON.parse(savedSkills) : [];
  });

  // 监听skills变化，保存到本地存储
  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills));
  }, [skills]);

  // 添加新技能
  const addSkill = (skillName, targetHours = 10000) => {
    setSkills([...skills, {
      id: Date.now(),
      name: skillName,
      hoursPracticed: 0,
      targetHours: targetHours,
      createdAt: new Date().toISOString()
    }]);
  };

  // 记录练习时间
  const recordPractice = (skillId, hours) => {
    setSkills(skills.map(skill => {
      if (skill.id === skillId) {
        return { ...skill, hoursPracticed: skill.hoursPracticed + hours };
      }
      return skill;
    }));
  };

  // 获取技能阶段
  const getSkillStage = (hoursPracticed) => {
    if (hoursPracticed < 500) return '新手';
    if (hoursPracticed < 2000) return '进阶者';
    if (hoursPracticed < 8000) return '熟练者';
    return '专家';
  };

  // 获取技能进度百分比
  const getSkillProgress = (hoursPracticed, targetHours) => {
    return Math.min((hoursPracticed / targetHours) * 100, 100);
  };

  // 上下文值
  const contextValue = {
    skills,
    addSkill,
    recordPractice,
    getSkillStage,
    getSkillProgress
  };

  return (
    <SkillContext.Provider value={contextValue}>
      {children}
    </SkillContext.Provider>
  );
};

export default SkillContext;