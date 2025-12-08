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
		<h1
			className={cn(
				"scroll-m-20 text-balance text-center font-extrabold text-4xl tracking-tight",
				className,
			)}
			{...props}
		>
			{children}
		</h1>
	);
};

export const H2 = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"h2">) => {
	return (
		<h2
			className={cn(
				"scroll-m-20 border-b pb-2 font-semibold text-3xl tracking-tight first:mt-0",
				className,
			)}
			{...props}
		>
			{children}
		</h2>
	);
};

export const H3 = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"h3">) => {
	return (
		<h3
			className={cn(
				"scroll-m-20 font-semibold text-2xl tracking-tight",
				className,
			)}
			{...props}
		>
			{children}
		</h3>
	);
};

export const H4 = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"h4">) => {
	return (
		<h4
			className={cn(
				"scroll-m-20 font-semibold text-xl tracking-tight",
				className,
			)}
			{...props}
		>
			{children}
		</h4>
	);
};

export const P = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"p">) => {
	return (
		<p
			className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
			{...props}
		>
			{children}
		</p>
	);
};

export const BlockQuote = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"blockquote">) => {
	return (
		<blockquote
			className={cn("mt-6 border-l-2 pl-6 italic", className)}
			{...props}
		>
			{children}
		</blockquote>
	);
};

export const ListView = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"ul">) => {
	return (
		<ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props}>
			{children}
		</ul>
	);
};

export const InlineCode = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"code">) => {
	return (
		<code
			className={cn(
				"relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold text-sm",
				className,
			)}
			{...props}
		>
			{children}
		</code>
	);
};

export const Lead = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"p">) => {
	return (
		<p className={cn("text-muted-foreground text-xl", className)} {...props}>
			{children}
		</p>
	);
};

export const Large = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"div">) => {
	return (
		<div className={cn("font-semibold text-lg", className)} {...props}>
			{children}
		</div>
	);
};

export const Small = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"small">) => {
	return (
		<small
			className={cn("font-medium text-sm leading-none", className)}
			{...props}
		>
			{children}
		</small>
	);
};

export const Muted = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"p">) => {
	return (
		<p className={cn("text-muted-foreground text-sm", className)} {...props}>
			{children}
		</p>
	);
};

export const TableContainer = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"div">) => {
	return (
		<div className={cn("my-6 w-full overflow-y-auto", className)} {...props}>
			{children}
		</div>
	);
};

export const Table = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"table">) => {
	return (
		<table className={cn("w-full", className)} {...props}>
			{children}
		</table>
	);
};

export const TR = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"tr">) => {
	return (
		<tr className={cn("m-0 border-t p-0 even:bg-muted", className)} {...props}>
			{children}
		</tr>
	);
};

export const TH = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"th">) => {
	return (
		<th
			className={cn(
				"border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
				className,
			)}
			{...props}
		>
			{children}
		</th>
	);
};

export const TD = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"td">) => {
	return (
		<td
			className={cn(
				"border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
				className,
			)}
			{...props}
		>
			{children}
		</td>
	);
};
