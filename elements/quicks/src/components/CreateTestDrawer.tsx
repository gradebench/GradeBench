"use client";

import { Button } from "@gb/ui/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@gb/ui/components/ui/drawer";
import { Label } from "@gb/ui/components/ui/label";
import { UploadIcon, XIcon } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";

interface CreateTestDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateTestDrawer({
	open,
	onOpenChange,
}: CreateTestDrawerProps) {
	const fileUploadId = useId();
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setUploadedFiles(Array.from(e.target.files));
		}
	};

	const removeFile = (index: number) => {
		setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
	};

	const handleSubmit = () => {
		console.log({ uploadedFiles });
		toast.success("Test question paper uploaded successfully");
		onOpenChange(false);
		setUploadedFiles([]);
		// Redirect to test creation page
		const newTestId = `test-${Date.now()}`;
		window.location.href = `/quicks/tests/${newTestId}`;
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
			<DrawerContent className="h-[85vh]">
				<DrawerHeader className="px-8 py-6">
					<DrawerTitle className="text-2xl">Upload Question Paper</DrawerTitle>
					<DrawerDescription className="text-base">
						Upload your test question papers to create a new test
					</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 overflow-y-auto px-8 py-6">
					<div className="mx-auto max-w-4xl space-y-6">
						<div>
							<Label className="font-semibold text-lg">
								Upload Question Papers
							</Label>
							<div className="mt-4 flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed px-12 py-20">
								<label
									htmlFor={fileUploadId}
									className="flex cursor-pointer flex-col items-center"
								>
									<UploadIcon className="mb-4 h-16 w-16 text-muted-foreground" />
									<span className="mb-2 font-semibold text-lg">
										Click to upload or drag and drop
									</span>
									<span className="text-muted-foreground text-sm">
										PDF, PNG, JPG (max 10MB)
									</span>
									<input
										id={fileUploadId}
										type="file"
										multiple
										accept=".pdf,.png,.jpg,.jpeg"
										className="hidden"
										onChange={handleFileUpload}
									/>
								</label>
							</div>
						</div>

						{uploadedFiles.length > 0 && (
							<div className="space-y-4">
								<Label className="font-semibold text-lg">
									Uploaded Files ({uploadedFiles.length})
								</Label>
								<div className="space-y-3">
									{uploadedFiles.map((file, index) => (
										<div
											key={index}
											className="flex items-center justify-between rounded-lg border bg-muted/50 p-4"
										>
											<span className="text-base">{file.name}</span>
											<Button
												variant="ghost"
												size="default"
												onClick={() => removeFile(index)}
											>
												<XIcon className="h-5 w-5" />
											</Button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				<DrawerFooter className="px-8 py-6">
					<div className="flex gap-4">
						<DrawerClose asChild>
							<Button variant="outline" size="lg" className="flex-1 text-base">
								Cancel
							</Button>
						</DrawerClose>
						<Button
							onClick={handleSubmit}
							size="lg"
							className="flex-1 text-base"
							disabled={uploadedFiles.length === 0}
						>
							Upload & Create Test
						</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
