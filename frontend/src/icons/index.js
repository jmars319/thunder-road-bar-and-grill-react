// Centralized icon exports — re-export icons from lucide-react here so
// components import from a single module. This reduces per-file lint noise
// and centralizes any future icon substitutions.
export {
  Menu,
  X,
  LogOut,
  Home,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  LayoutDashboard,
  Users,
  Calendar,
  Briefcase,
  TrendingUp,
  Inbox,
  Mail,
  MailOpen,
  Trash2,
  UtensilsCrossed,
  Plus,
  Edit,
  XCircle,
  Clock,
  Image,
  Upload,
  Copy,
  Settings,
  Save,
  Download,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

// Note: keep this module intentionally thin — it's a single re-export layer
// so we can swap the underlying icon package in one place later if needed.
