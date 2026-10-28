export interface Question {
  id: number;
  question: string;
  answer: string;
  category: 'Nivel Estándar – Conectando Fronteras';
  topicTag?: string;
  panelistRef?: string;
}

export interface AwardedPrize {
  id: string;
  questionId: number;
  questionText: string;
  answerText: string;
  timestamp: number;
  prizeNumber: number;
}

export interface GameState {
  totalPrizes: number;
  remainingPrizes: number;
  activeQuestionIds: number[];
  answeredQuestionIds: number[];
  currentQuestion: Question | null;
  isSpinning: boolean;
  isQuestionModalOpen: boolean;
  isPrizeModalOpen: boolean;
  isFinaleModalOpen: boolean;
  isPanelistsModalOpen: boolean;
  isQuestionBankOpen: boolean;
  isKeyboardHelpOpen: boolean;
  isMuted: boolean;
  history: AwardedPrize[];
}
