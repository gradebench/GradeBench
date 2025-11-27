export const safeExecute = async <T, E = Error>(
	cb: () => Promise<T>,
): Promise<[T, undefined] | [undefined, E]> => {
	try {
		const data = await cb();
		return [data, undefined];
	} catch (e) {
		return [undefined, e as E];
	}
};
