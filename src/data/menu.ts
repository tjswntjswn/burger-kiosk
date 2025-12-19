// src/data/menu.ts

export type Category = '전체' | '버거' | '사이드' | '음료';

export interface OptionItem {
  name: string;
  price: number;
}

export interface MenuItem {
  id: number;
  name: string;
  basePrice: number;
  category: Category;
  img: string;
  tag?: string;
  options?: OptionItem[]; 
  isSoldOut?: boolean; // 👈 품절 여부 체크용 (새로 추가됨)
}

export const MENUS: MenuItem[] = [
  // --- 버거 ---
  {
    id: 1,
    name: "더블 치즈버거",
    basePrice: 6800,
    category: "버거",
    img: "🍔",
    tag: "BEST",
    options: [
      { name: "단품", price: 0 },
      { name: "세트 (감자튀김+콜라)", price: 2500 },
    ]
  },
  {
    id: 2,
    name: "베이컨 토마토 디럭스",
    basePrice: 7500,
    category: "버거",
    img: "🥓",
    options: [
      { name: "단품", price: 0 },
      { name: "세트 (감자튀김+콜라)", price: 2500 },
    ]
  },
  {
    id: 3,
    name: "새우버거",
    basePrice: 5200,
    category: "버거",
    img: "🍤",
    isSoldOut: true, // 👈 품절 테스트용! (화면에서 흐리게 나와야 함)
    options: [
      { name: "단품", price: 0 },
      { name: "세트 (감자튀김+콜라)", price: 2500 },
    ]
  },
  
  // --- 사이드 ---
  {
    id: 101,
    name: "감자튀김 (M)",
    basePrice: 2000,
    category: "사이드",
    img: "🍟",
  },
  {
    id: 102,
    name: "치즈스틱 (2조각)",
    basePrice: 2500,
    category: "사이드",
    img: "🧀",
  },

  // --- 음료 ---
  {
    id: 201,
    name: "코카콜라 제로",
    basePrice: 2000,
    category: "음료",
    img: "🥤",
  },
  {
    id: 202,
    name: "아이스 아메리카노",
    basePrice: 2500,
    category: "음료",
    img: "☕️",
  },
];