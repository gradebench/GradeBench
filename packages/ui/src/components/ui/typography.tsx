import { cn } from "@gb/ui/lib/utils";
import type { ComponentProps, ReactNode } from "react";

interface TypoProps {
	className?: string;
	children: ReactNode;
}

export const H1 = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"h1">) => {
	return (
		<>
			<h1
				className={cn(
					"scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
					className,
				)}
				{...props}
			>
				{children}
			</h1>
		</>
	);
};

export const H2 = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"h2">) => {
	return (
		<>
			<h2
				className={cn(
					"scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
					className,
				)}
				{...props}
			>
				{children}
			</h2>
		</>
	);
};

export const H3 = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"h3">) => {
	return (
		<>
			<h3
				className={cn(
					"scroll-m-20 text-2xl font-semibold tracking-tight",
					className,
				)}
				{...props}
			>
				{children}
			</h3>
		</>
	);
};

export const H4 = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"h4">) => {
	return (
		<>
			<h4
				className={cn(
					"scroll-m-20 text-xl font-semibold tracking-tight",
					className,
				)}
				{...props}
			>
				{children}
			</h4>
		</>
	);
};

export const P = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"p">) => {
	return (
		<>
			<p
				className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
				{...props}
			>
				{children}
			</p>
		</>
	);
};

export const BlockQuote = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"blockquote">) => {
	return (
		<>
			<blockquote
				className={cn("mt-6 border-l-2 pl-6 italic", className)}
				{...props}
			>
				{children}
			</blockquote>
		</>
	);
};

export const ListView = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"ul">) => {
	return (
		<>
			<ul
				className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
				{...props}
			>
				{children}
			</ul>
		</>
	);
};

export const InlineCode = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"code">) => {
	return (
		<>
			<code
				className={cn(
					"bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
					className,
				)}
				{...props}
			>
				{children}
			</code>
		</>
	);
};

export const Lead = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"p">) => {
	return (
		<>
			<p className={cn("text-muted-foreground text-xl", className)} {...props}>
				{children}
			</p>
		</>
	);
};

export const Large = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"div">) => {
	return (
		<>
			<div className={cn("text-lg font-semibold", className)} {...props}>
				{children}
			</div>
		</>
	);
};

export const Small = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"small">) => {
	return (
		<>
			<small
				className={cn("text-sm leading-none font-medium", className)}
				{...props}
			>
				{children}
			</small>
		</>
	);
};

export const Muted = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"p">) => {
	return (
		<>
			<p className={cn("text-muted-foreground text-sm", className)} {...props}>
				{children}
			</p>
		</>
	);
};

export const Table = ({
	className,
	tableStyle,
	children,
	...props
}: TypoProps & ComponentProps<"table"> & { tableStyle?: string }) => {
	return (
		<>
			<div className={cn("my-6 w-full overflow-y-auto", className)}>
				<table className={cn("w-full", tableStyle)} {...props}>
					{children}
				</table>
			</div>
		</>
	);
};

export const TR = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"tr">) => {
	return (
		<>
			<tr
				className={cn("even:bg-muted m-0 border-t p-0", className)}
				{...props}
			>
				{children}
			</tr>
		</>
	);
};

export const TH = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"th">) => {
	return (
		<>
			<th
				className={cn(
					"border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
					className,
				)}
				{...props}
			>
				{children}
			</th>
		</>
	);
};

export const TD = ({
	className,
	children,
	...prpos
}: TypoProps & ComponentProps<"td">) => {
	return (
		<>
			<td
				className={cn(
					"border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
					className,
				)}
				{...prpos}
			>
				{children}
			</td>
		</>
	);
};
