import React, { useState } from 'react';
import { ScoreSummary, EvaluationData, EvaluationLevel } from '../types';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { Save, CheckCircle, AlertCircle, LayoutGrid, FileText, Activity } from 'lucide-react';

interface Props {
  data: EvaluationData;
  score: ScoreSummary;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Summary: React.FC<Props> = ({ data, score, onSubmit, isSubmitting }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'part1' | 'part2'>('overview');

  // Chart Data Preparation
  const overviewData = [
    { name: 'ผลสัมฤทธิ์ (80%)', value: parseFloat(score.part1Weighted.toFixed(2)), full: 80, fill: '#4f46e5' }, // Indigo
    { name: 'พฤติกรรม (20%)', value: parseFloat(score.part2Weighted.toFixed(2)), full: 20, fill: '#10b981' }, // Emerald
  ];

  const radarData = data.part2.map(sec => ({
      subject: sec.id,
      fullMark: sec.weight,
      score: (sec.items.reduce((a, b) => a + b.score, 0) / (sec.items.length * 5)) * sec.weight
  }));

  const getLevelColor = (level: EvaluationLevel) => {
    switch (level) {
      case EvaluationLevel.OUTSTANDING: return 'text-purple-600 bg-purple-50 border-purple-200';
      case EvaluationLevel.VERY_GOOD: return 'text-green-600 bg-green-50 border-green-200';
      case EvaluationLevel.GOOD: return 'text-blue-600 bg-blue-50 border-blue-200';
      case EvaluationLevel.FAIR: return 'text-orange-600 bg-orange-50 border-orange-200';
      case EvaluationLevel.IMPROVE: return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">สรุปผลการประเมิน</h2>
            <p className="text-slate-500">ตรวจสอบความถูกต้องและยืนยันผลการประเมิน</p>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 blur-3xl"></div>
             
             <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-500 border-4 border-white shadow-lg">
                        {data.info.prefix === 'นาย' ? '👨🏻‍💼' : '👩🏻‍💼'}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{data.info.prefix}{data.info.name}</h3>
                        <p className="text-slate-500">{data.info.position}</p>
                        <div className="flex gap-2 mt-2">
                             <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">{data.info.group}</span>
                             <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">รอบที่ {data.info.evaluationRound}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        {score.totalScore.toFixed(2)}
                    </div>
                    <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Total Score</span>
                    <div className={`mt-2 px-6 py-1 rounded-full border text-sm font-bold ${getLevelColor(score.level)}`}>
                        {score.level}
                    </div>
                </div>
             </div>
        </div>

        {/* Filters / Tabs */}
        <div className="flex justify-center">
            <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm inline-flex">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'overview' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    <LayoutGrid size={16} /> ภาพรวม
                </button>
                <button
                    onClick={() => setActiveTab('part1')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'part1' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    <FileText size={16} /> ผลสัมฤทธิ์ (80%)
                </button>
                <button
                    onClick={() => setActiveTab('part2')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'part2' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    <Activity size={16} /> พฤติกรรม (20%)
                </button>
            </div>
        </div>

        {/* Dashboard Content */}
        <div className="min-h-[300px]">
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h4 className="font-bold text-slate-700 mb-4">สัดส่วนคะแนน</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={overviewData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" domain={[0, 80]} hide />
                                <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12, fontWeight: 600}} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={32}>
                                    {overviewData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h4 className="font-bold text-slate-700 mb-4">สมรรถนะ (Radar Chart)</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                <Radar name="Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 'part1' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3">ตัวชี้วัด</th>
                                    <th className="px-6 py-3 text-center">น้ำหนัก</th>
                                    <th className="px-6 py-3 text-center">คะแนนดิบ (5)</th>
                                    <th className="px-6 py-3 text-right">คะแนนจริง</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.part1.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            <span className="text-xs text-blue-500 mr-2">{item.id}</span>
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 text-center">{item.weight}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.score < 3 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                                {item.score}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-blue-600">
                                            {((item.score / 5) * item.weight).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'part2' && (
                <div className="grid gap-4 animate-fade-in">
                     {data.part2.map((sec) => (
                         <div key={sec.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                             <div>
                                 <h5 className="font-bold text-slate-800">{sec.name}</h5>
                                 <p className="text-xs text-slate-500">{sec.definition}</p>
                             </div>
                             <div className="text-right">
                                 <div className="text-xs text-slate-400">Score</div>
                                 <div className="text-lg font-bold text-emerald-600">
                                     {((sec.items.reduce((a, b) => a + b.score, 0) / (sec.items.length * 5)) * sec.weight).toFixed(2)}
                                     <span className="text-xs text-slate-400 font-normal"> / {sec.weight}</span>
                                 </div>
                             </div>
                         </div>
                     ))}
                </div>
            )}
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-8">
            <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className={`group relative flex items-center gap-3 px-10 py-4 rounded-full text-lg font-bold shadow-2xl transition-all transform hover:-translate-y-1 ${
                    isSubmitting 
                    ? 'bg-slate-400 cursor-wait' 
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-indigo-300 hover:shadow-indigo-400'
                }`}
            >
                {isSubmitting ? (
                    'กำลังบันทึกข้อมูล...'
                ) : (
                    <>
                    <Save className="w-6 h-6 group-hover:animate-bounce" />
                    ยืนยันการบันทึกผล
                    </>
                )}
            </button>
        </div>
    </div>
  );
};

export default Summary;