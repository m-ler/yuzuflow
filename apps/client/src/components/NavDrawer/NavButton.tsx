import { useMediaQuery } from '@/hooks/useMediaQuery';
import { navDrawerState } from '@/store/nav-drawer';
import { Button, ButtonProps } from '@nextui-org/react';
import { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';

type Props = {
	route: string;
} & ButtonProps &
	PropsWithChildren;

const NavButton = (props: Props) => {
	const smallScreen = useMediaQuery('(max-width: 640px)');
	const { setOpen } = navDrawerState();

	return (
		<NavLink to={props.route} className={({ isActive }) => (isActive ? '[&>button]:bg-zinc-900' : '')}>
			<Button
				{...props}
				className="w-full rounded-none bg-transparent hover:bg-zinc-900 text-zinc-300 justify-start gap-4 px-4"
				onClick={() => smallScreen && setOpen(false)}
			>
				{props.children}
			</Button>
		</NavLink>
	);
};

export default NavButton;
