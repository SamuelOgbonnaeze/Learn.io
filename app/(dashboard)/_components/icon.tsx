import dynamic from 'next/dynamic';
import * as Lucide from 'lucide-react';

export type IconNames = keyof typeof Lucide.icons;

interface IconProps extends Lucide.LucideProps {
  name: IconNames;
}

const Icon = ({ name, ...props }: IconProps) => {
  // Check if the icon name is valid
  if (!Lucide.icons[name]) {
    console.error(`Invalid icon name: ${name}`);
    return null;
  }

  // Dynamically import the icon component
  const LucideIcon = dynamic(() =>
    import('lucide-react').then((mod) => mod[name])
  );

  return LucideIcon ? <LucideIcon {...props} /> : null;
};

export default Icon;
export type { IconProps };
