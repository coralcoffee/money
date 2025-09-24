import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Link } from 'react-router';
import { NavigationMenu } from '@/components/NavigationMenu';
import cv_builder from '../../assets/cv_builder.avif';
import resume_builder from '../../assets/resume_builder.avif';
import coverletter_builder from '../../assets/coverletter_builder.png';

const TopNavMenu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-bold text-neutral-700">
            Builder
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px]">
              <ListItem
                title="AI Resume Builder"
                to="/builder/resume"
                image={resume_builder}
              >
                Millions have trusted our resume maker.
              </ListItem>
              <ListItem
                title="AI Cover Letter Generator"
                to="/builder/cover-letter"
                image={coverletter_builder}
              >
                Create a cover letter to land your dream job.
              </ListItem>
              <ListItem title="CV Maker" to="/builder/cv" image={cv_builder}>
                Easily build a CV that paves the way to your dream job.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

function ListItem({
  title,
  children,
  to,
  image,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & { to: string; image?: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild className="flex-row">
        <Link to={to} className="hover:bg-accent flex gap-3 rounded-lg p-3">
          {image && (
            <img
              src={image}
              alt={title}
              className="w-32 rounded-md object-cover"
            />
          )}
          <div className="ml-2">
            <div className="text-base font-medium leading-none">{title}</div>
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-snug">
              {children}
            </p>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
export default TopNavMenu;
