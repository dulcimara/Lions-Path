import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  slot: string;
  iconLib: 'Ionicons' | 'Feather';
}

export interface UserProgress {
  level: number;
  goldCoins: number;
  goldToNextLevel: number;
  completedLessons: string[];
  currentStreak: number;
  totalLessons: number;
  avatarStage: 1 | 2 | 3 | 4 | 5;
  talents: number;
  purchasedItems: string[];
  lastPlayedDate: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'sandal',    name: 'Sandálias da Paz',      description: 'Pés prontos para o evangelho',     price: 80,  icon: 'walk',         slot: 'pés',     iconLib: 'Ionicons' },
  { id: 'slingshot', name: 'Estilingue de Davi',    description: 'A fé vence gigantes',              price: 120, icon: 'radio-button-on', slot: 'mão',   iconLib: 'Ionicons' },
  { id: 'cape',      name: 'Capa do Profeta',        description: 'Como o manto de Elias',            price: 180, icon: 'flag',         slot: 'costas',  iconLib: 'Ionicons' },
  { id: 'staff',     name: 'Cajado de Moisés',       description: 'Para separar o mar',               price: 250, icon: 'git-branch',   slot: 'mão',     iconLib: 'Feather' },
  { id: 'shield',    name: 'Escudo da Fé',           description: 'Para apagar os dardos ardentes',   price: 320, icon: 'shield',       slot: 'braço',   iconLib: 'Feather' },
  { id: 'sword',     name: 'Espada do Espírito',     description: 'A Palavra viva e eficaz de Deus',  price: 450, icon: 'flash',        slot: 'mão',     iconLib: 'Ionicons' },
  { id: 'crown',     name: 'Coroa de Rei',           description: 'Mais do que vencedor em Cristo',   price: 600, icon: 'star',         slot: 'cabeça',  iconLib: 'Ionicons' },
];

export const GENESIS_LESSONS = [
  { id: 'gen_01', title: 'A Criação',              subtitle: 'Gênesis 1',     era: 'Era das Origens', goldReward: 50,  difficulty: 'Fácil'  },
  { id: 'gen_02', title: 'O Jardim do Éden',       subtitle: 'Gênesis 2',     era: 'Era das Origens', goldReward: 50,  difficulty: 'Fácil'  },
  { id: 'gen_03', title: 'A Queda',                subtitle: 'Gênesis 3',     era: 'Era das Origens', goldReward: 75,  difficulty: 'Médio'  },
  { id: 'gen_04', title: 'Caim e Abel',            subtitle: 'Gênesis 4',     era: 'Era das Origens', goldReward: 75,  difficulty: 'Médio'  },
  { id: 'gen_05', title: 'Noé e o Dilúvio',        subtitle: 'Gênesis 6-9',   era: 'Era das Origens', goldReward: 100, difficulty: 'Médio'  },
  { id: 'gen_06', title: 'A Torre de Babel',       subtitle: 'Gênesis 11',    era: 'Era das Origens', goldReward: 75,  difficulty: 'Médio'  },
  { id: 'gen_07', title: 'O Chamado de Abraão',    subtitle: 'Gênesis 12',    era: 'Era das Origens', goldReward: 100, difficulty: 'Difícil'},
  { id: 'gen_08', title: 'Aliança com Abraão',     subtitle: 'Gênesis 15-17', era: 'Era das Origens', goldReward: 125, difficulty: 'Difícil'},
  { id: 'gen_09', title: 'Sodoma e Gomorra',       subtitle: 'Gênesis 18-19', era: 'Era das Origens', goldReward: 100, difficulty: 'Difícil'},
  { id: 'gen_10', title: 'O Sacrifício de Isaque', subtitle: 'Gênesis 22',    era: 'Era das Origens', goldReward: 150, difficulty: 'Difícil'},
];

