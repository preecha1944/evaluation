import React from 'react';
import { KPIItem } from '../types';
import { Target, Info } from 'lucide-react';

interface Props {
  items: KPIItem[];
  onChange: (items: KPIItem[]) => void;
}

const StepPart1: React.FC<Props> = ({ items, onChange }) => {
  const handleScoreChange = (id: string, val: number) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, score: val } : item
    );
    onChange(newItems);
  };

  const calculateWeightedScore = (item: KPIItem) => {
    return (item.score / 5) * item.weight;
  };

  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-xl shadow-blue-200">
        <div className="flex items-start justify-between">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Target className="w-6 h-6 text-white" />
                </div>
                ชุดที่ 1: ผลสัมฤทธิ์ของงาน
                </h2>
                <p className="text-blue-100 mt-2 text-sm opacity-90 max-w-xl">
                ประเมินตามตัวชี้วัดผลสัมฤทธิ์ของงาน (น้ำหนักรวม 80%) โดยพิจารณาจากปริมาณ คุณภาพ และความคุ้มค่า
                </p>
            </div>
            <div className="hidden md:block text-right">
                <span className="text-4xl font-bold opacity-20">Part 1</span>
            </div>
        </div>
      </div>

      {categories.map(cat => (
        <div key={cat} className="space-y-4">
          <h3 className="text-lg font-bold text-slate-700 border-l-4 border-blue-500 pl-3">{cat}</h3>
          <div className="grid grid-cols-1 gap-4">
            {items.filter(i => i.category === cat).map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow p-5 relative overflow-hidden group">
                {/* Background Decoration */}
                <div className="absolute right-0 top-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
                
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                    รหัส {item.id}
                                </span>
                                <span className="text-xs text-slate-400">น้ำหนัก {item.weight} คะแนน</span>
                            </div>
                            <p className="text-slate-800 font-medium leading-relaxed">{item.name}</p>
                        </div>

                        <div className="flex flex-col items-end gap-2 min-w-[200px]">
                            <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                                {[1, 2, 3, 4, 5].map((score) => (
                                    <button
                                    key={score}
                                    onClick={() => handleScoreChange(item.id, score)}
                                    className={`w-9 h-9 rounded-md font-bold text-sm transition-all shadow-sm ${
                                        item.score === score
                                        ? 'bg-blue-600 text-white shadow-blue-200 scale-105'
                                        : 'bg-white text-slate-400 hover:text-blue-600'
                                    }`}
                                    >
                                    {score}
                                    </button>
                                ))}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                                คะแนนจริง: <span className="text-blue-600 font-bold text-sm">{calculateWeightedScore(item).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepPart1;