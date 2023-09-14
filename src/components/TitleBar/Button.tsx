import { PropsWithChildren } from 'react';
import { ButtonProps, Button as NextUIButton } from '@nextui-org/react';

type Props = ButtonProps & PropsWithChildren;

const Button = (props: Props) => {
	return (
		<NextUIButton
			{...props}
			isIconOnly
			className={`flex items-center rounded-none bg-transparent w-[58px] h-full max-h-full hover:bg-zinc-800 cursor-default shrink-0 ${props.className}`}
		>
			{props.children}
		</NextUIButton>
	);
};

export default Button;
