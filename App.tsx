import React, { useState, useEffect, useMemo } from 'react';
import { 
  EmployeeInfo, 
  KPIItem, 
  CompetencySection, 
  EvaluationData,
  ScoreSummary,
  EvaluationLevel
} from './types';
import { INITIAL_KPI_DATA, INITIAL_COMPETENCY_DATA } from './constants';
import StepInfo from './components/StepInfo';
import StepPart1 from './components/StepPart1';
import StepPart2 from './components/StepPart2';
import Summary from './components/Summary';
import { ChevronRight, ChevronLeft, LayoutDashboard, UserCheck, FileBarChart, CheckCircle2 } from 'lucide-react';
import { submitEvaluation } from './services/googleSheetService';
import Swal from 'sweetalert2';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [info, setInfo] = useState<EmployeeInfo>({
    evaluationRound: "1",
    periodStart: "",
    periodEnd: "",
    prefix: "",
    name: "",
    position: "พนักงานราชการ",
    group: "",
    department: "ศูนย์การศึกษาพิเศษ ประจำจังหวัดปทุมธานี",
    evaluatorName: "นางสาวภัทรภร หมื่นมะเริง",
    evaluatorPosition: "ผู้อำนวยการสถานศึกษา"
  });

  const [part1Items, setPart1Items] = useState<KPIItem[]>(INITIAL_KPI_DATA);
  const [part2Sections, setPart2Sections] = useState<CompetencySection[]>(INITIAL_COMPETENCY_DATA);

  const scoreSummary: ScoreSummary = useMemo(() => {
    // PART 1: Achievement (Weighted to 80%)
    // Base Calculation: Sum of ((Score/5) * Weight)
    // The weights in constants now sum to 100 exactly (15+15+15+15+20+10+10 = 100).
    // So this calculates the score out of 100 directly.
    const part1ScoreOutOf100 = part1Items.reduce((acc, item) => {
        return acc + (item.score / 5) * item.weight;
    }, 0);
    
    // Apply 80% weight for final summary
    const finalPart1 = (part1ScoreOutOf100 * 80) / 100;


    // PART 2: Competency (Weighted to 20%)
    // Base Calculation: Sum of weighted scores for each section.
    // The weights in constants sum to 100 (20+10+20+20+10+10+10 = 100).
    let part2ScoreOutOf100 = 0;

    part2Sections.forEach(sec => {
        const currentScore = sec.items.reduce((a, b) => a + b.score, 0);
        const maxScore = sec.items.length * 5;
        // Formula per section: (RawScore / MaxScore) * SectionWeight
        const secWeighted = (currentScore / maxScore) * sec.weight;
        part2ScoreOutOf100 += secWeighted;
    });

    // Apply 20% weight for final summary
    const finalPart2 = (part2ScoreOutOf100 * 20) / 100;

    // Total
    const total = finalPart1 + finalPart2;

    // Level
    let level = EvaluationLevel.IMPROVE;
    if (total >= 95) level = EvaluationLevel.OUTSTANDING;
    else if (total >= 85) level = EvaluationLevel.VERY_GOOD;
    else if (total >= 75) level = EvaluationLevel.GOOD;
    else if (total >= 65) level = EvaluationLevel.FAIR;

    return {
        part1Raw: part1ScoreOutOf100, // Normalized to 100 base
        part1Weighted: finalPart1,    // Scaled to 80
        part1FullScore: 80,
        part2Raw: part2ScoreOutOf100, // Normalized to 100 base
        part2Weighted: finalPart2,    // Scaled to 20
        totalScore: total,
        level
    };
  }, [part1Items, part2Sections]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    Swal.fire({
        title: 'กำลังบันทึกข้อมูล...',
        text: 'กรุณารอสักครู่ ห้ามปิดหน้าต่างนี้',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const fullData: EvaluationData = {
            info,
            part1: part1Items,
            part2: part2Sections
        };

        await submitEvaluation(fullData, scoreSummary);

        Swal.fire({
            icon: 'success',
            title: 'บันทึกสำเร็จ!',
            text: 'ผลการประเมินถูกบันทึกลงในระบบเรียบร้อยแล้ว',
            confirmButtonColor: '#4f46e5'
        }).then(() => {
            window.location.reload();
        });

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถเชื่อมต่อกับ Google Sheet ได้ กรุณาลองใหม่',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { id: 1, title: 'ข้อมูลผู้รับการประเมิน', icon: UserCheck },
    { id: 2, title: 'ผลสัมฤทธิ์ของงาน', icon: FileBarChart },
    { id: 3, title: 'สมรรถนะ', icon: CheckCircle2 },
    { id: 4, title: 'สรุปผล', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sarabun text-slate-800">
      {/* Modern Glass Header */}
      <header className="glass sticky top-0 z-20 border-b border-slate-200/60 shadow-sm backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-2.5 rounded-xl text-white shadow-indigo-200 shadow-lg">
                    <LayoutDashboard size={24} />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-800 leading-tight">ระบบประเมินผลพนักงานราชการ</h1>
                    <p className="text-[10px] text-slate-500 font-medium tracking-wide">ศูนย์การศึกษาพิเศษ ประจำจังหวัดปทุมธานี</p>
                </div>
            </div>
            <div className="hidden md:block text-right">
                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Developed By</p>
                <p className="text-sm font-semibold text-indigo-600">นายปรีชา มหาวัน</p>
            </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Modern Stepper */}
        <div className="mb-10 mx-auto max-w-3xl">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
            <div 
                className="absolute top-1/2 left-0 h-1 bg-indigo-500 -z-10 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>
            
            {steps.map((step) => {
              const isActive = currentStep >= step.id;
              const isCurrent = currentStep === step.id;
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center group cursor-default">
                  <div 
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 ${
                      isActive 
                        ? 'bg-indigo-600 border-white text-white shadow-lg shadow-indigo-200 scale-105' 
                        : 'bg-white border-slate-200 text-slate-400'
                    } ${isCurrent ? 'ring-4 ring-indigo-100' : ''}`}
                  >
                    <Icon size={isCurrent ? 20 : 18} strokeWidth={2.5} />
                  </div>
                  <span className={`mt-2 text-xs font-bold transition-colors duration-300 hidden md:block ${
                    isActive ? 'text-indigo-700' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Card */}
        <div className="transition-all duration-500 ease-in-out">
            {currentStep === 1 && <StepInfo data={info} onChange={setInfo} />}
            {currentStep === 2 && <StepPart1 items={part1Items} onChange={setPart1Items} />}
            {currentStep === 3 && <StepPart2 sections={part2Sections} onChange={setPart2Sections} />}
            {currentStep === 4 && (
              <Summary 
                data={{ info, part1: part1Items, part2: part2Sections }} 
                score={scoreSummary} 
                onSubmit={handleSubmit} 
                isSubmitting={isSubmitting} 
              />
            )}
        </div>

        {/* Floating Navigation */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-slate-200 md:relative md:bg-transparent md:border-0 md:p-0 mt-8 z-30">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                        currentStep === 1 
                        ? 'opacity-0 pointer-events-none' 
                        : 'text-slate-600 hover:bg-white hover:shadow-md active:scale-95'
                    }`}
                >
                    <span className="flex items-center gap-2"><ChevronLeft size={18} /> ย้อนกลับ</span>
                </button>
                
                {currentStep < 4 ? (
                    <button
                        onClick={nextStep}
                        className="px-8 py-2.5 bg-indigo-600 text-white rounded-full font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-95 transition-all flex items-center gap-2"
                    >
                        ถัดไป <ChevronRight size={18} />
                    </button>
                ) : null}
            </div>
        </div>
      </main>

      <div className="md:hidden h-20"></div> {/* Spacer for fixed bottom nav */}
    </div>
  );
}

export default App;