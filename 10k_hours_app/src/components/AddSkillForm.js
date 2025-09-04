import React, { useContext, useState } from 'react';
import SkillContext from '../contexts/SkillContext';
import './AddSkillForm.css';

const AddSkillForm = () => {
  const { addSkill } = useContext(SkillContext);
  const [skillName, setSkillName] = useState('');
  const [targetHours, setTargetHours] = useState(10000);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!skillName.trim()) {
      setError('技能名称不能为空');
      return;
    }

    if (targetHours <= 0) {
      setError('目标小时数必须大于0');
      return;
    }

    addSkill(skillName, targetHours);
    setSkillName('');
    setTargetHours(10000);
    setError('');
  };

  return (
    <div className="add-skill-form">
      <h2>添加新技能</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="skillName">技能名称</label>
          <input
            type="text"
            id="skillName"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="例如：编程、钢琴、绘画..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="targetHours">目标小时数 (默认: 10000)</label>
          <input
            type="number"
            id="targetHours"
            value={targetHours}
            onChange={(e) => setTargetHours(Number(e.target.value))}
            min="1"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="btn-primary">添加技能</button>
      </form>
    </div>
  );
};

export default AddSkillForm;