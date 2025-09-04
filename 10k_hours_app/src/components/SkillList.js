import React, { useContext } from 'react';
import SkillContext from '../contexts/SkillContext';
import './SkillList.css';

const SkillList = () => {
  const { skills, getSkillStage, getSkillProgress } = useContext(SkillContext);

  if (skills.length === 0) {
    return (
      <div className="skill-list empty">
        <p>暂无技能，请添加新技能开始练习记录</p>
      </div>
    );
  }

  return (
    <div className="skill-list">
      <h2>我的技能</h2>
      <div className="skill-cards">
        {skills.map(skill => (
          <div key={skill.id} className="skill-card">
            <div className="skill-header">
              <h3>{skill.name}</h3>
              <span className="skill-stage"><strong>{getSkillStage(skill.hoursPracticed)}</strong></span>
            </div>
            <div className="skill-progress">
              <div
                className="progress-bar"
                style={{ width: `${getSkillProgress(skill.hoursPracticed, skill.targetHours)}%` }}
              />
              <span className="progress-text">
                {skill.hoursPracticed.toFixed(1)} / {skill.targetHours} 小时
                ({getSkillProgress(skill.hoursPracticed, skill.targetHours).toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillList;