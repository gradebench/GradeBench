// Evaluator Configuration Service V3
// Handles all API calls related to evaluator configurations

import { createApiClient } from "@gb/fetch";
import type { EvaluatorConfigurationV3 } from "../types/evaluator-config-v3";

// Get API base URL - works in both browser and server
const getBaseURL = () => {
	// In browser, check window.location for production
	if (typeof window !== "undefined") {
		return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8083";
	}
	// On server
	return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8083";
};

// Create API client for Grade service
const gradeAPI = createApiClient({
	baseURL: getBaseURL(),
	defaultHeaders: {
		"Content-Type": "application/json",
	},
	defaultTimeout: 15000, // 15 seconds for evaluator operations
});

/**
 * Fetch all evaluator configurations
 * @returns Promise with array of configurations or throws error
 */
export async function getAllConfigurations(): Promise<
	EvaluatorConfigurationV3[]
> {
	try {
		const response = await gradeAPI.get<EvaluatorConfigurationV3[]>(
			"/grade/v1/evaluator-configurations",
		);

		console.log("getAllConfigurations response:", response);
		console.log("Response type:", typeof response);
		console.log("Is array:", Array.isArray(response));
		console.log("Has data:", response?.data);

		// Handle StandardResponse format: { success: true, data: [...] }
		if (response?.success && Array.isArray(response.data)) {
			return response.data;
		}

		// If backend returns array directly (not wrapped in StandardResponse)
		if (Array.isArray(response)) {
			return response as unknown as EvaluatorConfigurationV3[];
		}

		// If response has data property but success is missing/false
		if (response?.data && Array.isArray(response.data)) {
			return response.data;
		}

		// If we got here, the response format is unexpected
		console.error("Unexpected response format:", response);
		throw new Error(
			response?.error?.message ||
				"Failed to fetch configurations: unexpected response format",
		);
	} catch (error) {
		console.error("Error fetching evaluator configurations:", error);
		throw error;
	}
}

/**
 * Fetch a single evaluator configuration by ID
 * @param id - Configuration ID
 * @returns Promise with configuration or throws error
 */
export async function getConfigurationById(
	id: string,
): Promise<EvaluatorConfigurationV3> {
	try {
		const response = await gradeAPI.get<EvaluatorConfigurationV3>(
			`/grade/v1/evaluator-configurations/${id}`,
		);

		if (!response.success || !response.data) {
			throw new Error(
				response.error?.message || "Failed to fetch configuration",
			);
		}

		return response.data;
	} catch (error) {
		console.error(`Error fetching configuration ${id}:`, error);
		throw error;
	}
}

/**
 * Fetch configurations filtered by subject
 * @param subject - Subject to filter by
 * @returns Promise with array of configurations or throws error
 */
export async function getConfigurationsBySubject(
	subject: string,
): Promise<EvaluatorConfigurationV3[]> {
	try {
		const response = await gradeAPI.get<EvaluatorConfigurationV3[]>(
			"/grade/v1/evaluator-configurations",
			{
				params: { subject },
			},
		);

		if (!response.success || !response.data) {
			throw new Error(
				response.error?.message || "Failed to fetch configurations for subject",
			);
		}

		return response.data;
	} catch (error) {
		console.error(
			`Error fetching configurations for subject ${subject}:`,
			error,
		);
		throw error;
	}
}

/**
 * Create a new evaluator configuration
 * @param config - Configuration data without auto-generated fields
 * @returns Promise with created configuration or throws error
 */
export async function createConfiguration(
	config: Omit<EvaluatorConfigurationV3, "id" | "created_at" | "updated_at">,
): Promise<EvaluatorConfigurationV3> {
	try {
		const response = await gradeAPI.post<EvaluatorConfigurationV3>(
			"/grade/v1/evaluator-configurations",
			config,
		);

		if (!response.success || !response.data) {
			throw new Error(
				response.error?.message || "Failed to create configuration",
			);
		}

		return response.data;
	} catch (error) {
		console.error("Error creating evaluator configuration:", error);
		throw error;
	}
}

/**
 * Update an existing evaluator configuration
 * @param id - Configuration ID
 * @param config - Partial configuration data to update
 * @returns Promise with updated configuration or throws error
 */
export async function updateConfiguration(
	id: string,
	config: Partial<Omit<EvaluatorConfigurationV3, "id" | "created_at">>,
): Promise<EvaluatorConfigurationV3> {
	try {
		const response = await gradeAPI.patch<EvaluatorConfigurationV3>(
			`/grade/v1/evaluator-configurations/${id}`,
			{
				...config,
				updated_at: new Date().toISOString(),
			},
		);

		if (!response.success || !response.data) {
			throw new Error(
				response.error?.message || "Failed to update configuration",
			);
		}

		return response.data;
	} catch (error) {
		console.error(`Error updating configuration ${id}:`, error);
		throw error;
	}
}

/**
 * Delete an evaluator configuration
 * @param id - Configuration ID
 * @returns Promise that resolves when deletion is complete or throws error
 */
export async function deleteConfiguration(id: string): Promise<void> {
	try {
		const response = await gradeAPI.delete<void>(
			`/grade/v1/evaluator-configurations/${id}`,
		);

		if (!response.success) {
			throw new Error(
				response.error?.message || "Failed to delete configuration",
			);
		}
	} catch (error) {
		console.error(`Error deleting configuration ${id}:`, error);
		throw error;
	}
}

/**
 * Duplicate an existing configuration with a new name
 * @param id - Configuration ID to duplicate
 * @param newName - Optional new name for the duplicated configuration
 * @returns Promise with duplicated configuration or throws error
 */
