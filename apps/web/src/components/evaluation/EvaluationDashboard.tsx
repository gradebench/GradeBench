"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@gb/ui/src/components/ui/alert-dialog";
import { Badge } from "@gb/ui/src/components/ui/badge";
import { Button } from "@gb/ui/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@gb/ui/src/components/ui/card";
import { Progress } from "@gb/ui/src/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gb/ui/src/components/ui/table";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck,
  FileText,
  Loader2,
  RefreshCw,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { AcademicTest } from "@/lib/academic-tests-api";
import { getAcademicTest } from "@/lib/academic-tests-api";
import type { AnswerPaper } from "@/lib/answer-papers-api";
import {
  annotateAnswerPaper,
  deleteAnswerPaper,
  evaluateAnswerPaper,
  getAnswerPapersByAcademicTest,
} from "@/lib/answer-papers-api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    service: string;
    version: string;
  };
}

interface EvaluationDashboardProps {
  testId: string;
  testName: string;
  initialAnswerPapers: AnswerPaper[];
  onUploadMore: () => void;
}

export function EvaluationDashboard({
  testId,
  testName,
  initialAnswerPapers,
  onUploadMore,
}: EvaluationDashboardProps) {
  const router = useRouter();
  const [answerPapers, setAnswerPapers] =
    useState<AnswerPaper[]>(initialAnswerPapers);
  const [academicTest, setAcademicTest] = useState<AcademicTest | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAutomating, setIsAutomating] = useState(false);
  const [evaluatingPapers, setEvaluatingPapers] = useState<Set<string>>(
    new Set()
  );
  const [hasAutoEvaluatedFirst, setHasAutoEvaluatedFirst] = useState(false);

  const isAnyProcessing = answerPapers.some(
    (p) => p.digitized_document_url === null
  );
  const isAllDigitized =
    answerPapers.length > 0 &&
    answerPapers.every((p) => p.digitized_document_url !== null);
  const hasAnyEvaluated = answerPapers.some(
    (p) => p.processed_document_url !== null
  );

  const firstDigitizedPaper = answerPapers.find(
    (p) => p.digitized_document_url !== null
  );
  const isFirstPaperEvaluated =
    firstDigitizedPaper?.processed_document_url !== null;

  const processingStatus = isAnyProcessing ? "Processing" : "Digitized";
  const processedCount = answerPapers.filter(
    (p) => p.digitized_document_url !== null
  ).length;
  const totalCount = answerPapers.length;
  const processingPercentage =
    totalCount > 0 ? (processedCount / totalCount) * 100 : 0;

  const fetchPapers = useCallback(async () => {
    try {
      const updated = await getAnswerPapersByAcademicTest(testId);
      setAnswerPapers(updated);
      return updated;
    } catch (error) {
      console.error("Error fetching answer papers:", error);
      toast.error("Failed to refresh answer papers.");
      return [];
    }
  }, [testId]);

  useEffect(() => {
    setAnswerPapers(initialAnswerPapers);
  }, [initialAnswerPapers]);

  useEffect(() => {
    if (!isAnyProcessing) return;
    const pollInterval = setInterval(fetchPapers, 10000);
    return () => clearInterval(pollInterval);
  }, [isAnyProcessing, fetchPapers]);

  useEffect(() => {
    let isMounted = true;
    const fetchTest = async () => {
      try {
        const test = await getAcademicTest(testId);
        if (!isMounted) return;
        console.log("Academic test loaded:", test);
        setAcademicTest(test);
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load academic test:", error);
      }
    };
    fetchTest();
    return () => {
      isMounted = false;
    };
  }, [testId]);

  useEffect(() => {
    if (!isAllDigitized || hasAutoEvaluatedFirst) return;
    if (!academicTest) return;

    const hasDynamicRubric =
      Boolean(academicTest.dynamic_rubric) ||
      Boolean(academicTest.dynamic_rubrics_url);
    if (!hasDynamicRubric) return;

    const digitizedPapers = answerPapers.filter(
      (p) => p.digitized_document_url !== null
    );
    if (digitizedPapers.length === 0) return;

    setHasAutoEvaluatedFirst(true);

    const processBatch = async () => {
      console.log(
        "🚀 Starting batch processing for",
        digitizedPapers.length,
        "papers"
      );
      toast.info(`Processing ${digitizedPapers.length} paper(s)...`, {
        duration: 3000,
      });
      let successCount = 0;
      let failureCount = 0;

      for (const paper of digitizedPapers) {
        setEvaluatingPapers((prev) => new Set(prev).add(paper.id));
        try {
          if (paper.processed_document_url === null) {
            console.log(`📄 POST /evaluate for ${paper.student_name}`);
            await evaluateAnswerPaper(paper.id, paper.student_id);
          }
          if (paper.annotated_document_url === null) {
            console.log(`🖊️ POST /annotate for ${paper.student_name}`);
            await annotateAnswerPaper(paper.id);
          }
          successCount++;
          toast.success(`✓ ${paper.student_name}`);
        } catch (error) {
          failureCount++;
          console.error(`❌ Error processing ${paper.student_name}:`, error);
          toast.error(`✗ ${paper.student_name}`);
        } finally {
          setEvaluatingPapers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(paper.id);
            return newSet;
          });
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (successCount > 0 && failureCount === 0) {
        toast.success(`🎉 All ${successCount} paper(s) processed!`, {
          duration: 5000,
        });
      } else if (successCount > 0) {
        toast.warning(`${successCount} successful, ${failureCount} failed`, {
          duration: 5000,
        });
      }

      setTimeout(fetchPapers, 2000);
    };

    processBatch();
  }, [
    isAllDigitized,
    hasAutoEvaluatedFirst,
    academicTest,
    answerPapers,
    fetchPapers,
  ]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPapers();
    setIsRefreshing(false);
    toast.success("Answer papers have been updated.");
  };

  const handleDeleteClick = useCallback((paperId: string) => {
    setDeleteConfirm(paperId);
  }, []);

  const handleConfirmDelete = useCallback(async (paperId: string) => {
    setIsDeleting(true);
    try {
      await deleteAnswerPaper(paperId);
      setAnswerPapers((prev) => prev.filter((p) => p.id !== paperId));
      toast.success("Answer paper deleted successfully");
    } catch (error) {
      console.error("Error deleting answer paper:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete paper"
      );
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  }, []);

  const handleVerifyClick = () => {
    router.push(`/quicks/tests/${testId}/verify`);
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header Section */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="font-bold text-3xl tracking-tight">{testName}</h1>
              <div className="flex items-center gap-3">
                <Badge
                  variant={isAnyProcessing ? "secondary" : "default"}
                  className="gap-1.5"
                >
                  {isAnyProcessing ? (
                    <Clock className="h-3.5 w-3.5 animate-pulse" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  {processingStatus}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {processedCount} of {totalCount} papers digitized
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onUploadMore}
                disabled={isAutomating}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload More
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {totalCount > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">
                  Digitization Progress
                </span>
                <span className="font-semibold">
                  {Math.round(processingPercentage)}%
                </span>
              </div>
              <Progress value={processingPercentage} className="h-2" />
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Answer Papers List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-xl">Answer Papers</h2>
              <p className="text-muted-foreground text-sm">
                Click on a digitized paper to view and verify details
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {answerPapers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-6">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">
                No Answer Papers Yet
              </h3>
              <p className="mb-6 max-w-sm text-muted-foreground text-sm">
                Upload answer papers to begin the digitization and evaluation
                process.
              </p>
              <Button onClick={onUploadMore} size="lg">
                <Upload className="mr-2 h-4 w-4" />
                Upload Papers
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Digitized</TableHead>
                    <TableHead className="text-center">Evaluated</TableHead>
                    <TableHead className="text-center">Annotated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {answerPapers.map((paper, index) => {
                    const isEvaluating = evaluatingPapers.has(paper.id);
                    const isDigitized = paper.digitized_document_url !== null;
                    const isEvaluated = paper.processed_document_url !== null;
                    const isAnnotated = paper.annotated_document_url !== null;

                    return (
                      <TableRow
                        key={paper.id}
                        className={`${
                          isDigitized
                            ? "cursor-pointer hover:bg-muted/50"
                            : "opacity-60"
                        } ${isEvaluating ? "bg-blue-50" : ""}`}
                        onClick={() => {
                          if (isDigitized && !isEvaluating) {
                            router.push(`/quicks/tests/${testId}/verify`);
                          }
                        }}
                      >
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                isDigitized
                                  ? "bg-green-100 text-green-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {paper.student_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">
                                {paper.student_name}
                              </div>
                              <div className="text-muted-foreground text-xs">
                                ID: {paper.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {isEvaluating ? (
                            <Badge
                              variant="secondary"
                              className="gap-1.5 bg-blue-100 text-blue-700"
                            >
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Evaluating
                            </Badge>
                          ) : isEvaluated ? (
                            <Badge
                              variant="default"
                              className="gap-1.5 bg-green-100 text-green-700"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              Evaluated
                            </Badge>
                          ) : isDigitized ? (
                            <Badge variant="secondary" className="gap-1.5">
                              <FileCheck className="h-3 w-3" />
                              Ready
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="gap-1.5 bg-orange-100 text-orange-700"
                            >
                              <Clock className="h-3 w-3" />
                              Processing
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {isDigitized ? (
                            <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                              <span className="text-muted-foreground text-xs">
                                Digitizing...
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {isEvaluated ? (
                            <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {isAnnotated ? (
                            <CheckCircle2 className="mx-auto h-5 w-5 text-green-600" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isDigitized && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/quicks/tests/${testId}/verify`);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(paper.id);
                              }}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {totalCount > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                variant="default"
                size="lg"
                onClick={handleVerifyClick}
                disabled={!hasAnyEvaluated}
                className="flex-1"
              >
                <Eye className="mr-2 h-5 w-5" />
                View Papers
              </Button>
              {hasAnyEvaluated && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push(`/quicks/tests/${testId}/report`)}
                  className="flex-1"
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Report
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Banners */}
      {!isAllDigitized && totalCount > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-start gap-3 py-4">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">
                Papers are being digitized
              </p>
              <p className="text-blue-700">
                The page will automatically refresh. You can start evaluation
                once all papers are digitized.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Answer Paper</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this answer paper? This action
              cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteConfirm && handleConfirmDelete(deleteConfirm)
              }
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
