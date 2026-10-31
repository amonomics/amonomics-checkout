export interface Maintainer {
  name: string;
  avatar: string;
  role: string;
  github: string;
}

export interface SustainabilityNeed {
  category: string;
  description: string;
  costMonthly: number;
  urgency: 'critical' | 'moderate' | 'healthy';
}

export interface Project {
  id: string;
  name: string;
  repo: string;
  tagline: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  prsMerged: number;
  monthlyGoal: number;
  currentMonthlyFunding: number;
  backersCount: number;
  primaryLanguage: string;
  license: string;
  maintainers: Maintainer[];
  sustainabilityNeeds: SustainabilityNeed[];
}

export interface AIThankYouNote {
  letter: string;
  impactStatement: string;
  maintainerBadge: string;
  tributeSnippet: string;
  quote: string;
}

export interface Backer {
  id: string;
  projectId: string;
  projectName: string;
  donorName: string;
  donorGithub?: string;
  isAnonymous: boolean;
  amount: number;
  frequency: 'once' | 'monthly';
  tierTitle: string;
  tierId: string;
  customMessage?: string;
  createdAt: string;
  impactArea?: string;
  aiThankYouNote: AIThankYouNote;
}

export interface SupportTier {
  id: string;
  title: string;
  amount: number;
  popular?: boolean;
  icon: string;
  description: string;
  perks: string[];
  impactArea: string;
  colorScheme: {
    badge: string;
    border: string;
    glow: string;
  };
}
