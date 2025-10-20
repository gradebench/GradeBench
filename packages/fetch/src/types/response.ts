export interface StandardResponse<T> {
	success: boolean;
	status_code: number;
	status_message: string;
	data: T | null;
	error: ResponseError | null;
	metadata: ResponseMetadata;
}

export interface ResponseError {
	code: string;
	message: string;
	details: ResponseErrorDetail | ResponseErrorDetail[] | null;
}

export interface ResponseMetadata {
	service: string;
	timestamp: string;
	request_id?: string;
	pagination?: number;
	location?: string;
}

export interface ResponsePagination {
	currentPage: number;
	pageSize: number;
	totalPages: number;
	totalItems: number;
}

export interface ResponseErrorDetail {
	[key: string]: unknown;
}