export const LESSON_QUIZZES: Record<string, { question: string; options: string[]; correct: number; explanation: string }[]> = {
  gen_01: [
    { question: 'Em quantos dias Deus criou o mundo?', options: ['3 dias', '6 dias', '7 dias', '10 dias'], correct: 1, explanation: 'Deus criou o mundo em 6 dias e descansou no sétimo (Gênesis 1:31-2:2).' },
    { question: 'O que Deus criou no primeiro dia?', options: ['Sol e Lua', 'Animais', 'Luz', 'Mar e Terra'], correct: 2, explanation: 'No primeiro dia, Deus disse: "Haja luz" e a luz passou a existir (Gênesis 1:3).' },
    { question: 'O que Deus viu ao final da criação?', options: ['Era perfeito', 'Era muito bom', 'Era suficiente', 'Era completo'], correct: 1, explanation: '"Deus viu tudo o que havia feito, e era muito bom" (Gênesis 1:31).' },
  ],
  gen_02: [
    { question: 'Como Deus criou Adão?', options: ['Do barro da terra', 'Da água', 'Do fogo', 'Do vento'], correct: 0, explanation: 'Deus formou o homem do pó da terra e soprou em suas narinas o fôlego de vida (Gênesis 2:7).' },
    { question: 'Como Deus criou Eva?', options: ['Do pó da terra', 'De uma costela de Adão', 'Da água', 'De uma pedra'], correct: 1, explanation: 'Deus tirou uma das costelas de Adão e dela fez a mulher (Gênesis 2:22).' },
    { question: 'Qual era o nome do jardim onde Adão e Eva viviam?', options: ['Jardim do Rei', 'Jardim do Éden', 'Jardim de Abraão', 'Jardim Sagrado'], correct: 1, explanation: 'Deus plantou um jardim no Éden, ao oriente, e ali pôs o homem que havia formado (Gênesis 2:8).' },
  ],
  gen_03: [
    { question: 'Quem tentou Eva no jardim?', options: ['Adão', 'Um anjo', 'A serpente', 'Um leão'], correct: 2, explanation: 'A serpente era o mais astuto dos animais do campo e enganou Eva (Gênesis 3:1).' },
    { question: 'De qual árvore Deus proibiu Adão e Eva de comer?', options: ['Árvore da Vida', 'Árvore do Conhecimento do Bem e do Mal', 'Árvore dos Frutos', 'Árvore da Sabedoria'], correct: 1, explanation: 'Deus ordenou: "da árvore do conhecimento do bem e do mal não comerás" (Gênesis 2:17).' },
    { question: 'O que aconteceu depois que Adão e Eva pecaram?', options: ['Nada mudou', 'Foram abençoados', 'Foram expulsos do jardim', 'Morreram imediatamente'], correct: 2, explanation: 'Deus os expulsou do jardim do Éden (Gênesis 3:23-24).' },
  ],
  gen_04: [
    { question: 'Quais eram os filhos de Adão e Eva mencionados em Gênesis 4?', options: ['Abraão e Isaque', 'Caim e Abel', 'Noé e Ló', 'Jacó e Esaú'], correct: 1, explanation: 'Adão conheceu Eva, sua mulher, e ela concebeu e deu à luz a Caim e depois a Abel (Gênesis 4:1-2).' },
    { question: 'O que Caim fez com Abel?', options: ['O abençoou', 'O ajudou', 'O matou', 'O abandonou'], correct: 2, explanation: 'Caim levantou-se contra seu irmão Abel e o matou (Gênesis 4:8).' },
    { question: 'O que Deus perguntou a Caim?', options: ['Por que você chorou?', 'Onde está Abel, seu irmão?', 'Onde você está?', 'O que você comeu?'], correct: 1, explanation: 'Deus disse a Caim: "Onde está Abel, teu irmão?" (Gênesis 4:9).' },
  ],
  gen_05: [
    { question: 'Por que Deus enviou o dilúvio?', options: ['Para testar os homens', 'Por causa da maldade dos homens', 'Para criar novos oceanos', 'Por diversão'], correct: 1, explanation: 'Deus viu que a maldade dos homens era grande na terra e decidiu destruí-los (Gênesis 6:5-7).' },
    { question: 'Por que Noé foi escolhido por Deus?', options: ['Por ser o mais rico', 'Por ser o mais forte', 'Por ser justo e íntegro', 'Por ser o mais velho'], correct: 2, explanation: 'Noé era um homem justo e íntegro entre seus contemporâneos (Gênesis 6:9).' },
    { question: 'Qual sinal Deus colocou no céu após o dilúvio?', options: ['Uma estrela', 'Uma nuvem', 'Um arco-íris', 'Uma pomba'], correct: 2, explanation: 'Deus colocou um arco-íris como sinal da aliança de que nunca mais destruiria a terra com o dilúvio (Gênesis 9:13).' },
  ],
  gen_06: [
    { question: 'O que as pessoas queriam construir em Babel?', options: ['Um templo', 'Uma torre que chegasse aos céus', 'Uma cidade murada', 'Um palácio'], correct: 1, explanation: 'Disseram: "vamos construir uma cidade e uma torre que chegue até o céu" (Gênesis 11:4).' },
    { question: 'O que Deus fez para impedir a construção?', options: ['Destruiu a torre', 'Confundiu as línguas dos homens', 'Enviou um dilúvio', 'Enviou anjos'], correct: 1, explanation: 'Deus confundiu a linguagem de toda a terra e dispersou os homens (Gênesis 11:7-9).' },
    { question: 'O que significa "Babel"?', options: ['Torre alta', 'Confusão', 'Grande cidade', 'Porta do céu'], correct: 1, explanation: 'Por isso foi chamada Babel, porque ali o Senhor confundiu a linguagem de toda a terra (Gênesis 11:9).' },
  ],
  gen_07: [
    { question: 'Para onde Deus chamou Abraão para ir?', options: ['Para o Egito', 'Para a terra que Ele mostraria', 'Para Babilônia', 'Para Canaã direto'], correct: 1, explanation: 'Deus disse: "Saia da sua terra... para a terra que eu lhe mostrarei" (Gênesis 12:1).' },
    { question: 'Qual promessa Deus fez a Abraão?', options: ['Riquezas e ouro', 'Farei de você uma grande nação e te abençoarei', 'Uma vida longa', 'Poder sobre seus inimigos'], correct: 1, explanation: '"Farei de você uma grande nação, e te abençoarei e engrandecerei o teu nome" (Gênesis 12:2).' },
    { question: 'Que nome Abraão tinha originalmente?', options: ['Isaque', 'Abrão', 'Abimeleque', 'Arão'], correct: 1, explanation: 'Seu nome original era Abrão, que depois foi mudado para Abraão (Gênesis 17:5).' },
  ],
  gen_08: [
    { question: 'Quantos filhos Deus prometeu a Abraão?', options: ['Um filho', 'Como as estrelas do céu', 'Apenas Isaque', 'Doze filhos'], correct: 1, explanation: '"Olha para o céu e conta as estrelas... assim será a tua descendência" (Gênesis 15:5).' },
    { question: 'O que Deus mudou no nome de Abrão?', options: ['Nada', 'Abrão para Abraão', 'Sarai para Sara', 'Ambos os nomes'], correct: 3, explanation: 'Deus mudou o nome de Abrão para Abraão e de Sarai para Sara (Gênesis 17:5,15).' },
    { question: 'Qual era o sinal da aliança entre Deus e Abraão?', options: ['O arco-íris', 'A circuncisão', 'O sacrifício', 'A pomba'], correct: 1, explanation: 'A circuncisão seria o sinal da aliança entre Deus e Abraão (Gênesis 17:11).' },
  ],
  gen_09: [
    { question: 'Por que Deus destruiu Sodoma e Gomorra?', options: ['Por guerras', 'Pela grande maldade de seus habitantes', 'Por não pagarem impostos', 'Por idolatria apenas'], correct: 1, explanation: 'O clamor contra Sodoma e Gomorra era grande e o seu pecado era gravíssimo (Gênesis 18:20).' },
    { question: 'Quem foi salvo da destruição de Sodoma?', options: ['Abraão', 'Ló e sua família', 'Todos os justos', 'Nenhuma pessoa'], correct: 1, explanation: 'Deus salvou Ló, tirando-o do meio da destruição (Gênesis 19:29).' },
    { question: 'O que aconteceu com a mulher de Ló?', options: ['Foi salva', 'Morreu de medo', 'Tornou-se estátua de sal', 'Voltou para Sodoma'], correct: 2, explanation: 'A mulher de Ló olhou para trás e tornou-se uma estátua de sal (Gênesis 19:26).' },
  ],
  gen_10: [
    { question: 'O que Deus pediu a Abraão que sacrificasse?', options: ['Um cordeiro', 'Seu filho Isaque', 'Gado e ovelhas', 'Pombas'], correct: 1, explanation: 'Deus disse: "tome seu filho, seu único filho Isaque... e o ofereça em holocausto" (Gênesis 22:2).' },
    { question: 'O que Deus providenciou no último momento?', options: ['Um anjo', 'Um cordeiro preso pelos chifres', 'Um milagre de fogo', 'Água do céu'], correct: 1, explanation: 'Abraão olhou e viu um carneiro preso pelos chifres num arbusto, e o ofereceu em holocausto (Gênesis 22:13).' },
    { question: 'O que esse episódio nos ensina sobre Deus?', options: ['Que Ele é cruel', 'Que Ele testa e provê', 'Que quer sacrifícios humanos', 'Que Isaque era especial'], correct: 1, explanation: 'Abraão chamou aquele lugar "O Senhor provê" — Deus testa nossa fé e sempre provê (Gênesis 22:14).' },
  ],
};

