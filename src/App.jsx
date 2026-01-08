import { useState, useMemo, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  BarElement 
} from 'chart.js';
import { Doughnut, Radar, Bar } from 'react-chartjs-2';
import { 
  MessageCircle, Heart, Lock, CheckCircle2, Zap, Settings, 
  ArrowLeft, Users, Search, Bell, Clock, Calendar, Filter, Star, AlertTriangle,
  PlusCircle, PenLine, TrendingUp, History, User, Check, ChevronRight, ChevronLeft,
  RefreshCw, LogIn, ShieldAlert, Edit2, EyeOff
} from 'lucide-react';

// Chart.js 모든 요소 등록
ChartJS.register(
  ArcElement, Tooltip, Legend, RadialLinearScale, 
  PointElement, LineElement, CategoryScale, LinearScale, BarElement
);

// --- [유틸리티] 랜덤 닉네임 생성기 ---
const generateRandomNickname = () => {
  const adjs = ['신난', '배고픈', '졸린', '용감한', '똑똑한', '행복한', '즐거운', '수줍은', '엉뚱한', '날쌘'];
  const nouns = ['강아지', '고양이', '햄스터', '호랑이', '사자', '토끼', '펭귄', '다람쥐', '판다', '여우'];
  return `${adjs[Math.floor(Math.random() * adjs.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
};

const GRADES = [
  { id: 'grade_1', label: '1학년' },
  { id: 'grade_2', label: '2학년' },
  { id: 'grade_3', label: '3학년' },
  { id: 'grade_4', label: '4학년' },
  { id: 'grade_5', label: '5학년' },
  { id: 'grade_6', label: '6학년' },
  { id: 'parent', label: '학부모님' },
];

// --- [컴포넌트 0] 닉네임 게이트웨이 (입장 화면) ---
const Gateway = ({ onEnter }) => {
  const [nickname, setNickname] = useState(generateRandomNickname());
  const [selectedGrade, setSelectedGrade] = useState('grade_3'); 
  const [isChecking, setIsChecking] = useState(false);

  const handleRefreshName = () => {
    setNickname(generateRandomNickname());
  };

  const handleEnter = () => {
    if (!nickname.trim()) return alert("닉네임을 입력해줘!");
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      onEnter({ name: nickname, grade: selectedGrade });
    }, 600);
  };

  return (
    <div className="w-full max-w-md mx-auto h-screen bg-[#FFF9F0] flex flex-col items-center justify-center p-6 font-sans">
      <div className="text-center mb-10">
        <span className="text-4xl mb-2 block">🎒</span>
        <h1 className="text-3xl font-black text-gray-800 mb-2">우리들의 이야기</h1>
        <p className="text-gray-500 text-sm">친구들과 안전하게 소통하는 공간</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg w-full space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">나의 닉네임</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:border-orange-300 transition-colors"
            />
            <button 
              onClick={handleRefreshName}
              className="p-3 bg-orange-50 text-orange-500 rounded-2xl border border-orange-100 hover:bg-orange-100 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 ml-1">* 친구들이 부르기 쉬운 이름으로 정해봐!</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">나는 누구인가요?</label>
          <div className="grid grid-cols-3 gap-2">
            {GRADES.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGrade(g.id)}
                className={`py-2 rounded-xl text-xs font-bold transition-all border-2 ${selectedGrade === g.id ? 'bg-blue-50 border-blue-400 text-blue-600' : 'bg-white border-gray-100 text-gray-400'}`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleEnter}
          disabled={isChecking}
          className="w-full py-4 bg-gray-800 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          {isChecking ? '확인 중...' : <><LogIn className="w-5 h-5" /> 입장하기</>}
        </button>
      </div>
    </div>
  );
};

// --- [컴포넌트 1] 메인 방 리스트 화면 ---
const RoomList = ({ currentUser, onUpdateUser, onSelectRoom, onGoToSuggest }) => {
  const [showClosed, setShowClosed] = useState(false); 
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(currentUser.name);

  // 목업 데이터
  const rooms = [
    { 
      id: 201, 
      title: '🏫 우리 반 반장 선거, 어떤 리더가 좋아?', 
      content: '새 학기 반장 선거! 너희는 어떤 스타일의 반장을 원해?',
      type: 'multi_choice_discuss', 
      tags: ['HOT', '학교생활', '투표'], 
      participants: 156, 
      comments: 32, 
      status: 'OPEN', 
      bg: 'bg-purple-100',
      icon: '👑',
      endDate: '상시',
      allowedGrades: 'all',
      showResults: true, // 결과 공개
      chartType: 'bar',
      questions: [
        { id: 'q1', text: '리더십 스타일', options: ['카리스마 대장', '다정한 서포터', '재밌는 분위기 메이커', '모범생 스타일'] },
        { id: 'q2', text: '공약 1순위는?', options: ['숙제 줄이기', '체육 시간 늘리기', '맛있는 간식', '자리 바꾸기'] },
      ]
    },
    { 
      id: 105, 
      title: '🚌 수학여행 스타일 (성향 분석)', 
      content: '나의 여행 스타일을 분석해줄게! 친구랑 비교해봐.',
      type: 'multi_choice_discuss', 
      tags: ['심리테스트', '수학여행'], 
      participants: 215, 
      comments: 68, 
      status: 'OPEN', 
      bg: 'bg-teal-100',
      icon: '✈️',
      endDate: '10.28',
      allowedGrades: 'all',
      showResults: true, // 결과 공개
      chartType: 'radar',
      questions: [
        { id: 'q1', text: '버스 옆자리, 누가 좋아?', options: ['재밌는 수다쟁이', '조용히 자는 친구'] },
        { id: 'q2', text: '자유시간에는?', options: ['철저한 계획파', '즉흥적인 자유파'] },
        { id: 'q3', text: '숙소에 도착하면?', options: ['짐부터 정리해', '침대부터 누워'] },
        { id: 'q4', text: '기념품 살 때?', options: ['가성비가 최고', '이쁘면 다 사!'] },
      ]
    },
    { 
      id: 501, 
      title: '🤐 [비공개 투표] 선생님께 바라는 점', 
      content: '선생님한테 하고 싶은 말 솔직하게 투표해줘! 결과는 선생님만 볼 수 있어.',
      type: 'choice_discuss', 
      tags: ['비밀', '소원수리'], 
      participants: 28, 
      comments: 0, 
      status: 'OPEN', 
      bg: 'bg-gray-200',
      icon: '🤫', 
      endDate: '오늘까지',
      allowedGrades: 'all',
      showResults: false, // 결과 비공개 (중요!)
      chartType: 'doughnut',
      questions: [
        { id: 'q1', text: '가장 원하는 것은?', options: ['쉬는 시간 연장', '숙제 없는 날', '자리 바꾸기', '체육 대회'] }
      ]
    }
  ];

  const checkPermission = (room) => {
    if (room.allowedGrades === 'all') return true;
    return room.allowedGrades.includes(currentUser.grade);
  };

  const finalRoomList = rooms.filter(room => showClosed ? room.status === 'CLOSED' : room.status === 'OPEN');
  
  const handleNameSave = () => {
    if (newName.trim()) {
      onUpdateUser({ ...currentUser, name: newName });
      setIsEditingName(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#FFF9F0] h-full flex flex-col font-sans">
      <div className="bg-white px-5 pt-6 pb-4 sticky top-0 z-10 rounded-b-3xl shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-1 mb-1">
               <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                 {GRADES.find(g => g.id === currentUser.grade)?.label}
               </span>
               {isEditingName ? (
                 <div className="flex items-center gap-1">
                   <input 
                     className="w-20 text-xs border-b border-orange-300 focus:outline-none" 
                     value={newName} 
                     onChange={(e) => setNewName(e.target.value)}
                     autoFocus
                   />
                   <button onClick={handleNameSave} className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded">저장</button>
                 </div>
               ) : (
                 <button onClick={() => setIsEditingName(true)} className="flex items-center gap-1 group">
                   <span className="text-xs text-orange-400 font-extrabold tracking-wider group-hover:underline">{currentUser.name}님</span>
                   <Edit2 className="w-3 h-3 text-gray-300 group-hover:text-orange-400" />
                 </button>
               )}
            </div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">와글와글 광장</h1>
          </div>
          <div className="flex gap-2">
             <button onClick={onGoToSuggest} className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 active:scale-95 transition-transform">
               <PlusCircle className="w-6 h-6 mb-0.5" />
               <span className="text-[9px] font-bold">제안</span>
             </button>
             <button onClick={() => setShowClosed(!showClosed)} className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl border active:scale-95 transition-transform ${showClosed ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-400 border-gray-100'}`}>
               {showClosed ? <ArrowLeft className="w-6 h-6 mb-0.5" /> : <History className="w-6 h-6 mb-0.5" />}
               <span className="text-[9px] font-bold">{showClosed ? '돌아가기' : '지난이야기'}</span>
             </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {finalRoomList.map(room => {
          const hasPermission = checkPermission(room);
          return (
            <div 
              key={room.id} 
              onClick={() => onSelectRoom(room, hasPermission)}
              className={`rounded-3xl p-5 shadow-sm border-2 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden ${!hasPermission ? 'bg-gray-50 border-gray-200' : 'bg-white border-orange-100 hover:border-orange-300 hover:shadow-md'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-1.5 flex-wrap">
                  {!hasPermission ? (
                     <span className="text-[10px] px-2.5 py-1 rounded-full font-black bg-gray-200 text-gray-500 flex items-center gap-1">
                       <Lock className="w-3 h-3" /> 참여불가 (구경만)
                     </span>
                  ) : (
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-black bg-green-100 text-green-600 flex items-center gap-1 shadow-sm">
                       진행중 🔥
                    </span>
                  )}
                  {!room.showResults && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-black bg-gray-800 text-white flex items-center gap-1">
                       <EyeOff className="w-3 h-3" /> 비공개
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${room.bg} ${!hasPermission && 'grayscale opacity-50'}`}>
                  {room.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-black text-lg leading-tight mb-1 ${!hasPermission ? 'text-gray-400' : 'text-gray-800'}`}>{room.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1 font-medium">{room.content}</p>
                  
                  <div className="flex items-center gap-3 mt-3">
                     <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                       <Users className="w-3 h-3" /> {room.participants}명
                     </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div className="h-10"></div>
      </div>
    </div>
  );
};

// --- [컴포넌트 2] 주제 제안하기 화면 ---
const SuggestTopic = ({ onBack }) => {
  const [suggestion, setSuggestion] = useState('');

  const handleSubmit = () => {
    if (!suggestion.trim()) return alert('내용을 입력해줘!');
    alert('제안해줘서 고마워! 선생님이 꼭 읽어볼게 😊');
    onBack();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white h-full flex flex-col font-sans">
      <div className="px-5 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="font-black text-lg text-gray-800">주제 제안하기</h2>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="bg-orange-50 p-5 rounded-2xl mb-6">
          <h3 className="font-bold text-orange-600 mb-2 flex items-center gap-2">
            <PenLine className="w-5 h-5" /> 어떤 이야기가 하고 싶어?
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            "급식 메뉴 정하고 싶어요!"<br/>
            "체육대회 종목 투표해요!"<br/>
            친구들과 나누고 싶은 주제가 있다면 자유롭게 적어줘.
          </p>
        </div>

        <textarea 
          className="w-full h-48 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-orange-300 focus:bg-white transition-colors outline-none resize-none text-gray-700 font-medium"
          placeholder="여기에 적어주면 돼!"
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
        ></textarea>

        <button 
          onClick={handleSubmit}
          className="mt-auto w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-md active:scale-95 transition-transform"
        >
          제안 보내기 💌
        </button>
      </div>
    </div>
  );
};

// --- [컴포넌트 3] 상세 이야기방 화면 ---
const DiscussionRoom = ({ roomData, canParticipate, currentUser, onBack }) => {
  const isClosed = roomData.status === 'CLOSED';
  const isReadOnly = !canParticipate || isClosed; 

  const initialTab = (roomData.questions && roomData.questions.length > 0 && !isReadOnly) ? 'vote' : 'discuss';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [isVoted, setIsVoted] = useState(isReadOnly); 
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [myVotes, setMyVotes] = useState({});
  const [commentInput, setCommentInput] = useState('');

  // 차트 데이터 (레이더)
  const radarData = {
    labels: ['수다력', '계획성', '체력', '소비성향', '감성'],
    datasets: [
      {
        label: '나의 스타일',
        data: [90, 40, 70, 85, 60],
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 2,
      },
    ],
  };

  const radarOptions = {
    scales: { r: { min: 0, max: 100, ticks: { display: false } } },
    plugins: { legend: { position: 'bottom' } }
  };

  const [comments, setComments] = useState([
    { id: 101, name: '즐거운 강아지', colorClass: 'text-orange-500', timeStr: '10분 전', content: '난 무조건 쉬는 시간이 좋아!', likes: 5, likedByMe: false },
    { id: 102, name: '졸린 고양이', colorClass: 'text-blue-500', timeStr: '5분 전', content: '공감해 ㅋㅋ', likes: 2, likedByMe: false },
  ]);

  const handleVoteChange = (questionId, option) => {
    if (isReadOnly) return;
    setMyVotes(prev => ({ ...prev, [questionId]: option }));
    if (currentQIdx < roomData.questions.length - 1) {
      setTimeout(() => setCurrentQIdx(prev => prev + 1), 300);
    }
  };

  const submitVote = () => {
    setIsVoted(true);
    setCurrentQIdx(0);
  };

  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return;
    setComments(prev => [{
      id: Date.now(), name: `${currentUser.name} (나)`, colorClass: 'text-black font-bold', timeStr: '방금', content: commentInput, likes: 0, likedByMe: false
    }, ...prev]);
    setCommentInput('');
  };

  // 좋아요 토글 함수
  const toggleLike = (id) => {
    setComments(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          likes: c.likedByMe ? c.likes - 1 : c.likes + 1,
          likedByMe: !c.likedByMe
        };
      }
      return c;
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#FFF9F0] h-full flex flex-col relative font-sans">
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-3 sticky top-0 z-30 shadow-sm rounded-b-3xl">
        <button onClick={onBack} className="p-2 hover:bg-orange-50 rounded-full transition-colors text-gray-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center">
            <span className="text-sm font-black text-gray-800 tracking-tight line-clamp-1">{roomData.title}</span>
        </div>
      </div>

      {!canParticipate && (
        <div className="bg-gray-800 text-white text-xs px-4 py-3 text-center font-bold sticky top-[60px] z-20 shadow-md flex justify-center items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> 
          참여 권한이 없어. (구경만 가능해! 👀)
        </div>
      )}

      <div className="flex-1 overflow-y-auto relative p-4 pb-20">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 mb-4">
           <h1 className="text-xl font-black text-gray-800 mb-4 leading-snug">{roomData.title}</h1>
           <div className="bg-orange-50 p-4 rounded-2xl text-sm text-gray-700 leading-relaxed font-medium">
             {roomData.content}
           </div>
        </div>

        <div className="bg-gray-200 p-1 rounded-2xl flex mb-6">
          {roomData.questions?.length > 0 && (
            <button onClick={() => setActiveTab('vote')} className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'vote' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}>
              📊 투표 {isReadOnly || isVoted ? '결과' : '하기'}
            </button>
          )}
          <button onClick={() => setActiveTab('discuss')} className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'discuss' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}>
             🗣️ 와글와글 댓글
          </button>
        </div>

        {activeTab === 'vote' && (
          <div className="animate-fade-in bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             {(!isVoted && !isReadOnly) ? (
                <div>
                   <div className="mb-6">
                     <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                       <span>문제 {currentQIdx + 1}</span>
                       <span>{roomData.questions.length}개 중</span>
                     </div>
                     <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-orange-400 transition-all duration-300 ease-out" style={{ width: `${((currentQIdx + 1) / roomData.questions.length) * 100}%` }}></div>
                     </div>
                   </div>
                   <h4 className="font-black text-xl text-gray-800 mb-6 text-center leading-snug">
                     Q{currentQIdx + 1}. <br/><span className="text-orange-600">{roomData.questions[currentQIdx].text}</span>
                   </h4>
                   <div className="space-y-3">
                      {roomData.questions[currentQIdx].options.map((opt, idx) => (
                        <button key={idx} onClick={() => handleVoteChange(roomData.questions[currentQIdx].id, opt)} className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all shadow-sm font-bold ${myVotes[roomData.questions[currentQIdx].id] === opt ? 'bg-orange-50 border-orange-400 text-orange-700' : 'bg-white border-gray-100 text-gray-600'}`}>
                           {opt} {myVotes[roomData.questions[currentQIdx].id] === opt && <Check className="w-4 h-4 inline ml-2"/>}
                        </button>
                      ))}
                   </div>
                   {currentQIdx === roomData.questions.length - 1 && (
                      <button onClick={submitVote} disabled={!myVotes[roomData.questions[currentQIdx].id]} className="w-full mt-6 py-3 bg-black text-white rounded-2xl font-black text-lg shadow-md">결과 보기 🎉</button>
                   )}
                </div>
             ) : (
                <div className="text-center">
                    {/* 3. 비공개 결과 처리 */}
                    {!roomData.showResults ? (
                       <div className="py-10">
                         <div className="text-4xl mb-4">🤫</div>
                         <h4 className="font-black text-xl text-gray-800 mb-2">참여 완료!</h4>
                         <p className="text-sm text-gray-500">결과는 선생님만 볼 수 있어.</p>
                       </div>
                    ) : (
                       // 결과 공개 방 (모든 문제 결과 출력)
                       <div className="space-y-8">
                          <div className="text-center mb-6">
                             <h4 className="font-black text-xl text-gray-800 mb-1">투표 결과</h4>
                             <p className="text-xs text-gray-400">친구들의 생각은 이래!</p>
                          </div>

                          {roomData.chartType === 'radar' ? (
                             <div className="h-64 flex justify-center"><Radar data={radarData} options={radarOptions} /></div>
                          ) : (
                             // 막대 그래프 형태로 모든 질문 렌더링
                             roomData.questions.map((q, idx) => (
                               <div key={idx} className="text-left">
                                  <h5 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                                     <span className="bg-orange-100 text-orange-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">Q{idx+1}</span>
                                     {q.text}
                                  </h5>
                                  <div className="space-y-2 pl-2">
                                     {q.options.map((opt, i) => {
                                        // 임의의 퍼센트 생성
                                        const mockPercent = [45, 30, 15, 10][i % 4] || 25; 
                                        return (
                                           <div key={i} className="relative h-8 bg-gray-50 rounded-lg overflow-hidden flex items-center px-3">
                                              <div className="absolute left-0 top-0 bottom-0 bg-blue-100 opacity-50" style={{ width: `${mockPercent}%` }}></div>
                                              <span className="relative z-10 text-xs font-bold text-gray-600 flex-1">{opt}</span>
                                              <span className="relative z-10 text-xs text-gray-400">{mockPercent}%</span>
                                           </div>
                                        )
                                     })}
                                  </div>
                               </div>
                             ))
                          )}
                       </div>
                    )}
                </div>
             )}
          </div>
        )}

        {activeTab === 'discuss' && (
          <div className="animate-fade-in space-y-4">
             {canParticipate ? (
               <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-xs font-bold text-gray-600">{currentUser.name}</span>
                  </div>
                  <textarea 
                    value={commentInput} 
                    onChange={(e) => setCommentInput(e.target.value)} 
                    rows="2" 
                    placeholder="친구들에게 예쁜 말을 남겨줘!"
                    className="w-full text-sm border-none focus:ring-0 resize-none p-0 outline-none placeholder-gray-300"
                  ></textarea>
                  <div className="flex justify-end mt-2">
                      <button onClick={handleCommentSubmit} className="px-4 py-1.5 rounded-xl text-xs font-bold bg-orange-500 text-white shadow-md active:scale-95">등록</button>
                  </div>
               </div>
             ) : (
               <div className="bg-gray-100 p-4 rounded-3xl text-center border border-gray-200">
                 <p className="text-xs text-gray-500 font-bold">🔒 이 방에서는 댓글을 쓸 수 없어.</p>
               </div>
             )}

             <div className="space-y-3">
                {comments.map(c => (
                  <div key={c.id} className="bg-white p-4 rounded-3xl shadow-sm border border-transparent">
                      <div className="flex items-center gap-2 mb-1">
                          <span className={`font-bold text-xs ${c.colorClass}`}>{c.name}</span>
                          <span className="text-[10px] text-gray-300">{c.timeStr}</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium leading-relaxed">{c.content}</p>
                      <div className="flex justify-end mt-1">
                         {/* 5. 좋아요 하트 버튼 */}
                         <button 
                           onClick={() => toggleLike(c.id)}
                           className={`flex items-center gap-1 text-xs transition-colors ${c.likedByMe ? 'text-red-500' : 'text-gray-300 hover:text-red-300'}`}
                         >
                           <Heart className={`w-3 h-3 ${c.likedByMe ? 'fill-current' : ''}`} /> 
                           {c.likes}
                         </button>
                      </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- [메인 App] ---
export default function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  const [currentView, setCurrentView] = useState('gateway'); 
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [canParticipate, setCanParticipate] = useState(false);

  const handleEnterGateway = (userInfo) => {
    setCurrentUser(userInfo);
    setCurrentView('list');
  };

  const handleUpdateUser = (newUserInfo) => {
    setCurrentUser(newUserInfo);
  };

  const handleSelectRoom = (room, hasPermission) => {
    setSelectedRoom(room);
    setCanParticipate(hasPermission); 
    setCurrentView('room');
  };

  const renderView = () => {
    switch(currentView) {
      case 'gateway':
        return <Gateway onEnter={handleEnterGateway} />;
      case 'list':
        return (
          <RoomList 
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
            onSelectRoom={handleSelectRoom}
            onGoToSuggest={() => setCurrentView('suggest')}
          />
        );
      case 'room':
        return (
          <DiscussionRoom 
            roomData={selectedRoom} 
            canParticipate={canParticipate} 
            currentUser={currentUser}
            onBack={() => setCurrentView('list')} 
          />
        );
      case 'suggest':
        return (
          <SuggestTopic 
            onBack={() => setCurrentView('list')}
          />
        );
      default:
        return <div>Error</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-gray-800 font-sans flex justify-center">
      {renderView()}
    </div>
  );
}

