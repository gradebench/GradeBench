"use client";

import { Button } from "@gb/ui/src/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@gb/ui/src/components/ui/drawer";
import { Input } from "@gb/ui/src/components/ui/input";
import { Label } from "@gb/ui/src/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@gb/ui/src/components/ui/select";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CreateAcademicTestDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onTestCreated?: () => void;
}

interface QuestionPaper {
	id: string;
	name: string;
}

interface EvaluatorConfiguration {
	id: string;
	config_name: string;
}

export function CreateAcademicTestDrawer({
	open,
	onOpenChange,
	onTestCreated,
}: CreateAcademicTestDrawerProps) {
	const router = useRouter();
	const [testName, setTestName] = useState("");
	const [questionPaperId, setQuestionPaperId] = useState("");
	const [evaluatorConfigId, setEvaluatorConfigId] = useState("");
	const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
	const [evaluatorConfigs, setEvaluatorConfigs] = useState<
		EvaluatorConfiguration[]
	>([]);
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(true);

	const API_BASE_URL = "http://localhost:8083/grade/v1";

	useEffect(() => {
		if (open) {
			fetchData();
		}
	}, [open]);

	const fetchData = async () => {
		setFetching(true);
		try {
			const [qpResponse, ecResponse] = await Promise.all([
				fetch(`${API_BASE_URL}/question-papers`),
				fetch(`${API_BASE_URL}/evaluator-configurations`),
			]);

			if (qpResponse.ok) {
				const qpData = await qpResponse.json();
				if (qpData.success && qpData.data?.question_papers) {
					setQuestionPapers(qpData.data.question_papers);
				}
			}

			if (ecResponse.ok) {
				const ecData = await ecResponse.json();
				if (ecData.success && ecData.data?.evaluator_configurations) {
					setEvaluatorConfigs(ecData.data.evaluator_configurations);
				}
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			toast.error("Failed to load options");
		} finally {
			setFetching(false);
		}
	};

	const handleSubmit = async () => {
		if (!testName.trim()) {
			toast.error("Please enter a test name");
			return;
		}

		if (!questionPaperId) {
			toast.error("Please select a question paper");
			return;
		}

		if (!evaluatorConfigId) {
			toast.error("Please select an evaluator configuration");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(`${API_BASE_URL}/academic-tests`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					test_name: testName.trim(),
					question_paper_id: questionPaperId,
					evaluator_configuration_id: evaluatorConfigId,
				}),
			});

			const result = await response.json();

			if (result.success && response.ok) {
				toast.success("Test created successfully");
				setTestName("");
				setQuestionPaperId("");
				setEvaluatorConfigId("");
				onOpenChange(false);
				onTestCreated?.();
			} else {
				throw new Error(result.error || "Failed to create test");
			}
		} catch (error) {
			console.error("Error creating test:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to create test",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
			<DrawerContent className="h-[85vh]">
				<DrawerHeader className="px-8 py-6">
					<DrawerTitle className="text-2xl">Create New Test</DrawerTitle>
					<DrawerDescription className="text-base">
						Create a new academic test by selecting a question paper and
						evaluator configuration
					</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 overflow-y-auto px-8 py-6">
					<div className="mx-auto max-w-2xl space-y-6">
						<div>
							<Label htmlFor="testName" className="font-semibold text-lg">
								Test Name
							</Label>
							<Input
								id="testName"
								type="text"
								placeholder="e.g., Mathematics Final Exam 2024"
								value={testName}
								onChange={(e) => setTestName(e.target.value)}
								className="mt-2"
								disabled={loading}
							/>
						</div>

						<div>
							<Label htmlFor="questionPaper" className="font-semibold text-lg">
								Question Paper
							</Label>
							<Select
								value={questionPaperId}
								onValueChange={setQuestionPaperId}
								disabled={loading || fetching}
							>
								<SelectTrigger className="mt-2 w-full">
									<SelectValue placeholder="Select a question paper" />
								</SelectTrigger>
								<SelectContent>
									{questionPapers.map((qp) => (
										<SelectItem key={qp.id} value={qp.id}>
											{qp.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label
								htmlFor="evaluatorConfig"
								className="font-semibold text-lg"
							>
								Evaluator Configuration
							</Label>
							<Select
								value={evaluatorConfigId}
								onValueChange={setEvaluatorConfigId}
								disabled={loading || fetching}
							>
								<SelectTrigger className="mt-2 w-full">
									<SelectValue placeholder="Select an evaluator configuration" />
								</SelectTrigger>
								<SelectContent>
									{evaluatorConfigs.map((ec) => (
										<SelectItem key={ec.id} value={ec.id}>
											{ec.config_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<DrawerFooter className="px-8 py-6">
					<div className="flex gap-4">
						<DrawerClose asChild>
							<Button
								variant="outline"
								size="lg"
								className="flex-1 text-base"
								disabled={loading}
							>
								Cancel
							</Button>
						</DrawerClose>
						<Button
							onClick={handleSubmit}
							size="lg"
							className="flex-1 text-base"
							disabled={
								!testName.trim() ||
								!questionPaperId ||
								!evaluatorConfigId ||
								loading ||
								fetching
							}
						>
							{loading ? "Creating Test..." : "Create Test"}
						</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
