// src/App.tsx
import { useState } from 'react';
import { MENUS, type Category, type MenuItem, type OptionItem } from './data/menu';

// 장바구니 아이템 타입 (옵션 정보 포함)
interface CartItem extends MenuItem {
  cartId: string; // 옵션에 따라 달라지는 고유 ID
  quantity: number;
  selectedOption?: OptionItem; // 선택된 옵션 (세트/단품)
  totalPrice: number; // 기본가 + 옵션가
}

function App() {
  const [category, setCategory] = useState<Category>('전체');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [selectedOption, setSelectedOption] = useState<OptionItem | null>(null);

  // 1. 메뉴 클릭 시 모달 열기 (옵션 없으면 바로 담기)
  const handleMenuClick = (menu: MenuItem) => {
    if (menu.options && menu.options.length > 0) {
      // 옵션이 있는 메뉴면 -> 모달 열기
      setSelectedMenu(menu);
      setSelectedOption(menu.options[0]); // 첫번째 옵션(단품) 기본 선택
      setIsModalOpen(true);
    } else {
      // 옵션이 없는 메뉴면 -> 바로 장바구니 추가
      addToCart(menu, null);
    }
  };

  // 2. 장바구니 담기 (핵심 로직!)
  const addToCart = (menu: MenuItem, option: OptionItem | null) => {
    const optionPrice = option ? option.price : 0;
    const finalPrice = menu.basePrice + optionPrice;
    
    // 같은 메뉴라도 '세트'냐 '단품'이냐에 따라 다른 ID를 부여
    const uniqueId = option 
      ? `${menu.id}-${option.name}` 
      : `${menu.id}-default`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartId === uniqueId);
      if (existing) {
        // 이미 있으면 수량 +1
        return prev.map((item) => 
          item.cartId === uniqueId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // 없으면 새로 추가
        return [...prev, { 
          ...menu, 
          cartId: uniqueId, 
          quantity: 1, 
          selectedOption: option || undefined,
          totalPrice: finalPrice
        }];
      }
    });

    // 모달 닫기
    setIsModalOpen(false);
  };

  // 총 금액 계산
  const totalAmount = cart.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
  
  // 카테고리 필터링
  const filteredMenus = category === '전체' ? MENUS : MENUS.filter(m => m.category === category);

  return (
    <div className="w-full min-h-screen bg-gray-100 pb-80 relative select-none">
      
      {/* 헤더 */}
      <header className="bg-red-600 text-white p-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">🍔 버거 키오스크</h1>
        {cart.length > 0 && <span className="bg-white text-red-600 px-3 py-1 rounded-full font-bold text-sm">{cart.length}개</span>}
      </header>

      {/* 카테고리 탭 */}
      <nav className="flex justify-around bg-white p-2 shadow-sm sticky top-16 z-10">
        {['전체', '버거', '사이드', '음료'].map((cat) => (
          <button 
            key={cat} 
            onClick={() => setCategory(cat as Category)} 
            className={`px-4 py-2 rounded-full font-bold transition-colors ${category === cat ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
            className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center active:scale-95 transition-transform cursor-pointer"
          >
            <div className="text-6xl mb-2">{menu.img}</div>
            <h3 className="font-bold text-lg text-gray-800 text-center break-keep">{menu.name}</h3>
            <p className="text-red-600 font-bold mt-1">{menu.basePrice.toLocaleString()}원~</p>
          </div>
        ))}
      </main>

      {/* --- 옵션 선택 모달 (핵심) --- */}
      {isModalOpen && selectedMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
            {/* 모달 헤더 */}
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-bold text-xl">{selectedMenu.name}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl px-2">&times;</button>
            </div>
            
            {/* 모달 내용 (옵션 선택) */}
            <div className="p-6 space-y-4">
              <p className="text-gray-600 font-bold mb-2">옵션을 선택해주세요</p>
              <div className="flex flex-col gap-3">
                {selectedMenu.options?.map((option) => (
                  <div 
                    key={option.name}
                    onClick={() => setSelectedOption(option)} // 👈 여기가 추가되었습니다!
                    className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedOption?.name === option.name 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* 라디오 버튼 UI */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOption?.name === option.name ? 'border-red-500' : 'border-gray-300'
                      }`}>
                        {selectedOption?.name === option.name && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                      </div>
                      <span className="font-medium text-lg">{option.name}</span>
                    </div>
                    {option.price > 0 && <span className="text-red-500 font-bold">+{option.price.toLocaleString()}원</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* 모달 하단 버튼 */}
            <div className="p-4 border-t bg-gray-50">
              <button 
                onClick={() => addToCart(selectedMenu, selectedOption)}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg active:bg-red-700 transition-colors flex justify-center items-center gap-2"
              >
                <span>{(selectedMenu.basePrice + (selectedOption?.price || 0)).toLocaleString()}원 담기</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 하단 장바구니 바 */}
      {cart.length > 0 && (
        <footer className="fixed bottom-0 w-full bg-white border-t p-4 shadow-2xl rounded-t-2xl z-40 animate-slide-up">
          <div className="flex justify-between items-center mb-4">
             <span className="text-gray-500 font-bold">총 주문 금액</span>
             <span className="text-2xl font-extrabold text-red-600">{totalAmount.toLocaleString()}원</span>
          </div>
          {/* 장바구니 리스트 미리보기 */}
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
            <button onClick={() => alert('결제 완료! 맛있게 드세요 🍔')} className="flex-[2] bg-red-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg active:bg-red-700">결제하기</button>
          </div>
        </footer>
      )}
    </div>
  )
}

export default App