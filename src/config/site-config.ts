/**
 * ============================================================================
 * SITE CONFIGURATION FILE
 * ============================================================================
 * 
 * This file contains ALL editable content for the landing page.
 * Edit the values below to customize your course landing page.
 * 
 * All text, images, prices, and colors can be modified here.
 * 
 * ============================================================================
 */

// ============================================================================
// SITE BASICS
// ============================================================================
export const siteConfig = {
  // Site meta information
  site: {
    title: "Formação IA VÍDEO PRO",
    description: "Aprenda a criar vídeos incríveis com Inteligência Artificial do zero ao avançado",
    url: "https://www.otalesramiro.com",
    language: "pt-BR",
  },

  // ============================================================================
  // HERO SECTION - Main banner at the top
  // ============================================================================
  hero: {
    badge: "NOVA TURMA 2025",
    title: "Formação IA VÍDEO PRO",
    subtitle: "Aprenda a criar vídeos profissionais com Inteligência Artificial",
    description: "Domine as melhores ferramentas de IA para criar vídeos incríveis, do zero ao avançado, mesmo sem experiência prévia.",
    ctaButton: "QUERO ENTRAR NA LISTA DE ESPERA",
    secondaryButton: "SAIBA MAIS",
    originalPrice: "R$ 497",
    currentPrice: "R$ 297",
    discountText: "40% OFF - Vagas Limitadas",
    // Hero image - replace with your own image URL
    image: "/hero-image.png",
    imageAlt: "Formação IA Vídeo Pro - Curso de criação de vídeos com IA",
  },

  // ============================================================================
  // WARNING SECTION - Alert/benefits banner
  // ============================================================================
  warning: {
    icon: "alert",
    title: "Atenção: Essa formação vai mudar a forma como você cria vídeos!",
    items: [
      "Aprenda a usar IA para criar roteiros profissionais",
      "Gere imagens e vídeos com inteligência artificial",
      "Edite seus vídeos de forma automática",
      "Crie conteúdo viral para redes sociais",
    ],
  },

  // ============================================================================
  // FEATURES SECTION - Course features cards
  // ============================================================================
  features: {
    title: "O que você vai ter acesso",
    subtitle: "Tudo que você precisa para dominar a criação de vídeos com IA",
    items: [
      {
        icon: "certificate",
        title: "Certificado",
        description: "Certificado de conclusão reconhecido mercado aupon conclusão do curso",
      },
      {
        icon: "clock",
        title: "2 Anos de Acesso",
        description: "Acesso completo ao curso por 2 anos com todas as atualizações",
      },
      {
        icon: "users",
        title: "Grupo e Suporte",
        description: "Comunidade exclusiva com suporte direto com o instrutor",
      },
      {
        icon: "rocket",
        title: "Do Início ao Avançado",
        description: "Conteúdo completo para todos os níveis, do básico ao profissional",
      },
    ],
  },

  // ============================================================================
  // CREATIVITY SECTION - Creative possibilities
  // ============================================================================
  creativity: {
    title: "Liberte sua Criatividade com IA",
    description: "Descubra como a inteligência artificial pode transformar suas ideias em vídeos impressionantes. Com as ferramentas certas, você será capaz de criar conteúdo que antes parecia impossível.",
    highlights: [
      "Crie vídeos cinematográficos com IA generativa",
      "Transforme texto em vídeo automaticamente",
      "Gere vozes realistas com clonagem de voz",
      "Produza conteúdo para todas as plataformas",
    ],
    image: "/creativity-image.png",
    imageAlt: "Criatividade com IA",
  },

  // ============================================================================
  // COURSE MODULES - What's included in the course
  // ============================================================================
  modules: {
    title: "Conteúdo do Curso",
    subtitle: "Módulos completos para você dominar a criação de vídeos com IA",
    items: [
      {
        number: "01",
        title: "Introdução à IA para Vídeos",
        description: "Conheça as principais ferramentas e conceitos de IA aplicados à produção de vídeos",
        lessons: 8,
      },
      {
        number: "02",
        title: "Criação de Roteiros com IA",
        description: "Aprenda a usar ChatGPT e outras IAs para criar roteiros profissionais",
        lessons: 12,
      },
      {
        number: "03",
        title: "Geração de Imagens",
        description: "Domine Midjourney, DALL-E e outras ferramentas para criar imagens incríveis",
        lessons: 15,
      },
      {
        number: "04",
        title: "Vídeos com IA Generativa",
        description: "Crie vídeos do zero usando Runway, Pika Labs e outras ferramentas",
        lessons: 18,
      },
      {
        number: "05",
        title: "Edição Automatizada",
        description: "Use IA para editar seus vídeos de forma rápida e profissional",
        lessons: 10,
      },
      {
        number: "06",
        title: "Voz e Narração com IA",
        description: "Gere vozes realistas e clone vozes para suas produções",
        lessons: 8,
      },
      {
        number: "07",
        title: "Projetos Práticos",
        description: "Coloque a mão na massa com projetos reais e desafios",
        lessons: 20,
      },
    ],
  },

  // ============================================================================
  // PRICING SECTION - Course prices
  // ============================================================================
  pricing: {
    title: "Invista na sua Carreira",
    subtitle: "Escolha o plano que melhor se adapta a você",
    plans: [
      {
        name: "Pagamento à Vista",
        originalPrice: "R$ 497",
        currentPrice: "R$ 297",
        discount: "40% OFF",
        description: "Melhor valor - Economize R$ 200",
        features: [
          "Acesso completo ao curso",
          "2 anos de acesso",
          "Certificado incluso",
          "Grupo exclusivo",
          "Suporte direto",
          "Todas as atualizações",
        ],
        highlighted: true,
        buttonText: "QUERO COMEÇAR AGORA",
      },
      {
        name: "Parcelado em 12x",
        originalPrice: "",
        currentPrice: "12x R$ 29,70",
        discount: "",
        description: "Comece agora e pague em parcelas",
        features: [
          "Acesso completo ao curso",
          "2 anos de acesso",
          "Certificado incluso",
          "Grupo exclusivo",
          "Suporte direto",
          "Todas as atualizações",
        ],
        highlighted: false,
        buttonText: "QUERO PARCELAR",
      },
    ],
  },

  // ============================================================================
  // BONUSES SECTION - Extra bonuses included
  // ============================================================================
  bonuses: {
    title: "Bônus Exclusivos",
    subtitle: "Ganhe mais valor com esses bônus especiais",
    items: [
      {
        icon: "gift",
        title: "Pack de Prompts",
        description: "Mais de 500 prompts prontos para usar em ChatGPT, Midjourney e outras IAs",
        value: "R$ 97",
      },
      {
        icon: "video",
        title: "Masterclass de YouTube",
        description: "Aula exclusiva sobre como crescer no YouTube usando IA",
        value: "R$ 147",
      },
      {
        icon: "zap",
        title: "Templates de Vídeo",
        description: "Templates prontos para editar seus vídeos mais rápido",
        value: "R$ 67",
      },
      {
        icon: "book",
        title: "E-book de Roteiros",
        description: "Guia completo para criar roteiros virais com IA",
        value: "R$ 47",
      },
    ],
    totalValue: "Valor Total dos Bônus: R$ 358",
  },

  // ============================================================================
  // PROJECTS/GALLERY SECTION - Before and after examples
  // ============================================================================
  projects: {
    title: "Resultados dos Alunos",
    subtitle: "Veja o que nossos alunos estão criando com o que aprenderam",
    items: [
      {
        title: "Vídeo Promocional",
        description: "Vídeo criado 100% com IA para uma marca de roupas",
        beforeImage: "/project-1-before.png",
        afterImage: "/project-1-after.png",
        beforeLabel: "Antes",
        afterLabel: "Depois",
      },
      {
        title: "Conteúdo para Instagram",
        description: "Reels viral criado com ferramentas de IA",
        beforeImage: "/project-2-before.png",
        afterImage: "/project-2-after.png",
        beforeLabel: "Antes",
        afterLabel: "Depois",
      },
      {
        title: "Vídeo Institucional",
        description: "Apresentação profissional para empresa",
        beforeImage: "/project-3-before.png",
        afterImage: "/project-3-after.png",
        beforeLabel: "Antes",
        afterLabel: "Depois",
      },
      {
        title: "Animação com IA",
        description: "Animação criada do zero com IA generativa",
        beforeImage: "/project-4-before.png",
        afterImage: "/project-4-after.png",
        beforeLabel: "Antes",
        afterLabel: "Depois",
      },
    ],
  },

  // ============================================================================
  // INSTRUCTOR SECTION - About the teacher
  // ============================================================================
  instructor: {
    title: "Conheça seu Instrutor",
    name: "Tales Ramiro",
    role: "Especialista em IA e Produção de Vídeo",
    bio: "Com mais de 10 anos de experiência em produção de vídeo e 5 anos trabalhando com inteligência artificial, Tales Ramiro já ajudou milhares de pessoas a dominarem essas tecnologias. Formado em Produção Audiovisual e com especializações em IA, ele é referência no mercado brasileiro de criação de conteúdo com inteligência artificial.",
    image: "/instructor.png",
    imageAlt: "Tales Ramiro - Instrutor",
    stats: [
      {
        value: "10K+",
        label: "Alunos Formados",
      },
      {
        value: "500K+",
        label: "Seguidores",
      },
      {
        value: "5+",
        label: "Anos com IA",
      },
      {
        value: "100+",
        label: "Aulas Criadas",
      },
    ],
    socialLinks: {
      instagram: "https://instagram.com/talesramiro",
      youtube: "https://youtube.com/@talesramiro",
      linkedin: "https://linkedin.com/in/talesramiro",
    },
  },

  // ============================================================================
  // GUARANTEE SECTION - Money back guarantee
  // ============================================================================
  guarantee: {
    title: "Garantia de 7 Dias",
    description: "Sua satisfação é nossa prioridade! Se por qualquer motivo você não ficar satisfeito com o curso, basta solicitar o reembolso em até 7 dias e devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.",
    icon: "shield",
    badge: "100% Seguro",
  },

  // ============================================================================
  // FAQ SECTION - Frequently asked questions
  // ============================================================================
  faq: {
    title: "Perguntas Frequentes",
    subtitle: "Tire suas dúvidas sobre o curso",
    items: [
      {
        question: "Preciso ter experiência prévia com vídeo ou IA?",
        answer: "Não! O curso foi desenvolvido para todos os níveis. Começamos do zero e avançamos gradualmente, garantindo que você aprenda no seu ritmo.",
      },
      {
        question: "Por quanto tempo terei acesso ao curso?",
        answer: "Você terá acesso completo ao curso por 2 anos, incluindo todas as atualizações e novos conteúdos que forem adicionados.",
      },
      {
        question: "Quais ferramentas vou aprender a usar?",
        answer: "Você vai aprender a usar ChatGPT, Midjourney, DALL-E, Runway, Pika Labs, ElevenLabs, CapCut AI, Adobe Firefly e muitas outras ferramentas de ponta.",
      },
      {
        question: "O curso emite certificado?",
        answer: "Sim! Ao concluir o curso, você receberá um certificado de conclusão reconhecido pelo mercado que pode ser adicionado ao seu LinkedIn.",
      },
      {
        question: "Como funciona o suporte?",
        answer: "Você terá acesso a um grupo exclusivo no Telegram onde pode tirar dúvidas diretamente com o instrutor e interagir com outros alunos.",
      },
      {
        question: "Posso parcelar o pagamento?",
        answer: "Sim! Oferecemos parcelamento em até 12x no cartão de crédito. Você também pode pagar à vista com desconto especial.",
      },
      {
        question: "E se eu não gostar do curso?",
        answer: "Oferecemos garantia de 7 dias. Se não ficar satisfeito, basta solicitar o reembolso e devolvemos 100% do valor pago.",
      },
      {
        question: "O curso é ao vivo ou gravado?",
        answer: "O curso é totalmente gravado e disponível na plataforma de ensino. Assim você pode assistir quando e onde quiser, no seu próprio ritmo.",
      },
    ],
  },

  // ============================================================================
  // FOOTER SECTION - Contact and copyright
  // ============================================================================
  footer: {
    copyright: "© 2025 Formação IA Vídeo Pro. Todos os direitos reservados.",
    links: [
      { label: "Termos de Uso", href: "/termos" },
      { label: "Política de Privacidade", href: "/privacidade" },
    ],
  },

  // ============================================================================
  // WHATSAPP - Floating button and contact
  // ============================================================================
  whatsapp: {
    number: "5511999999999",
    message: "Olá! Tenho interesse na Formação IA Vídeo PRO!",
    tooltip: "Fale conosco no WhatsApp",
  },

  // ============================================================================
  // COLORS THEME - Customizable color scheme
  // ============================================================================
  colors: {
    primary: "#8B5CF6", // Purple
    secondary: "#EC4899", // Pink
    accent: "#06B6D4", // Cyan
    background: "#0A0A0A", // Dark black
    surface: "#1A1A1A", // Dark gray
    text: "#FFFFFF", // White
    textMuted: "#A1A1AA", // Gray
    gradient: {
      primary: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
      secondary: "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)",
      glow: "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)",
    },
  },
} as const;

// Type export for TypeScript users
export type SiteConfig = typeof siteConfig;
