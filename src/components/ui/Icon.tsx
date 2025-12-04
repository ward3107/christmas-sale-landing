// =============================================================================
// DYNAMIC ICON COMPONENT
// =============================================================================
// Renders Lucide React icons dynamically based on icon name string.
// This enables data-driven icon rendering from the config file.
// =============================================================================

import { LucideProps } from "lucide-react";
import {
  Clock,
  Shield,
  Scale,
  Users,
  Eye,
  TrendingUp,
  Building2,
  FileText,
  Lightbulb,
  Gavel,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Star,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Check,
  AlertCircle,
  Loader2,
  Send,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";
import { FC } from "react";

// Map of icon names to their components
const iconMap: Record<string, FC<LucideProps>> = {
  Clock,
  Shield,
  Scale,
  Users,
  Eye,
  TrendingUp,
  Building2,
  FileText,
  Lightbulb,
  Gavel,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Star,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Check,
  AlertCircle,
  Loader2,
  Send,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  // Alias for backward compatibility
  Handshake: Users,
};

export interface IconProps extends LucideProps {
  name: string;
}

export function Icon({ name, ...props }: IconProps) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }

  return <IconComponent {...props} />;
}

// Export individual icons for direct use if needed
export {
  Clock,
  Shield,
  Scale,
  Users,
  Eye,
  TrendingUp,
  Building2,
  FileText,
  Lightbulb,
  Gavel,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Star,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Check,
  AlertCircle,
  Loader2,
  Send,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
};

export default Icon;
