import React from 'react';
import './App.css';
import { SkillProvider } from './contexts/SkillContext';
import SkillProgress from './components/SkillProgress';
import SkillList from './components/SkillList';
import AddSkillForm from './components/AddSkillForm';
import RecordPracticeForm from './components/RecordPracticeForm';

function App() {
  return (
    <SkillProvider>
      <div className="app-container" style={{ textAlign: 'center', padding: '20px' }}>
        <h1>刻意练习</h1>
        <AddSkillForm />
        <RecordPracticeForm />
        <SkillList />
        <SkillProgress />
      </div>
    </SkillProvider>
  );
}

export default App;
