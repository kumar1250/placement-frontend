import {
  Code2,
  FileCode2,
  Coffee,
  LayoutPanelTop,
  Atom,
  Server,
  Layers,
  BarChart3,
  Brain,
  Cpu,
  Sparkles,
  Settings,
  Cloud,
  Shield,
  Database,
  CheckCircle2,
  Briefcase,
  Users,
  PenLine,
  HelpCircle,
} from "lucide-react";

const ICONS = {
  code: Code2,
  python: FileCode2,
  coffee: Coffee,
  layout: LayoutPanelTop,
  atom: Atom,
  server: Server,
  layers: Layers,
  "bar-chart": BarChart3,
  brain: Brain,
  cpu: Cpu,
  sparkles: Sparkles,
  settings: Settings,
  cloud: Cloud,
  shield: Shield,
  database: Database,
  "check-circle": CheckCircle2,
  briefcase: Briefcase,
  users: Users,
  edit: PenLine,
};

export function getDomainIcon(key) {
  return ICONS[key] || HelpCircle;
}
