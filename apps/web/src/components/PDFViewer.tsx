"use client";

import { Button } from "@gb/ui/src/components/ui/button";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ZoomInIcon,
	ZoomOutIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up the worker for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
	url: string | null;
	currentPage: number;
	onPageChange: (page: number) => void;
	annotations?: Array<{
		page_number: number;
		coordinates: Array<{ x: number; y: number }>;
		color: string;
		annotation_type: string;
	}>;
}

export function PDFViewer({
	url,
	currentPage,
	onPageChange,
	annotations = [],
}: PDFViewerProps) {
	const [numPages, setNumPages] = useState<number>(0);
	const [scale, setScale] = useState<number>(1.0);

	const onDocumentLoadSuccess = useCallback(
		({ numPages }: { numPages: number }) => {
			setNumPages(numPages);
		},
		[],
	);

	const onDocumentLoadError = useCallback((error: Error) => {
		console.error("Error loading PDF:", error);
	}, []);

	const goToPrevPage = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};

	const goToNextPage = () => {
		if (currentPage < numPages) {
			onPageChange(currentPage + 1);
		}
	};

	const zoomIn = () => {
		setScale((prev) => Math.min(prev + 0.2, 2.5));
	};

	const zoomOut = () => {
		setScale((prev) => Math.max(prev - 0.2, 0.5));
	};

	// Get annotations for current page
	const currentPageAnnotations = annotations.filter(
		(ann) => ann.page_number === currentPage,
	);

	if (!url) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-muted-foreground">No PDF available</p>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col bg-background">
			{/* Controls */}
			<div className="flex items-center justify-between border-b bg-background px-4 py-2">
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={goToPrevPage}
						disabled={currentPage <= 1}
					>
						<ChevronLeftIcon className="h-4 w-4" />
					</Button>
					<span className="text-muted-foreground text-sm">
						Page {currentPage} of {numPages || "?"}
					</span>
					<Button
						variant="outline"
						size="sm"
						onClick={goToNextPage}
						disabled={currentPage >= numPages}
					>
						<ChevronRightIcon className="h-4 w-4" />
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={zoomOut}
						disabled={scale <= 0.5}
					>
						<ZoomOutIcon className="h-4 w-4" />
					</Button>
					<span className="text-muted-foreground text-sm">
						{Math.round(scale * 100)}%
					</span>
					<Button
						variant="outline"
						size="sm"
						onClick={zoomIn}
						disabled={scale >= 2.5}
					>
						<ZoomInIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* PDF Document - Scrollable Container */}
			<div className="relative flex-1 overflow-auto bg-gradient-to-b from-muted/30 to-muted/10">
				<div className="flex min-h-full items-start justify-center p-6">
					<div className="relative">
						<Document
							file={url}
							onLoadSuccess={onDocumentLoadSuccess}
							onLoadError={onDocumentLoadError}
							loading={
								<div className="flex h-[800px] w-[600px] items-center justify-center rounded-lg border bg-white shadow-sm">
									<div className="text-center">
										<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
										<p className="text-muted-foreground">Loading PDF...</p>
									</div>
								</div>
							}
							error={
								<div className="flex h-[800px] w-[600px] items-center justify-center rounded-lg border bg-white shadow-sm">
									<div className="text-center">
										<p
											className={["mb-2", "font-semibold", "text-red-500"].join(
												" ",
											)}
										>
											Failed to load PDF
										</p>
										<p className="text-muted-foreground text-sm">
											Please check the PDF URL or try again
										</p>
									</div>
								</div>
							}
							options={{
								cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
								cMapPacked: true,
							}}
						>
							<div
								className={[
									"overflow-hidden",
									"rounded-lg",
									"shadow-lg",
									"bg-white",
								].join(" ")}
							>
								<Page
									pageNumber={currentPage}
									scale={scale}
									renderTextLayer={true}
									renderAnnotationLayer={true}
									loading={
										<div className="flex h-[800px] w-[600px] items-center justify-center bg-white">
											<p className="text-muted-foreground">Rendering page...</p>
										</div>
									}
								/>
							</div>
						</Document>

						{/* Overlay annotations */}
						{currentPageAnnotations.length > 0 && (
							<svg
								className={[
									"pointer-events-none",
									"absolute",
									"left-0",
									"top-0",
								].join(" ")}
								style={{
									width: "100%",
									height: "100%",
								}}
								aria-label="PDF Annotations Overlay"
							>
								<title>Annotations</title>
								{currentPageAnnotations.map((annotation, idx) => {
									const coords = annotation.coordinates;
									if (coords.length < 2) return null;

									const x1 = coords[0].x * 100;
									const y1 = coords[0].y * 100;
									const x2 = coords[2]?.x * 100 || coords[1].x * 100;
									const y2 = coords[2]?.y * 100 || coords[1].y * 100;

									if (annotation.annotation_type === "underline") {
										return (
											<line
												key={idx}
												x1={`${x1}%`}
												y1={`${y2}%`}
												x2={`${x2}%`}
												y2={`${y2}%`}
												stroke={annotation.color}
												strokeWidth="2"
											/>
										);
									}

									if (annotation.annotation_type === "circle") {
										return (
											<ellipse
												key={idx}
												cx={`${(x1 + x2) / 2}%`}
												cy={`${(y1 + y2) / 2}%`}
												rx={`${Math.abs(x2 - x1) / 2}%`}
												ry={`${Math.abs(y2 - y1) / 2}%`}
												fill="none"
												stroke={annotation.color}
												strokeWidth="2"
											/>
										);
									}

									if (annotation.annotation_type === "highlight") {
										return (
											<rect
												key={idx}
												x={`${Math.min(x1, x2)}%`}
												y={`${Math.min(y1, y2)}%`}
												width={`${Math.abs(x2 - x1)}%`}
												height={`${Math.abs(y2 - y1)}%`}
												fill={annotation.color}
												opacity="0.3"
											/>
										);
									}

									return null;
								})}
							</svg>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
