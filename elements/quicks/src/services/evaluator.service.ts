// Evaluator Configuration Service
// Handles all API calls related to evaluator configurations

import type { EvaluatorConfigurationV2 } from "../types/evaluator-config-v2";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/**
 * Fetch all evaluator configurations
 */
export async function getAllConfigurations(): Promise<
	EvaluatorConfigurationV2[]
> {
	try {
		const response = await fetch(`${API_BASE_URL}/evaluator-configurations`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch configurations: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching evaluator configurations:", error);
		throw error;
	}
}

/**
 * Fetch a single evaluator configuration by ID
 */
export async function getConfigurationById(
	id: string,
): Promise<EvaluatorConfigurationV2> {
	try {
		const response = await fetch(
			`${API_BASE_URL}/evaluator-configurations/${id}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch configuration: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error(`Error fetching configuration ${id}:`, error);
		throw error;
	}
}

/**
 * Fetch configurations by subject
 */
export async function getConfigurationsBySubject(
	subject: string,
): Promise<EvaluatorConfigurationV2[]> {
	try {
		const response = await fetch(
			`${API_BASE_URL}/evaluator-configurations?subject=${encodeURIComponent(
				subject,
			)}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch configurations for subject: ${response.statusText}`,
			);
		}

		return await response.json();
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
 */
export async function createConfiguration(
	config: Omit<EvaluatorConfigurationV2, "id" | "created_at" | "updated_at">,
): Promise<EvaluatorConfigurationV2> {
	try {
		const response = await fetch(`${API_BASE_URL}/evaluator-configurations`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(config),
		});

		if (!response.ok) {
			throw new Error(`Failed to create configuration: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error creating evaluator configuration:", error);
		throw error;
	}
}

/**
 * Update an existing evaluator configuration
 */
export async function updateConfiguration(
	id: string,
	config: Partial<Omit<EvaluatorConfigurationV2, "id" | "created_at">>,
): Promise<EvaluatorConfigurationV2> {
	try {
		const response = await fetch(
			`${API_BASE_URL}/evaluator-configurations/${id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...config,
					updated_at: new Date().toISOString(),
				}),
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to update configuration: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error(`Error updating configuration ${id}:`, error);
		throw error;
	}
}

/**
 * Delete an evaluator configuration
 */
export async function deleteConfiguration(id: string): Promise<void> {
	try {
		const response = await fetch(
			`${API_BASE_URL}/evaluator-configurations/${id}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to delete configuration: ${response.statusText}`);
		}
	} catch (error) {
		console.error(`Error deleting configuration ${id}:`, error);
		throw error;
	}
}

/**
 * Duplicate an existing configuration
 */
export async function duplicateConfiguration(
	id: string,
	newName?: string,
): Promise<EvaluatorConfigurationV2> {
	try {
		const original = await getConfigurationById(id);

		const duplicated = {
			...original,
			config_name: newName || `${original.config_name} (Copy)`,
		};

		// Remove auto-generated fields before creating new config
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
 * Save configuration as preset (for reuse)
 */
export async function saveAsPreset(
	config: EvaluatorConfigurationV2,
	presetName: string,
): Promise<EvaluatorConfigurationV2> {
	try {
		const preset = {
			...config,
			config_name: presetName,
		};

		// Remove auto-generated fields before creating preset
		const { id: _id, created_at: _ca, updated_at: _ua, ...presetData } = preset;

		return await createConfiguration(presetData);
	} catch (error) {
		console.error("Error saving preset:", error);
		throw error;
	}
}
