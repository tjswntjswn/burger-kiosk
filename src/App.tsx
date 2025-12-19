import { useState } from 'react';
import { MENUS, type Category, type MenuItem, type OptionItem } from './data/menu';

// 장바구니 아이템 타입
interface CartItem extends MenuItem {
  cartId: string;
  quantity: number;
  selectedOption?: OptionItem;
  totalPrice: number;
}

function App() {
  // --- 상태 관리 (State) ---
  const [orderType, setOrderType] = useState<'먹고가기' | '포장하기' | null>(null); // 1. 주문 형태 (인트로용)
  const [category, setCategory] = useState<Category>('전체');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // 모달들 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 옵션 모달
  const [isReceiptOpen, setIsReceiptOpen] = useState(false); // 3. 영수증 모달
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [selectedOption, setSelectedOption] = useState<OptionItem | null>(null);

  // --- 기능 함수들 ---

  // 1. 메뉴 클릭 핸들러 (품절 체크 추가)
  const handleMenuClick = (menu: MenuItem) => {
    if (menu.isSoldOut) return; // 품절이면 클릭 막기

    if (menu.options && menu.options.length > 0) {
      setSelectedMenu(menu);
      setSelectedOption(menu.options[0]); 
      setIsModalOpen(true);
    } else {
      addToCart(menu, null);
    }
  };

  // 2. 장바구니 담기
  const addToCart = (menu: MenuItem, option: OptionItem | null) => {
    const optionPrice = option ? option.price : 0;
    const finalPrice = menu.basePrice + optionPrice;
    const uniqueId = option ? `${menu.id}-${option.name}` : `${menu.id}-default`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartId === uniqueId);
      if (existing) {
        return prev.map((item) => 
          item.cartId === uniqueId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...menu, cartId: uniqueId, quantity: 1, selectedOption: option || undefined, totalPrice: finalPrice }];
      }
    });
    setIsModalOpen(false);
  };

  // 3. 결제 완료 및 초기화 (주문 번호 생성 등은 실제라면 서버에서 하겠지만 여기선 랜덤으로!)
  const handleOrderComplete = () => {
    // 모든 상태 초기화 (처음으로 돌아가기)
    setCart([]);
    setOrderType(null);
    setIsReceiptOpen(false);
    setCategory('전체');
  };

  // 총 금액 계산
  const totalAmount = cart.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
  const filteredMenus = category === '전체' ? MENUS : MENUS.filter(m => m.category === category);

  // ----------------------------------------------------------------
  // 화면 1: 주문 형태 선택 (인트로 화면)
  // ----------------------------------------------------------------
  if (!orderType) {
    return (
      <div className="w-full h-screen bg-red-600 flex flex-col items-center justify-center p-8 space-y-8 animate-fade-in">
        <div className="text-white text-center mb-8">
          <div className="text-8xl mb-4">🍔</div>
          <h1 className="text-4xl font-bold">버거 키오스크</h1>
          <p className="text-xl mt-2 opacity-80">원하시는 식사 장소를 선택해주세요</p>
        </div>
        <div className="flex gap-6 w-full max-w-2xl">
          <button 
            onClick={() => setOrderType('먹고가기')}
            className="flex-1 bg-white hover:bg-gray-100 text-red-600 py-16 rounded-3xl shadow-2xl flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
          >
            <span className="text-6xl mb-4">🍽️</span>
            <span className="text-3xl font-extrabold">먹고가기</span>
          </button>
          <button 
            onClick={() => setOrderType('포장하기')}
            className="flex-1 bg-white hover:bg-gray-100 text-red-600 py-16 rounded-3xl shadow-2xl flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
          >
            <span className="text-6xl mb-4">🎁</span>
            <span className="text-3xl font-extrabold">포장하기</span>
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 화면 2: 메인 키오스크 화면
  // ----------------------------------------------------------------
  return (
    <div className="w-full min-h-screen bg-gray-100 pb-80 relative select-none">
      {/* 헤더 */}
      <header className="bg-red-600 text-white p-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button onClick={() => setOrderType(null)} className="text-sm bg-red-700 px-3 py-1 rounded-lg hover:bg-red-800">← 처음으로</button>
          <h1 className="text-xl font-bold">🍔 버거 키오스크 ({orderType})</h1>
        </div>
        {cart.length > 0 && <span className="bg-white text-red-600 px-3 py-1 rounded-full font-bold text-sm">{cart.length}개</span>}
      </header>

      {/* 카테고리 탭 */}
      <nav className="flex justify-around bg-white p-2 shadow-sm sticky top-16 z-10">
        {['전체', '버거', '사이드', '음료'].map((cat) => (
          <button 
            key={cat} 
            onClick={() => setCategory(cat as Category)} 
            className={`px-4 py-2 rounded-full font-bold transition-colors ${category === cat ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* 메뉴 리스트 */}
      <main className="p-4 grid grid-cols-2 gap-4">
        {filteredMenus.map((menu) => (
          <div 
            key={menu.id} 
            onClick={() => handleMenuClick(menu)} 
            className={`bg-white p-4 rounded-xl shadow-lg flex flex-col items-center transition-transform relative overflow-hidden
              ${menu.isSoldOut ? 'opacity-50 grayscale cursor-not-allowed' : 'active:scale-95 cursor-pointer'}
            `}
          >
            {/* 품절 오버레이 */}
            {menu.isSoldOut && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
                <span className="bg-black/70 text-white px-3 py-1 rounded font-bold -rotate-12">SOLD OUT</span>
              </div>
            )}

            <div className="text-6xl mb-2">{menu.img}</div>
            <h3 className="font-bold text-lg text-gray-800 text-center break-keep">{menu.name}</h3>
            <p className="text-red-600 font-bold mt-1">{menu.basePrice.toLocaleString()}원~</p>
            {menu.tag && !menu.isSoldOut && (
              <span className="mt-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded text-white">{menu.tag}</span>
            )}
          </div>
        ))}
      </main>

      {/* 옵션 선택 모달 */}
      {isModalOpen && selectedMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-bold text-xl">{selectedMenu.name}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl px-2">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-600 font-bold mb-2">옵션을 선택해주세요</p>
              <div className="flex flex-col gap-3">
                {selectedMenu.options?.map((option) => (
                  <div 
                    key={option.name}
                    onClick={() => setSelectedOption(option)}
                    className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedOption?.name === option.name ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption?.name === option.name ? 'border-red-500' : 'border-gray-300'}`}>
                        {selectedOption?.name === option.name && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                      </div>
                      <span className="font-medium text-lg">{option.name}</span>
                    </div>
                    {option.price > 0 && <span className="text-red-500 font-bold">+{option.price.toLocaleString()}원</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50">
              <button onClick={() => addToCart(selectedMenu, selectedOption)} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg active:bg-red-700 transition-colors">
                {(selectedMenu.basePrice + (selectedOption?.price || 0)).toLocaleString()}원 담기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 장바구니 하단 바 */}
      {cart.length > 0 && (
        <footer className="fixed bottom-0 w-full bg-white border-t p-4 shadow-2xl rounded-t-2xl z-40 animate-slide-up">
          <div className="flex justify-between items-center mb-4">
             <span className="text-gray-500 font-bold">총 주문 금액</span>
             <span className="text-2xl font-extrabold text-red-600">{totalAmount.toLocaleString()}원</span>
          </div>
          <div className="flex gap-2 overflow-x-auto mb-4 pb-2 scrollbar-hide">
             {cart.map((item, idx) => (
               <div key={idx} className="flex-shrink-0 bg-gray-100 px-3 py-2 rounded-lg text-sm font-bold text-gray-700 flex flex-col items-center min-w-[80px]">
                 <span>{item.name}</span>
                 {item.selectedOption && <span className="text-xs text-red-500 font-normal">{item.selectedOption.name}</span>}
                 <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1">{item.quantity}</span>
               </div>
             ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCart([])} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg active:bg-gray-300">취소</button>
            <button onClick={() => setIsReceiptOpen(true)} className="flex-[2] bg-red-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg active:bg-red-700">결제하기</button>
          </div>
        </footer>
      )}

      {/* ------------------------------------------------------------
          화면 3: 영수증 모달 (결제 완료 화면)
         ------------------------------------------------------------ */}
      {isReceiptOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-none shadow-2xl overflow-hidden relative">
            
            {/* 영수증 윗부분 (찢어진 종이 효과 흉내) */}
            <div className="bg-red-600 p-6 text-center text-white">
              <div className="text-4xl mb-2">✅</div>
              <h2 className="text-2xl font-bold">주문이 완료되었습니다!</h2>
              <p className="opacity-90 mt-1">주문번호를 확인해주세요</p>
            </div>

            {/* 영수증 내용 */}
            <div className="p-6 bg-white border-b-2 border-dashed border-gray-300">
              <div className="text-center mb-6">
                <p className="text-gray-500 text-sm">주문번호</p>
                <p className="text-5xl font-extrabold text-gray-800 mt-1">{Math.floor(Math.random() * 900) + 100}</p>
              </div>

              <div className="space-y-1 mb-6 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>주문일시</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>주문형태</span>
                  <span className="font-bold text-red-600">{orderType}</span>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4 space-y-2 mb-4">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-800">
                      {item.name} <span className="text-xs text-gray-500">x{item.quantity}</span>
                      {item.selectedOption && <div className="text-xs text-gray-400">└ {item.selectedOption.name}</div>}
                    </span>
                    <span className="font-bold">{(item.totalPrice * item.quantity).toLocaleString()}원</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xl font-extrabold text-red-600">
                <span>총 결제금액</span>
                <span>{totalAmount.toLocaleString()}원</span>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="p-4 bg-gray-50">
              <button 
                onClick={handleOrderComplete}
                className="w-full bg-gray-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-colors"
              >
                처음으로 돌아가기
              </button>
            </div>
            
            {/* 영수증 아래 톱니 모양 (CSS로 흉내내기) */}
            <div className="h-4 bg-gray-50 bg-[radial-gradient(circle,transparent_50%,#f9fafb_50%)] bg-[length:20px_20px] -mt-2 rotate-180"></div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App