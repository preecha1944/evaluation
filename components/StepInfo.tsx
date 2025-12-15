import React from 'react';
import { EmployeeInfo } from '../types';
import { JOB_GROUPS } from '../constants';
import { User, Calendar, Briefcase, Building2 } from 'lucide-react';

interface Props {
  data: EmployeeInfo;
  onChange: (data: EmployeeInfo) => void;
}

const StepInfo: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-50 to-white px-8 py-6 border-b border-indigo-50">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
             <User className="w-6 h-6" />
          </div>
          ข้อมูลผู้รับการประเมิน
        </h2>
        <p className="text-slate-500 mt-1 ml-12 text-sm">กรอกข้อมูลส่วนตัวและรายละเอียดการจ้างงาน</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section: Evaluation Period */}
          <div className="col-span-1 md:col-span-2 space-y-4">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">รอบการประเมิน</label>
             <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="md:col-span-4">
                    <select
                        name="evaluationRound"
                        value={data.evaluationRound}
                        onChange={handleChange}
                        className="w-full h-11 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none bg-white transition-all"
                    >
                        <option value="">เลือกครั้งที่...</option>
                        <option value="1">ครั้งที่ 1 (1 ต.ค. - 31 มี.ค.)</option>
                        <option value="2">ครั้งที่ 2 (1 เม.ย. - 30 ก.ย.)</option>
                    </select>
                </div>
                <div className="md:col-span-8 flex items-center gap-3">
                    <div className="relative flex-1">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            name="periodStart"
                            value={data.periodStart}
                            onChange={handleChange}
                            className="w-full h-11 pl-10 pr-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                        />
                    </div>
                    <span className="text-slate-400 text-sm">ถึง</span>
                    <div className="relative flex-1">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            name="periodEnd"
                            value={data.periodEnd}
                            onChange={handleChange}
                            className="w-full h-11 pl-10 pr-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                        />
                    </div>
                </div>
             </div>
          </div>

          {/* Section: Personal Info */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-12 gap-6">
             <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-slate-700 mb-2">คำนำหน้า</label>
                <select
                    name="prefix"
                    value={data.prefix}
                    onChange={handleChange}
                    className="w-full h-11 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                >
                    <option value="">เลือก...</option>
                    <option value="นาย">นาย</option>
                    <option value="นาง">นาง</option>
                    <option value="นางสาว">นางสาว</option>
                </select>
             </div>
             <div className="md:col-span-9">
                <label className="block text-sm font-semibold text-slate-700 mb-2">ชื่อ-นามสกุล</label>
                <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    placeholder="ระบุชื่อและนามสกุล"
                    className="w-full h-11 px-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                />
             </div>
          </div>

          {/* Section: Job Details */}
          <div className="col-span-1 md:col-span-2 border-t border-slate-100 pt-6">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">ข้อมูลตำแหน่ง</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">ตำแหน่ง</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            name="position"
                            value={data.position}
                            readOnly
                            className="w-full h-11 pl-10 pr-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-medium cursor-not-allowed"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">กลุ่มงาน</label>
                    <select
                        name="group"
                        value={data.group}
                        onChange={handleChange}
                        className="w-full h-11 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                    >
                        <option value="">เลือกกลุ่มงาน...</option>
                        {JOB_GROUPS.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>
                <div className="md:col-span-2">
                     <label className="block text-sm font-semibold text-slate-700 mb-2">สังกัด</label>
                     <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900 font-medium">
                        <Building2 className="w-5 h-5 text-indigo-500" />
                        {data.department}
                     </div>
                </div>
            </div>
          </div>

          {/* Evaluator */}
          <div className="col-span-1 md:col-span-2 bg-slate-50 p-6 rounded-xl border border-slate-200">
             <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span> ข้อมูลผู้ประเมิน
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">ชื่อผู้บังคับบัญชา/ผู้ประเมิน</label>
                    <input
                        type="text"
                        name="evaluatorName"
                        value={data.evaluatorName}
                        onChange={handleChange}
                        className="w-full h-10 px-3 border border-slate-300 rounded-lg bg-white"
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">ตำแหน่ง</label>
                    <input
                        type="text"
                        name="evaluatorPosition"
                        value={data.evaluatorPosition}
                        onChange={handleChange}
                        className="w-full h-10 px-3 border border-slate-300 rounded-lg bg-white"
                        readOnly
                    />
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StepInfo;