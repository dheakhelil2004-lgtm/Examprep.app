import { useState, useEffect } from "react";

const MODULES = [
  {
    id: "pedagogy",
    title: "علوم التربية والبيداغوجيا",
    subtitle: "المناهج وطرق التدريس",
    icon: "📚",
    color: "#16a34a",
    bg: "linear-gradient(135deg, #052e16 0%, #14532d 100%)",
    border: "#22c55e",
    lessons: [
      { id: "mbc", title: "المقاربة بالكفاءات (MBC)" },
      { id: "lesson-planning", title: "التخطيط للدروس ومذكرة التحضير" },
      { id: "evaluation", title: "التقييم التربوي وأنواعه" },
      { id: "teaching-methods", title: "طرائق التدريس الحديثة" },
      { id: "edu-psychology", title: "علم النفس التربوي" },
    ],
  },
  {
    id: "legislation",
    title: "التشريع المدرسي",
    subtitle: "القوانين والتنظيم المدرسي",
    icon: "⚖️",
    color: "#d97706",
    bg: "linear-gradient(135deg, #1c1003 0%, #451a03 100%)",
    border: "#f59e0b",
    lessons: [
      { id: "law-0804", title: "قانون التربية الوطنية 08-04" },
      { id: "school-rules", title: "النظام الداخلي للمؤسسة التربوية" },
      { id: "teacher-rights", title: "حقوق وواجبات المعلم" },
      { id: "civil-service", title: "قانون الوظيف العمومي" },
    ],
  },
  {
    id: "culture",
    title: "الثقافة العامة",
    subtitle: "تاريخ الجزائر والمنظومة التربوية",
    icon: "🌍",
    color: "#2563eb",
    bg: "linear-gradient(135deg, #030712 0%, #1e3a8a 100%)",
    border: "#3b82f6",
    lessons: [
      { id: "algeria-history", title: "تاريخ الجزائر — الثورة والاستقلال" },
      { id: "edu-system", title: "المنظومة التربوية الجزائرية" },
      { id: "edu-reforms", title: "إصلاحات التعليم في الجزائر" },
      { id: "algeria-geo", title: "جغرافيا الجزائر وتنوعها" },
    ],
  },
  {
    id: "classroom",
    title: "إدارة الفصل والتلاميذ",
    subtitle: "التعامل والتحفيز والاندماج",
    icon: "👨‍🏫",
    color: "#9333ea",
    bg: "linear-gradient(135deg, #0f0720 0%, #4a044e 100%)",
    border: "#a855f7",
    lessons: [
      { id: "class-management", title: "ضبط الفصل وأساليب التحفيز" },
      { id: "individual-differences", title: "الفروق الفردية بين التلاميذ" },
      { id: "inclusive-education", title: "التربية الدامجة" },
      { id: "motivation", title: "تحفيز التلاميذ على التعلم" },
    ],
  },
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);

  const [quizData, setQuizData] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  function saveProgress(id, passed) {
    setProgress({
      ...progress,
      [id]: passed ? "passed" : "attempted",
    });
  }

  function getModuleProgress(mod) {
    const total = mod.lessons.length;
    const passed = mod.lessons.filter((l) => progress[l.id] === "passed").length;
    return Math.round((passed / total) * 100);
  }

  function openLesson(mod, lesson) {
    setSelectedModule(mod);
    setSelectedLesson(lesson);
    setScreen("lesson");
  }

  async function startQuiz() {
    setScreen("quiz");
    setQuizAnswers({});
    setQuizSubmitted(false);
  }

  function submitQuiz() {
    if (!quizData?.questions) return;

    let correct = 0;
    quizData.questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) correct++;
    });

    const pct = Math.round((correct / quizData.questions.length) * 100);

    setScore(pct);
    setQuizSubmitted(true);

    saveProgress(selectedLesson.id, pct >= 60);
  }

  return (
    <div style={{direction:"rtl", padding:"30px", fontFamily:"Cairo"}}>
      <h1>🇩🇿 منصة التحضير لمسابقة الأساتذة</h1>

      {screen === "home" && (
        <div>
          {MODULES.map((mod) => (
            <div key={mod.id}>
              <h2>{mod.icon} {mod.title}</h2>
              <p>{mod.subtitle}</p>
              <button onClick={()=>{
                setSelectedModule(mod)
                setScreen("module")
              }}>
                فتح الدروس
              </button>
            </div>
          ))}
        </div>
      )}

      {screen === "module" && (
        <div>
          <button onClick={()=>setScreen("home")}>رجوع</button>
          <h2>{selectedModule.title}</h2>

          {selectedModule.lessons.map((lesson)=>(
            <div key={lesson.id}>
              <span>{lesson.title}</span>
              <button onClick={()=>openLesson(selectedModule,lesson)}>
                فتح
              </button>
            </div>
          ))}
        </div>
      )}

      {screen === "lesson" && (
        <div>
          <button onClick={()=>setScreen("module")}>رجوع</button>
          <h2>{selectedLesson.title}</h2>

          <p>
            هنا سيتم عرض ملخص الدرس بواسطة الذكاء الاصطناعي.
          </p>

          <button onClick={startQuiz}>
            ابدأ الاختبار
          </button>
        </div>
      )}

      {screen === "quiz" && (
        <div>
          <button onClick={()=>setScreen("lesson")}>رجوع</button>

          <h2>اختبار</h2>

          {quizData?.questions?.map((q,qi)=>(
            <div key={qi}>
              <p>{q.question}</p>

              {q.options.map((opt,oi)=>(
                <div key={oi}>
                  <button onClick={()=>setQuizAnswers({
                    ...quizAnswers,
                    [qi]:oi
                  })}>
                    {opt}
                  </button>
                </div>
              ))}
            </div>
          ))}

          <button onClick={submitQuiz}>
            إرسال الإجابات
          </button>

          {quizSubmitted && (
            <h3>النتيجة: {score}%</h3>
          )}
        </div>
      )}
    </div>
  )
}
