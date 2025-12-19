// src/data/menu.ts

export type Category = '전체' | '버거' | '사이드' | '음료';

// 옵션 한 개의 타입 (예: "세트 변경", "콜라")
export interface OptionItem {
  name: string;
  price: number;
}

// 메뉴 아이템 타입
export interface MenuItem {
  id: number;
  name: string;
  basePrice: number; // price -> basePrice로 변경 (기본 가격)
  category: Category;
  img: string;
  tag?: string;
  // 옵션 리스트 (없을 수도 있음)
  options?: OptionItem[]; 
}

export const MENUS: MenuItem[] = [
  // --- 버거 (옵션 있음) ---
  {
    id: 1,
    name: "더블 치즈버거",
    basePrice: 6800,
    category: "버거",
    img: "🍔",
    tag: "BEST",
    options: [
      { name: "단품", price: 0 },
      { name: "세트 (감자튀김+콜라)", price: 2500 }, // 세트 선택 시 2500원 추가
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
    options: [
      { name: "단품", price: 0 },
      { name: "세트 (감자튀김+콜라)", price: 2500 },
    ]
  },
  
  // --- 사이드 & 음료 (옵션 없음) ---
  {
    id: 101,
    name: "감자튀김 (M)",
    basePrice: 2000,
    category: "사이드",
    img: "🍟",
  },
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