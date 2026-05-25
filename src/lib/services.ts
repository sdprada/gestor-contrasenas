import {
  Mail,
  Facebook,
  Tv,
  Twitter,
  Github,
  Globe,
  type LucideIcon,
} from "lucide-react";

export type Service =
  | "gmail"
  | "facebook"
  | "netflix"
  | "twitter"
  | "github"
  | "other";

const SERVICES_MAP: Record<
  Service,
  { label: string; color: string; icon: LucideIcon }
> = {
  gmail: { label: "Gmail", color: "bg-svc-gmail", icon: Mail },
  facebook: { label: "Facebook", color: "bg-svc-facebook", icon: Facebook },
  netflix: { label: "Netflix", color: "bg-svc-netflix", icon: Tv },
  twitter: { label: "X / Twitter", color: "bg-svc-twitter", icon: Twitter },
  github: { label: "GitHub", color: "bg-svc-github", icon: Github },
  other: { label: "Otro", color: "bg-primary", icon: Globe },
};

export function getServiceInfo(key: string) {
  return (
    SERVICES_MAP[(key as Service) || "other"] || SERVICES_MAP.other
  );
}

export { SERVICES_MAP as SERVICES };
