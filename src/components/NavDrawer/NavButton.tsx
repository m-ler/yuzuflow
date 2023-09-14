import { Button, ButtonProps } from '@nextui-org/react';
import { PropsWithChildren } from 'react';

type Props = ButtonProps & PropsWithChildren;

const NavButton = (props: Props) => {
	return <Button {...props} className="w-full rounded-none bg-transparent hover:bg-zinc-900 text-zinc-300 justify-start gap-4 px-4">{props.children}</Button>;
};

export default NavButton;
