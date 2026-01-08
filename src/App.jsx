import { useState, useMemo, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement 
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { 
  MessageCircle, Heart, Lock, CheckCircle2, Zap, Settings, 
  ArrowLeft, Users, Search, Bell, Clock, Calendar, Filter, Star, AlertTriangle,
  PlusCircle, PenLine, TrendingUp, History, User, Check, ChevronRight, ChevronLeft,
  RefreshCw, LogIn, ShieldAlert, Edit2, EyeOff, CheckSquare
} from 'lucide-react';

// Chart.js 요소 등록 (Radar 관련 요소 제거)
ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement
);

// --- [유틸리티] 랜덤 닉네임 생성기 ---
const generateRandomNickname = () => {
  const adjs = ['신난', '배고픈', '졸린', '용감한', '똑똑한', '행복한', '즐거운', '수줍은', '엉뚱한', '날쌘'];
  const nouns = ['강아지', '고양이', '햄스터', '호랑이', '사자', '토끼', '펭귄', '다람쥐', '판다', '여우'];
  return `${adjs[Math.floor(Math.random() * adjs.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
};

// --- [컴포넌트 0] 닉네임 게이트웨이 (입장 화면) ---
const Gateway = ({ onEnter }) => {
  const [nickname, setNickname] = useState(generateRandomNickname());
  const [isChecked, setIsChecked] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleRefreshName = () => {
    setNickname(generateRandomNickname());
    setIsChecked(false);
  };

  const handleChangeName = (e) => {
    const val = e.target.value;
    if (val.length <= 6) {
      setNickname(val);
      setIsChecked(false);
    }
  };

  const handleCheckDuplicate = () => {
    if (!nickname.trim()) return alert("닉네임을 입력해줘!");
    if (nickname.length < 2) return alert("닉네임은 두 글자 이상이어야 해!");
    
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setIsChecked(true);
      alert("사용 가능한 닉네임이야! 😎");
    }, 500);
  };

  const handleEnter = () => {
    if (!isChecked) return alert("닉네임 중복확인을 먼저 해줘!");
    onEnter({ name: nickname, grade: 'all' });
  };

  return (
    <div className="w-full max-w-md mx-auto h-screen bg-[#FFF9F0] flex flex-col justify-center p-6 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-black text-gray-800 leading-tight">
            안녕하세요,<br/>
            <span className="text-orange-500">아이부자 회원들</span>과 다양한 이야기를<br/>
            나눌 수 있는 <span className="text-blue-500">이야기 광장</span>입니다.
          </h1>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            이야기 광장에서 사용할 닉네임을 우선 설정해주세요.<br/>
            <span className="font-bold text-gray-800">이소연</span> 님을 표현할 닉네임이에요.
          </p>
        </div>

        <div>
          <div className="flex gap-2 items-center mb-2">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={nickname}
                onChange={handleChangeName}
                placeholder="닉네임 입력"
                className={`w-full bg-gray-50 border-2 rounded-2xl px-4 py-4 font-bold text-gray-800 text-lg focus:outline-none focus:bg-white transition-colors ${isChecked ? 'border-green-400' : 'border-gray-200 focus:border-orange-300'}`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">
                {nickname.length}/6
              </span>
            </div>
            <button 
              onClick={handleRefreshName}
              className="p-4 bg-orange-50 text-orange-500 rounded-2xl border border-orange-100 hover:bg-orange-100 transition-colors active:scale-95"
              title="새로운 닉네임 추천"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>
          <p className="text-[11px] text-gray-400 pl-1">
            * 최대 6글자까지 입력할 수 있어.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <button 
            onClick={handleCheckDuplicate}
            disabled={isChecked || !nickname}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${isChecked ? 'bg-green-100 text-green-700 cursor-default' : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {isChecking ? '확인 중...' : isChecked ? '사용 가능 체크 완료! ✅' : '중복확인'}
          </button>

          <button 
            onClick={handleEnter}
            disabled={!isChecked}
            className={`w-full py-4 rounded-2xl font-black text-lg shadow-md transition-all flex items-center justify-center gap-2 ${isChecked ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            입장하기 <LogIn className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- [컴포넌트 1] 메인 방 리스트 화면 ---
const RoomList = ({ currentUser, onUpdateUser, onSelectRoom, onGoToSuggest }) => {
  const [showClosed, setShowClosed] = useState(false); 
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(currentUser.name);
  
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortMode, setSortMode] = useState('newest');

  // 목업 데이터
  const rooms = [
    { 
      id: 201, 
      title: '우리 반 반장 선거, 어떤 리더가 좋아?', 
      content: '새 학기 반장 선거! 너희는 어떤 스타일의 반장을 원해?',
      type: 'multi_choice_discuss', 
      tags: ['HOT', '학교생활', '투표'], 
      participants: 156, 
      comments: 32, 
      status: 'OPEN', 
      hasParticipated: true,
      bg: 'bg-purple-100',
      icon: '👑',
      endDate: '상시',
      allowedGrades: 'all',
      showResults: true, 
      chartType: 'bar', // 막대 그래프
      questions: [
        { id: 'q1', text: '리더십 스타일', options: ['카리스마 대장', '다정한 서포터', '재밌는 분위기 메이커', '모범생 스타일'] },
        { id: 'q2', text: '공약 1순위는?', options: ['숙제 줄이기', '체육 시간 늘리기', '맛있는 간식', '자리 바꾸기'] },
      ]
    },
    { 
      id: 105, 
      title: '수학여행 스타일 (성향 분석)', 
      content: '나의 여행 스타일을 분석해줄게! 친구랑 비교해봐.',
      type: 'multi_choice_discuss', 
      tags: ['심리테스트', '수학여행'], 
      participants: 215, 
      comments: 68, 
      status: 'OPEN', 
      hasParticipated: false,
      bg: 'bg-teal-100',
      icon: '✈️',
      endDate: '10.28',
      allowedGrades: 'all',
      showResults: true, 
      chartType: 'bar', // 막대 그래프 (질문별 결과 표시)
      questions: [
        { id: 'q1', text: '버스 옆자리, 누가 좋아?', options: ['재밌는 수다쟁이', '조용히 자는 친구'] },
        { id: 'q2', text: '자유시간에는?', options: ['철저한 계획파', '즉흥적인 자유파'] },
        { id: 'q3', text: '숙소에 도착하면?', options: ['짐부터 정리해', '침대부터 누워'] },
        { id: 'q4', text: '기념품 살 때?', options: ['가성비가 최고', '이쁘면 다 사!'] },
      ]
    },
    { 
      id: 501, 
      title: '선생님께 바라는 점 (비공개)', 
      content: '선생님한테 하고 싶은 말 솔직하게 투표해줘! 결과는 선생님만 볼 수 있어.',
      type: 'choice_discuss', 
      tags: ['비밀', '소원수리'], 
      participants: 28, 
      comments: 0, 
      status: 'OPEN', 
      hasParticipated: false,
      bg: 'bg-gray-200',
      icon: '🤫', 
      endDate: '오늘까지',
      allowedGrades: 'all',
      showResults: false, // 비공개
      chartType: 'doughnut', // 도넛 차트
      questions: [
        { id: 'q1', text: '가장 원하는 것은?', options: ['쉬는 시간 연장', '숙제 없는 날', '자리 바꾸기', '체육 대회'] },
        { id: 'q2', text: '급식 메뉴 추천', options: ['마라탕', '치킨', '피자', '떡볶이'] }
      ]
    }
  ];

  const allTags = [...new Set(rooms.filter(r => r.status === 'OPEN').flatMap(r => r.tags))];

  const handleNameSave = () => {
    if (newName.trim()) {
      onUpdateUser({ ...currentUser, name: newName });
      setIsEditingName(false);
    }
  };

  const toggleFilter = (filterId) => {
    setActiveFilters(prev => 
      prev.includes(filterId) ? prev.filter(id => id !== filterId) : [...prev, filterId]
    );
  };

  const getProcessedRooms = () => {
    let result = rooms.filter(room => showClosed ? room.status === 'CLOSED' : room.status === 'OPEN');

    if (activeFilters.length > 0) {
      result = result.filter(room => {
        const hasParticipationFilter = activeFilters.includes('PARTICIPATED') || activeFilters.includes('NOT_PARTICIPATED');
        const tagFilters = activeFilters.filter(f => f.startsWith('TAG_'));
        
        let passParticipation = true;
        if (hasParticipationFilter) {
           if (activeFilters.includes('PARTICIPATED') && !room.hasParticipated) passParticipation = false;
           if (activeFilters.includes('NOT_PARTICIPATED') && room.hasParticipated) passParticipation = false;
           if (activeFilters.includes('PARTICIPATED') && activeFilters.includes('NOT_PARTICIPATED')) passParticipation = false;
        }

        let passTag = true;
        if (tagFilters.length > 0) {
           passTag = tagFilters.some(t => room.tags.includes(t.replace('TAG_', '')));
        }

        return passParticipation && passTag;
      });
    }

    result.sort((a, b) => {
      if (sortMode === 'popular') return b.participants - a.participants;
      return b.id - a.id; 
    });

    return result;
  };

  const finalRoomList = getProcessedRooms();

  return (
    <div className="w-full max-w-md mx-auto bg-[#FFF9F0] h-full flex flex-col font-sans">
      <div className="bg-white px-5 pt-6 pb-4 sticky top-0 z-10 rounded-b-3xl shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-1 mb-1">
               {isEditingName ? (
                 <div className="flex items-center gap-1">
                   <input 
                     className="w-24 text-sm border-b-2 border-orange-300 focus:outline-none font-bold text-gray-700" 
                     value={newName} 
                     onChange={(e) => setNewName(e.target.value)}
                     maxLength={6}
                     autoFocus
                   />
                   <button onClick={handleNameSave} className="text-[10px] bg-orange-500 text-white px-2 py-1 rounded-lg">저장</button>
                 </div>
               ) : (
                 <button onClick={() => setIsEditingName(true)} className="flex items-center gap-1 group py-1">
                   <span className="text-sm text-gray-800 font-extrabold tracking-wider group-hover:text-orange-500 transition-colors">{currentUser.name} 님</span>
                   <Edit2 className="w-3 h-3 text-gray-300 group-hover:text-orange-400" />
                 </button>
               )}
            </div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">
              {showClosed ? '보물상자 (지난글)' : '와글와글 광장'}
            </h1>
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

        {!showClosed && (
          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleFilter('PARTICIPATED')} 
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${activeFilters.includes('PARTICIPATED') ? 'bg-green-100 border-green-200 text-green-700' : 'bg-white border-gray-100 text-gray-400'}`}
                >
                   {activeFilters.includes('PARTICIPATED') && <Check className="w-3 h-3" />} 참여완료
                </button>
                <button 
                  onClick={() => toggleFilter('NOT_PARTICIPATED')} 
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${activeFilters.includes('NOT_PARTICIPATED') ? 'bg-orange-100 border-orange-200 text-orange-700' : 'bg-white border-gray-100 text-gray-400'}`}
                >
                   {activeFilters.includes('NOT_PARTICIPATED') && <Check className="w-3 h-3" />} 미참여
                </button>
              </div>

              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setSortMode('newest')} 
                  className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${sortMode === 'newest' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}
                >
                  최신순
                </button>
                <button 
                  onClick={() => setSortMode('popular')} 
                  className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${sortMode === 'popular' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-400'}`}
                >
                  인기순
                </button>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {allTags.map(tag => (
                <button 
                  key={tag} 
                  onClick={() => toggleFilter(`TAG_${tag}`)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${activeFilters.includes(`TAG_${tag}`) ? 'bg-indigo-100 border-indigo-200 text-indigo-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {finalRoomList.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>조건에 맞는 방이 없어 😅</p>
            <button onClick={() => { setActiveFilters([]); setSortMode('newest'); }} className="text-xs text-blue-500 underline mt-2">필터 초기화</button>
          </div>
        ) : (
          finalRoomList.map(room => (
            <div 
              key={room.id} 
              onClick={() => onSelectRoom(room, true)}
              className={`rounded-3xl p-5 shadow-sm border-2 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden bg-white border-orange-100 hover:border-orange-300 hover:shadow-md`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-1.5 flex-wrap">
                  {room.hasParticipated ? (
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-black bg-green-100 text-green-600 flex items-center gap-1 shadow-sm">
                       <CheckCircle2 className="w-3 h-3" /> 참여완료
                    </span>
                  ) : (
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-black bg-red-100 text-red-500 flex items-center gap-1 shadow-sm">
                       미참여 🔥
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${room.bg}`}>
                  {room.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-black text-lg text-gray-800 leading-tight mb-1">{room.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1 font-medium">{room.content}</p>
                  
                  {/* 키워드 태그 영역 (최대 3개) */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {room.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-lg font-bold border border-gray-100">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                     <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                       <Users className="w-3 h-3" /> {room.participants}명
                     </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
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
  
  const [isVoted, setIsVoted] = useState(isReadOnly || roomData.hasParticipated); 
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [myVotes, setMyVotes] = useState({});
  const [commentInput, setCommentInput] = useState('');

  // 댓글 데이터 (가상의 투표 성향 voteProfile 포함)
  // 데모를 위해 랜덤하게 voteProfile을 생성
  const [comments, setComments] = useState(() => {
    const baseComments = [
      { id: 101, name: '즐거운 강아지', colorClass: 'text-orange-500', timeStr: '10분 전', content: '난 무조건 쉬는 시간이 좋아!', likes: 5, likedByMe: false },
      { id: 102, name: '졸린 고양이', colorClass: 'text-blue-500', timeStr: '5분 전', content: '공감해 ㅋㅋ', likes: 2, likedByMe: false },
      { id: 103, name: '용감한 호랑이', colorClass: 'text-green-600', timeStr: '20분 전', content: '다들 투표했어?', likes: 10, likedByMe: false },
    ];
    // 각 댓글마다 가상의 투표 데이터 생성
    return baseComments.map(c => {
      const randomProfile = {};
      if (roomData.questions) {
        roomData.questions.forEach(q => {
          randomProfile[q.id] = q.options[Math.floor(Math.random() * q.options.length)];
        });
      }
      return { ...c, voteProfile: randomProfile };
    });
  });

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
    const newComment = {
      id: Date.now(), 
      name: `${currentUser.name} (나)`, 
      colorClass: 'text-black font-bold', 
      timeStr: '방금', 
      content: commentInput, 
      likes: 0, 
      likedByMe: false,
      voteProfile: myVotes // 내 투표 정보 포함
    };
    setComments(prev => [newComment, ...prev]);
    setCommentInput('');
  };

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

  // 일치율 계산 및 태그 반환
  const getMatchTag = (commentVoteProfile) => {
    if (!commentVoteProfile || Object.keys(myVotes).length === 0) return null;
    
    const questions = roomData.questions || [];
    if (questions.length === 0) return null;

    let matchCount = 0;
    questions.forEach(q => {
      if (myVotes[q.id] && myVotes[q.id] === commentVoteProfile[q.id]) {
        matchCount++;
      }
    });

    const percent = (matchCount / questions.length) * 100;

    if (percent === 100) return { text: '완전일치 💖', color: 'bg-red-100 text-red-600' };
    if (percent >= 80) return { text: '환상호흡 ✨', color: 'bg-pink-100 text-pink-600' };
    if (percent >= 60) return { text: '꿀케미 🍯', color: 'bg-orange-100 text-orange-600' };
    if (percent >= 40) return { text: '호감상승 🙂', color: 'bg-green-100 text-green-600' };
    if (percent >= 20) return { text: '조금어색 😅', color: 'bg-blue-100 text-blue-600' };
    return { text: '우린아직... 🤔', color: 'bg-gray-100 text-gray-500' };
  };

  // 차트 렌더링 헬퍼 함수
  const renderResults = () => {
    if (roomData.chartType === 'doughnut') {
      return (
        <div className="space-y-8">
          {roomData.questions.map((q, idx) => {
            const data = {
              labels: q.options,
              datasets: [{
                data: q.options.map(() => Math.floor(Math.random() * 100)), // Mock data
                backgroundColor: ['#FCA5A5', '#FDBA74', '#86EFAC', '#93C5FD'],
                borderWidth: 0,
              }]
            };
            return (
              <div key={idx} className="flex flex-col items-center">
                <h5 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                   <span className="bg-orange-100 text-orange-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">Q{idx+1}</span>
                   {q.text}
                </h5>
                <div className="h-40 w-full flex justify-center">
                  <Doughnut data={data} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      // Default: Bar Chart (HTML Custom Implementation)
      return (
        <div className="space-y-8">
          {roomData.questions.map((q, idx) => (
             <div key={idx} className="text-left">
                <h5 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                   <span className="bg-orange-100 text-orange-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">Q{idx+1}</span>
                   {q.text}
                </h5>
                <div className="space-y-2 pl-2">
                   {q.options.map((opt, i) => {
                      const mockPercent = [45, 30, 15, 10][i % 4] || 25; 
                      // 1. 내가 선택한 항목인지 확인
                      const isMyPick = myVotes[q.id] === opt;
                      return (
                         <div key={i} className={`relative h-9 rounded-lg overflow-hidden flex items-center px-3 ${isMyPick ? 'ring-2 ring-orange-400 bg-orange-50' : 'bg-gray-50'}`}>
                            {/* 막대 색상: 선택했으면 진한 오렌지, 아니면 연한 블루 */}
                            <div 
                              className={`absolute left-0 top-0 bottom-0 opacity-50 ${isMyPick ? 'bg-orange-400' : 'bg-blue-100'}`} 
                              style={{ width: `${mockPercent}%` }}
                            ></div>
                            <span className={`relative z-10 text-xs font-bold flex-1 ${isMyPick ? 'text-orange-800' : 'text-gray-600'}`}>
                              {opt}
                              {isMyPick && <span className="ml-2 text-[9px] bg-orange-600 text-white px-1.5 py-0.5 rounded-full">나의 선택</span>}
                            </span>
                            <span className={`relative z-10 text-xs font-bold ${isMyPick ? 'text-orange-800' : 'text-gray-400'}`}>{mockPercent}%</span>
                         </div>
                      )
                   })}
                </div>
             </div>
           ))}
        </div>
      );
    }
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
                    {!roomData.showResults ? (
                       <div className="py-10">
                         <div className="text-4xl mb-4">🤫</div>
                         <h4 className="font-black text-xl text-gray-800 mb-2">투표참여에 감사드립니다.</h4>
                         {/* 2. 비공개 메시지 변경 */}
                         <p className="text-sm text-gray-500">투표 결과는 비공개 됩니다.</p>
                       </div>
                    ) : (
                       <div className="space-y-8">
                          <div className="text-center mb-6">
                             <h4 className="font-black text-xl text-gray-800 mb-1">투표 결과</h4>
                             <p className="text-xs text-gray-400">친구들의 생각은 이래!</p>
                          </div>
                          {renderResults()}
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
                {comments.map(c => {
                  // 3. 댓글 태그 계산
                  const matchTag = getMatchTag(c.voteProfile);
                  return (
                    <div key={c.id} className="bg-white p-4 rounded-3xl shadow-sm border border-transparent">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`font-bold text-xs ${c.colorClass}`}>{c.name}</span>
                            <span className="text-[10px] text-gray-300">{c.timeStr}</span>
                            {/* 태그 표시 */}
                            {matchTag && isVoted && (
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ml-auto ${matchTag.color}`}>
                                {matchTag.text}
                              </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed">{c.content}</p>
                        <div className="flex justify-end mt-1">
                           <button 
                             onClick={() => toggleLike(c.id)}
                             className={`flex items-center gap-1 text-xs transition-colors ${c.likedByMe ? 'text-red-500' : 'text-gray-300 hover:text-red-300'}`}
                           >
                             <Heart className={`w-3 h-3 ${c.likedByMe ? 'fill-current' : ''}`} /> 
                             {c.likes}
                           </button>
                        </div>
                    </div>
                  );
                })}
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