import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { SiMeetup, SiX, SiDiscord } from 'react-icons/si';
import { profile } from '../data/siteData';
import { soundManager } from '../utils/soundEffects';

const SOCIALS = [
  { icon: FiGithub, href: profile.links.github, label: 'GitHub' },
  { icon: FiLinkedin, href: profile.links.linkedin, label: 'LinkedIn' },
  { icon: FiMail, href: profile.links.email, label: 'Email' },
  { icon: SiMeetup, href: profile.links.meetup, label: 'Meetup' },
  { icon: SiX, href: profile.links.twitter, label: 'X (Twitter)' },
  { icon: SiDiscord, href: profile.links.discord, label: 'Discord' },
];

export default function SocialNav() {
  return (
    <aside className="social-dock" aria-label="Social Profiles">
      <div className="social-dock-inner">
        {SOCIALS.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="social-dock-btn"
            aria-label={label}
            title={label}
            onMouseEnter={() => soundManager.playHover()}
            onClick={() => soundManager.playClick()}
          >
            <Icon size={16} />
            <span className="social-tooltip">{label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