export async function duplicateConfiguration(
	id: string,
	newName?: string,
): Promise<EvaluatorConfigurationV3> {
	try {
		const original = await getConfigurationById(id);
		const duplicated = {
			...original,
			config_name: newName || `${original.config_name} (Copy)`,
		};
		const {
			id: _id,
			created_at: _ca,
			updated_at: _ua,
			...configToDuplicate
		} = duplicated;
		return await createConfiguration(configToDuplicate);
	} catch (error) {
		console.error(`Error duplicating configuration ${id}:`, error);
		throw error;
	}
}

/**
 * Save configuration as a preset for reuse
 * @param config - Configuration to save as preset
 * @param presetName - Name for the preset
 * @returns Promise with saved preset configuration or throws error
 */
export async function saveAsPreset(
	config: EvaluatorConfigurationV3,
	presetName: string,
): Promise<EvaluatorConfigurationV3> {
	try {
		const preset = { ...config, config_name: presetName, is_default: false };
		const { id: _id, created_at: _ca, updated_at: _ua, ...presetData } = preset;
		return await createConfiguration(presetData);
	} catch (error) {
		console.error("Error saving preset:", error);
		throw error;
	}
}

/**
 * Validate configuration before submission
 * @param config - Configuration to validate
 * @returns Object with isValid boolean and array of error messages
 */
export function validateConfiguration(config: EvaluatorConfigurationV3): {
	isValid: boolean;
	errors: string[];
} {
	const errors: string[] = [];
	if (
		config.scoring_methodology.decimal_precision < 0 ||
		config.scoring_methodology.decimal_precision > 3
	) {
		errors.push("Decimal precision must be between 0 and 3");
	}
	const percentageFields = [
		config.leniency_strictness.leniency_spelling_grammar_penalty_percent,
		config.leniency_strictness.leniency_unit_mismatch_penalty,
		config.leniency_strictness.leniency_formatting_penalty,
		config.leniency_strictness.strictness_conceptual_error_penalty,
		config.leniency_strictness.working_required_penalty_percent,
		config.partial_marking_rules.partial_mark_for_correct_method_wrong_answer,
		config.partial_marking_rules.partial_mark_for_partial_steps,
		config.partial_marking_rules.keyword_hit_percentage_for_full_marks,
	];
	for (const [index, value] of percentageFields.entries()) {
		if (value < 0 || value > 100) {
			errors.push(`Percentage field ${index + 1} must be between 0 and 100`);
		}
	}
	const thresholdFields = [
		config.leniency_strictness.leniency_keyword_matching_threshold,
		config.partial_marking_rules.partial_mark_keyword_hit_threshold,
		config.partial_marking_rules.concept_coverage_weight,
		config.consistency_fairness.consistency_similarity_threshold,
		config.learning_adaptation.adaptation_confidence_threshold,
		config.quality_metrics.consistency_threshold,
	];
	for (const [index, value] of thresholdFields.entries()) {
		if (value < 0 || value > 1) {
			errors.push(`Threshold field ${index + 1} must be between 0.0 and 1.0`);
		}
	}
	if (
		config.scoring_methodology.grace_marks_threshold < 0 ||
		config.scoring_methodology.grace_marks_threshold > 5
	) {
		errors.push("Grace marks threshold must be between 0.0 and 5.0");
	}
	const weightFields = [
		config.subject_specific_rules.subject_math_formula_weight,
		config.subject_specific_rules.subject_math_calculation_weight,
		config.subject_specific_rules.subject_literature_thematic_analysis_weight,
		config.subject_specific_rules
			.subject_literature_interpretation_creativity_weight,
		config.subject_specific_rules.subject_science_diagram_label_weight,
		config.subject_specific_rules.subject_science_experimental_design_weight,
		config.subject_specific_rules.subject_history_chronology_accuracy_weight,
		config.subject_specific_rules.subject_code_syntax_weight,
		config.subject_specific_rules.subject_code_logic_weight,
		config.subject_specific_rules.subject_code_efficiency_weight,
		config.subject_specific_rules.subject_code_style_weight,
		config.question_type_rules.question_type_essay_structure_weight,
		config.question_type_rules.question_type_essay_argument_coherence_weight,
		config.question_type_rules.question_type_essay_evidence_quality_weight,
		config.question_type_rules.question_type_code_test_case_weight,
		config.question_type_rules.question_type_diagram_accuracy_weight,
		config.question_type_rules.question_type_diagram_labeling_weight,
	];
	for (const [index, value] of weightFields.entries()) {
		if (value < 0 || value > 1) {
			errors.push(`Weight field ${index + 1} must be between 0.0 and 1.0`);
		}
	}
	if (
		config.question_type_rules.question_type_numerical_precision_digits < 1 ||
		config.question_type_rules.question_type_numerical_precision_digits > 10
	) {
		errors.push("Numerical precision digits must be between 1 and 10");
	}
	if (
		config.learning_adaptation.adaptation_sample_size_for_autonomy < 5 ||
		config.learning_adaptation.adaptation_sample_size_for_autonomy > 50
	) {
		errors.push("Adaptation sample size must be between 5 and 50");
	}
	const hexColorRegex = /^#[0-9A-F]{6}$/i;
	const colorFields = [
		config.annotation_preferences.annotation_highlight_correct_color,
		config.annotation_preferences.annotation_highlight_incorrect_color,
		config.annotation_preferences.annotation_highlight_partial_color,
	];
	for (const [index, color] of colorFields.entries()) {
		if (!hexColorRegex.test(color)) {
			errors.push(
				`Color field ${index + 1} must be a valid hex color (e.g., #FF0000)`,
			);
		}
	}
	return { isValid: errors.length === 0, errors };
}