const DEFAULT_PROGRESS: UserProgress = {
  level: 1,
  goldCoins: 0,
  goldToNextLevel: 100,
  completedLessons: [],
  currentStreak: 0,
  totalLessons: 0,
  avatarStage: 1,
  talents: 0,
  purchasedItems: [],
  lastPlayedDate: new Date().toISOString().split('T')[0],
};

interface GameContextProps {
  userProgress: UserProgress | null;
  completeLesson: (lessonId: string, goldEarned: number) => Promise<void>;
  isLessonCompleted: (lessonId: string) => boolean;
  getAvatarStage: () => 1 | 2 | 3 | 4 | 5;
  purchaseItem: (itemId: string, cost: number) => Promise<boolean>;
  loading: boolean;
}

export const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem('kingdom_progress_v2');
      if (stored) {
        const parsed: UserProgress = JSON.parse(stored);
        const today = new Date().toISOString().split('T')[0];
        const lastPlayed = parsed.lastPlayedDate;
        if (today !== lastPlayed) {
          const diffDays = Math.ceil(
            Math.abs(new Date(today).getTime() - new Date(lastPlayed).getTime()) / (1000 * 60 * 60 * 24)
          );
          parsed.currentStreak = diffDays === 1 ? parsed.currentStreak + 1 : 0;
          parsed.lastPlayedDate = today;
        }
        if (!parsed.purchasedItems) parsed.purchasedItems = [];
        setUserProgress(parsed);
      } else {
        setUserProgress(DEFAULT_PROGRESS);
        await AsyncStorage.setItem('kingdom_progress_v2', JSON.stringify(DEFAULT_PROGRESS));
      }
    } catch (e) {
      console.error('Failed to load progress', e);
      setUserProgress(DEFAULT_PROGRESS);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarStageFromLevel = (level: number): 1 | 2 | 3 | 4 | 5 => {
    if (level <= 2) return 1;
    if (level <= 4) return 2;
    if (level <= 6) return 3;
    if (level <= 8) return 4;
    return 5;
  };

  const completeLesson = async (lessonId: string, goldEarned: number) => {
    if (!userProgress) return;
    const isFirstTime = !userProgress.completedLessons.includes(lessonId);
    let newGold = userProgress.goldCoins + goldEarned;
    let newLevel = userProgress.level;
    let newGoldToNext = userProgress.goldToNextLevel;

    while (newGold >= newGoldToNext) {
      newGold -= newGoldToNext;
      newLevel += 1;
      newGoldToNext = Math.floor(newGoldToNext * 1.5);
    }

    const newProgress: UserProgress = {
      ...userProgress,
      goldCoins: newGold,
      level: newLevel,
      goldToNextLevel: newGoldToNext,
      completedLessons: isFirstTime ? [...userProgress.completedLessons, lessonId] : userProgress.completedLessons,
      totalLessons: isFirstTime ? userProgress.totalLessons + 1 : userProgress.totalLessons,
      avatarStage: getAvatarStageFromLevel(newLevel),
      talents: userProgress.talents + (isFirstTime ? 10 : 2),
      lastPlayedDate: new Date().toISOString().split('T')[0],
    };

    setUserProgress(newProgress);
    await AsyncStorage.setItem('kingdom_progress_v2', JSON.stringify(newProgress));
  };

  const purchaseItem = async (itemId: string, cost: number): Promise<boolean> => {
    if (!userProgress) return false;
    if (userProgress.purchasedItems.includes(itemId)) return false;
    if (userProgress.goldCoins < cost) return false;

    const newProgress: UserProgress = {
      ...userProgress,
      goldCoins: userProgress.goldCoins - cost,
      purchasedItems: [...userProgress.purchasedItems, itemId],
    };
    setUserProgress(newProgress);
    await AsyncStorage.setItem('kingdom_progress_v2', JSON.stringify(newProgress));
    return true;
  };

  const isLessonCompleted = (lessonId: string) =>
    userProgress?.completedLessons.includes(lessonId) || false;

  return (
    <GameContext.Provider
      value={{
        userProgress,
        completeLesson,
        isLessonCompleted,
        getAvatarStage: () => (userProgress ? getAvatarStageFromLevel(userProgress.level) : 1),
        purchaseItem,
        loading,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
