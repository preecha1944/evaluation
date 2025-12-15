import React from 'react';
import { CompetencySection } from '../types';
import { Star, Zap, Users, Heart, BookOpen } from 'lucide-react';

interface Props {
  sections: CompetencySection[];
  onChange: (sections: CompetencySection[]) => void;
}

const StepPart2: React.FC<Props> = ({ sections, onChange }) => {
  const handleScoreChange = (sectionId: string, itemId: string, val: number) => {
    const newSections = sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.map(item => item.id === itemId ? { ...item, score: val } : item)
      };
    });
    onChange(newSections);
  };

  const getIcon = (id: string) => {
    if (id.includes('C1')) return Zap;
    if (id.includes('C2')) return Heart;
    if (id.includes('C3')) return BookOpen;
    if (id.includes('C5')) return Users;
    return Star;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 rounded-2xl shadow-xl shadow-emerald-200">
        <div className="flex items-start justify-between">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Star className="w-6 h-6 text-white" />
                </div>
                ชุดที่ 2: พฤติกรรมการปฏิบัติงาน
                </h2>
                <p className="text-emerald-100 mt-2 text-sm opacity-90 max-w-xl">
                ประเมินสมรรถนะหลัก 5 ด้าน และสมรรถนะประจำสายงาน (น้ำหนักรวม 20%)
                </p>
            </div>
            <div className="hidden md:block text-right">
                <span className="text-4xl font-bold opacity-20">Part 2</span>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section) => {
            const Icon = getIcon(section.id);
            const currentScore = section.items.reduce((acc, i) => acc + i.score, 0);
            const maxScore = section.items.length * 5;
            const weightedScore = (currentScore / maxScore) * section.weight;

            return (
                <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                                <Icon className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{section.name}</h3>
                                <p className="text-sm text-slate-500 mt-1">{section.definition}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm text-xs font-bold text-slate-600 mb-1">
                                น้ำหนัก {section.weight}
                            </div>
                            <div className="text-sm font-medium text-emerald-600">
                                ได้ {weightedScore.toFixed(2)} คะแนน
                            </div>
                        </div>
                    </div>
                    
                    <div className="divide-y divide-slate-50">
                        {section.items.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4 justify-between items-center">
                                <div className="w-full">
                                    <p className="text-slate-700 text-sm font-medium">{item.text}</p>
                                </div>
                                <div className="flex gap-1 shrink-0 bg-white p-1 rounded-lg border border-slate-100 shadow-sm">
                                     {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleScoreChange(section.id, item.id, s)}
                                            className={`w-8 h-8 rounded text-xs font-bold transition-all ${
                                                item.score === s
                                                ? 'bg-emerald-500 text-white shadow-md scale-105'
                                                : 'text-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                     ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default StepPart2;