import { cn } from "@gb/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

interface TypoProps {
	className?: string;
	children: ReactNode;
}

const H1 = ({
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

const H2 = ({
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

const H3 = ({
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

const H4 = ({
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

const P = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"p">) => {
	return (
		<p className={cn("not-first:mt-6 leading-7", className)} {...props}>
			{children}
		</p>
	);
};

const BlockQuote = ({
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

const ListView = ({
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

const InlineCode = ({
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

const Lead = ({
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

const Large = ({
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

const Small = ({
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

const Muted = ({
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

const TableContainer = ({
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

const Table = ({
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

const TR = ({
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

const TH = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"th">) => {
	return (
		<th
			className={cn(
				"border px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right",
				className,
			)}
			{...props}
		>
			{children}
		</th>
	);
};

const TD = ({
	className,
	children,
	...props
}: TypoProps & ComponentProps<"td">) => {
	return (
		<td
			className={cn(
				"border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right",
				className,
			)}
			{...props}
		>
			{children}
		</td>
	);
};

export {
	BlockQuote,
	H1,
	H2,
	H3,
	H4,
	InlineCode,
	Large,
	Lead,
	ListView,
	Muted,
	P,
	Small,
	Table,
	TableContainer,
	TD,
	TH,
	TR,
};
