# Evaluator Configuration V3 - Complete Documentation

## Overview

The Evaluator Configuration V3 system provides a comprehensive, granular configuration interface for controlling how automated evaluation is performed. With 150+ configuration parameters organized into 11 categories, it offers fine-grained control over every aspect of the evaluation process.

## API Endpoints

All evaluator configuration endpoints are under the `/grade/v1` namespace:

| Action                       | Method | Endpoint                                 |
| ---------------------------- | ------ | ---------------------------------------- |
| **List all configurations**  | GET    | `/grade/v1/evaluator-configurations`     |
| **Get configuration by ID**  | GET    | `/grade/v1/evaluator-configurations/:id` |
| **Create new configuration** | POST   | `/grade/v1/evaluator-configurations`     |
| **Update configuration**     | PATCH  | `/grade/v1/evaluator-configurations/:id` |
| **Delete configuration**     | DELETE | `/grade/v1/evaluator-configurations/:id` |

### Query Parameters

- `subject` - Filter configurations by subject (e.g., `?subject=Mathematics`)

## Configuration Categories

### 1. Identity (`identity`)

Defines the basic identity and purpose of the configuration.

| Parameter            | Type     | Description                                                        |
| -------------------- | -------- | ------------------------------------------------------------------ |
| `subject`            | string   | Subject name (e.g., "Mathematics", "Literature", "Physics")        |
| `exam_type`          | ExamType | Type of examination ("High School Final", "College Midterm", etc.) |
| `grading_philosophy` | string   | Free-text description of grading philosophy                        |

### 2. Scoring Methodology (`scoring_methodology`)

Controls how marks are calculated and awarded.

| Parameter                        | Type    | Range/Options                                            | Description                    |
| -------------------------------- | ------- | -------------------------------------------------------- | ------------------------------ |
| `scoring_scheme_default`         | enum    | "integer", "decimal"                                     | Default marking scheme         |
| `decimal_precision`              | number  | 0-3                                                      | Number of decimal places       |
| `allow_negative_marking`         | boolean | -                                                        | Enable negative marking        |
| `negative_marking_policy`        | enum    | "none", "per_question", "per_option", "custom"           | How negative marks are applied |
| `negative_mark_value_mcq`        | number  | -                                                        | Negative marks per MCQ         |
| `negative_mark_value_subjective` | number  | -                                                        | Negative marks for subjective  |
| `rounding_policy`                | enum    | "round_up", "round_down", "round_nearest", "no_rounding" | Rounding method                |
| `total_marks_cap`                | boolean | -                                                        | Cap total at maximum           |
| `grace_marks_enabled`            | boolean | -                                                        | Allow grace marks              |
| `grace_marks_threshold`          | number  | 0.0-5.0                                                  | Maximum grace marks            |

### 3. Leniency & Strictness (`leniency_strictness`)

Controls evaluation strictness and tolerance levels.

| Parameter                                   | Type    | Range/Options                                                  | Description                         |
| ------------------------------------------- | ------- | -------------------------------------------------------------- | ----------------------------------- |
| `leniency_level`                            | enum    | "very_strict", "strict", "moderate", "lenient", "very_lenient" | Overall leniency                    |
| `leniency_keyword_matching_threshold`       | number  | 0.0-1.0                                                        | Fuzzy match threshold (0.7 = 70%)   |
| `leniency_spelling_grammar_penalty_percent` | number  | 0-100                                                          | Penalty % for spelling/grammar      |
| `leniency_numerical_precision_margin`       | number  | -                                                              | Acceptable margin (e.g., ±5%)       |
| `leniency_unit_mismatch_penalty`            | number  | 0-100                                                          | Penalty for incorrect units         |
| `leniency_formatting_penalty`               | number  | 0-100                                                          | Penalty for formatting issues       |
| `allow_partial_marks_for_wrong_method`      | boolean | -                                                              | Award marks for correct methodology |
| `allow_alternative_approaches`              | boolean | -                                                              | Accept alternative solutions        |
| `strictness_conceptual_error_penalty`       | number  | 0-100                                                          | Penalty for conceptual errors       |
| `strictness_require_working_shown`          | boolean | -                                                              | Require working to be shown         |
| `working_required_penalty_percent`          | number  | 0-100                                                          | Penalty when working not shown      |

### 4. Partial Marking Rules (`partial_marking_rules`)

Defines how partial marks are awarded.

| Parameter                                      | Type    | Range/Options | Description                        |
| ---------------------------------------------- | ------- | ------------- | ---------------------------------- |
| `partial_marking_enabled`                      | boolean | -             | Global toggle                      |
| `partial_mark_for_correct_method_wrong_answer` | number  | 0-100         | % for correct method, wrong answer |
| `partial_mark_for_partial_steps`               | number  | 0-100         | % per completed step               |
| `partial_mark_keyword_hit_threshold`           | number  | 0-1.0         | Min keyword coverage (0.6 = 60%)   |
| `partial_mark_minimum_award`                   | number  | -             | Minimum marks to award             |
| `deduction_per_spelling_error`                 | number  | -             | Marks per spelling error           |
| `max_spelling_error_deduction`                 | number  | -             | Max spelling deduction             |
| `deduction_per_grammar_error`                  | number  | -             | Marks per grammar error            |
| `max_grammar_error_deduction`                  | number  | -             | Max grammar deduction              |
| `deduction_for_incorrect_units`                | number  | -             | Deduction for wrong units          |
| `deduction_for_missing_units`                  | number  | -             | Deduction for missing units        |
| `keyword_hit_percentage_for_full_marks`        | number  | 0-100         | Min % keywords for full marks      |
| `concept_coverage_weight`                      | number  | 0-1.0         | Weight for concept coverage        |
| `step_by_step_evaluation_enabled`              | boolean | -             | Evaluate step-by-step              |

### 5. Feedback Preferences (`feedback_preferences`)

Controls feedback generation and style.

| Parameter                            | Type    | Range/Options                                                        | Description                |
| ------------------------------------ | ------- | -------------------------------------------------------------------- | -------------------------- |
| `feedback_tone`                      | enum    | "encouraging", "neutral", "strict", "professional", "conversational" | Tone of feedback           |
| `feedback_granularity`               | enum    | "per_point", "per_sub_question", "per_question", "summary_only"      | Detail level               |
| `feedback_verbosity`                 | enum    | "concise", "moderate", "detailed", "comprehensive"                   | Length of feedback         |
| `feedback_suggestion_style`          | enum    | "direct_instruction", "guiding_question", "hints", "none"            | Suggestion style           |
| `feedback_include_positive_points`   | boolean | -                                                                    | Mention correct aspects    |
| `feedback_include_improvement_tips`  | boolean | -                                                                    | Provide improvement tips   |
| `feedback_highlight_common_mistakes` | boolean | -                                                                    | Call out common errors     |
| `feedback_compare_to_model_answer`   | boolean | -                                                                    | Reference model answer     |
| `feedback_include_mark_breakdown`    | boolean | -                                                                    | Show mark allocation       |
| `feedback_language`                  | string  | -                                                                    | Language (e.g., "English") |
| `feedback_reading_level`             | enum    | "elementary", "middle_school", "high_school", "college", "graduate"  | Complexity                 |
| `feedback_personalization_enabled`   | boolean | -                                                                    | Personalize feedback       |

### 6. Annotation Preferences (`annotation_preferences`)

Controls PDF annotation generation.

| Parameter                              | Type    | Range/Options                                      | Description                         |
| -------------------------------------- | ------- | -------------------------------------------------- | ----------------------------------- |
| `annotation_enabled`                   | boolean | -                                                  | Enable annotations                  |
| `annotation_style`                     | enum    | "minimal", "moderate", "detailed", "comprehensive" | Annotation density                  |
| `annotation_use_checkmarks`            | boolean | -                                                  | Use checkmarks                      |
| `annotation_use_crosses`               | boolean | -                                                  | Use crosses/X marks                 |
| `annotation_use_highlights`            | boolean | -                                                  | Use highlights                      |
| `annotation_highlight_correct_color`   | string  | hex                                                | Color for correct (e.g., #00FF00)   |
| `annotation_highlight_incorrect_color` | string  | hex                                                | Color for incorrect (e.g., #FF0000) |
| `annotation_highlight_partial_color`   | string  | hex                                                | Color for partial (e.g., #FFA500)   |
| `annotation_use_underlines`            | boolean | -                                                  | Use underlines                      |
| `annotation_use_strikethroughs`        | boolean | -                                                  | Use strikethroughs                  |
| `annotation_use_margin_notes`          | boolean | -                                                  | Add margin notes                    |
| `annotation_use_inline_comments`       | boolean | -                                                  | Add inline comments                 |
| `annotation_show_scores_inline`        | boolean | -                                                  | Display marks inline                |
| `annotation_symbol_set`                | enum    | "standard", "emoji", "custom"                      | Symbol set                          |

### 7. Consistency & Fairness (`consistency_fairness`)

Controls consistency checking and bias detection.

| Parameter                          | Type    | Range/Options | Description            |
| ---------------------------------- | ------- | ------------- | ---------------------- |
| `consistency_check_enabled`        | boolean | -             | Check consistency      |
| `consistency_similarity_threshold` | number  | 0.0-1.0       | Similarity threshold   |
| `bias_detection_enabled`           | boolean | -             | Monitor for biases     |
| `anonymize_evaluation`             | boolean | -             | Hide student identity  |
| `cross_question_consistency_check` | boolean | -             | Check across questions |

### 8. Learning & Adaptation (`learning_adaptation`)

Controls AI learning and adaptation.

| Parameter                                | Type    | Range/Options                            | Description                   |
| ---------------------------------------- | ------- | ---------------------------------------- | ----------------------------- |
| `adaptation_learning_rate`               | enum    | "slow", "moderate", "fast", "aggressive" | Learning rate                 |
| `adaptation_confidence_threshold`        | number  | 0.0-1.0                                  | Min confidence for auto-apply |
| `adaptation_sample_size_for_autonomy`    | number  | 5-50                                     | Samples before autonomous     |
| `adaptation_enable_auto_recommendations` | boolean | -                                        | Auto-suggest updates          |
| `adaptation_user_approval_required`      | boolean | -                                        | Require user approval         |

### 9. Subject-Specific Rules (`subject_specific_rules`)

Subject-specific configuration overrides.

#### Mathematics

- `subject_math_require_working` (boolean)
- `subject_math_formula_weight` (0-1.0)
- `subject_math_calculation_weight` (0-1.0)

#### Literature

- `subject_literature_thematic_analysis_weight` (0-1.0)
- `subject_literature_textual_evidence_required` (boolean)
- `subject_literature_interpretation_creativity_weight` (0-1.0)

#### Science

- `subject_science_diagram_label_weight` (0-1.0)
- `subject_science_experimental_design_weight` (0-1.0)

#### History

- `subject_history_chronology_accuracy_weight` (0-1.0)
- `subject_history_source_citation_required` (boolean)

#### Computer Science

- `subject_code_syntax_weight` (0-1.0)
- `subject_code_logic_weight` (0-1.0)
- `subject_code_efficiency_weight` (0-1.0)
- `subject_code_style_weight` (0-1.0)
- `subject_code_execution_required` (boolean)

### 10. Question Type Rules (`question_type_rules`)

Rules for different question types.

#### MCQ

- `question_type_mcq_strict_matching` (boolean)
- `question_type_mcq_guess_penalty` (number)

#### Numerical

- `question_type_numerical_precision_digits` (1-10)
- `question_type_numerical_scientific_notation_required` (boolean)

#### Essay

- `question_type_essay_min_word_count_enforced` (boolean)
- `question_type_essay_structure_weight` (0-1.0)
- `question_type_essay_argument_coherence_weight` (0-1.0)
- `question_type_essay_evidence_quality_weight` (0-1.0)

#### Code

- `question_type_code_test_case_weight` (0-1.0)

#### Diagram

- `question_type_diagram_accuracy_weight` (0-1.0)
- `question_type_diagram_labeling_weight` (0-1.0)

### 11. Audit & Compliance (`audit_compliance`)

Audit trail and compliance settings.

| Parameter                       | Type    | Range/Options | Description             |
| ------------------------------- | ------- | ------------- | ----------------------- |
| `audit_trail_enabled`           | boolean | -             | Maintain audit trail    |
| `audit_log_modifications`       | boolean | -             | Log user modifications  |
| `audit_log_learning_changes`    | boolean | -             | Log AI learning changes |
| `audit_retention_days`          | number  | -             | Retention period        |
| `evaluation_timestamp_required` | boolean | -             | Require timestamps      |
| `evaluator_signature_required`  | boolean | -             | Require signatures      |
| `version_control_enabled`       | boolean | -             | Version control configs |

### 12. Quality Metrics (`quality_metrics`)

Quality assurance metrics.

| Parameter                        | Type    | Range/Options | Description                   |
| -------------------------------- | ------- | ------------- | ----------------------------- |
| `accuracy_target_margin_percent` | number  | -             | Target accuracy margin (±%)   |
| `consistency_threshold`          | number  | 0.0-1.0       | Min consistency score         |
| `speed_multiplier_target`        | number  | -             | Target speed improvement      |
| `explainability_required`        | boolean | -             | Require explainable decisions |
| `confidence_score_display`       | boolean | -             | Show confidence scores        |

## Usage Examples

### Creating a New Configuration

```typescript
import {
  createConfigurationV3,
  createDefaultEvaluatorConfigV3,
} from "@/services/evaluator.service";

// Create with defaults
const defaultConfig = createDefaultEvaluatorConfigV3(
  "My Configuration",
  "Mathematics"
);

// Customize specific fields
defaultConfig.scoring_methodology.allow_negative_marking = true;
defaultConfig.scoring_methodology.negative_mark_value_mcq = 0.25;
defaultConfig.leniency_strictness.leniency_level = "strict";

// Save to backend
const savedConfig = await createConfigurationV3(defaultConfig);
```

### Updating an Existing Configuration

```typescript
import { updateConfigurationV3 } from "@/services/evaluator.service";

await updateConfigurationV3(configId, {
  leniency_strictness: {
    ...existingConfig.leniency_strictness,
    leniency_level: "lenient",
    leniency_keyword_matching_threshold: 0.6,
  },
});
```

### Validation

```typescript
import { validateConfigurationV3 } from "@/services/evaluator.service";

const validation = validateConfigurationV3(myConfig);
if (!validation.isValid) {
  console.error("Validation errors:", validation.errors);
}
```

## Preset Configurations

Several preset configurations are available:

- **STRICT_ACADEMIC**: High standards for academic excellence
- **LENIENT_LEARNING**: Encouraging environment for learning
- **COMPETITIVE_EXAM**: Configuration for competitive examinations
- **MATHEMATICS_FOCUSED**: Optimized for mathematics evaluation
- **ESSAY_COMPREHENSIVE**: Detailed essay evaluation

```typescript
import { EVALUATOR_PRESETS_V3 } from "@/types/evaluator-config-v3";

// Access preset
const preset = EVALUATOR_PRESETS_V3.COMPETITIVE_EXAM;
```

## React Component Usage

```tsx
import { EvaluatorConfigPanelV3 } from "@/components";

function MyPage() {
  return (
    <EvaluatorConfigPanelV3
      onConfigSelected={(config) => {
        console.log("Selected config:", config);
      }}
      initialConfigId="some-config-id"
    />
  );
}
```

## Environment Variables

```env
# Backend API URL (default: http://localhost:8000)
NEXT_PUBLIC_API_URL=https://api.gradebench.com
```

## Migration from V2

If you're migrating from V2, use the legacy functions with `V3` suffix:

```typescript
// V2 (Legacy)
import { getAllConfigurations } from "@/services/evaluator.service";

// V3 (New)
import { getAllConfigurationsV3 } from "@/services/evaluator.service";
```

Both versions are supported for backward compatibility.

## TypeScript Types

All configuration types are fully typed:

```typescript
import type {
  EvaluatorConfigurationV3,
  EvaluatorConfigurationV3Create,
  EvaluatorConfigurationV3Update,
  ScoringMethodologyConfig,
  LeniencyStrictnessConfig,
  // ... other types
} from "@/types/evaluator-config-v3";
```

## Best Practices

1. **Validation**: Always validate configurations before saving
2. **Presets**: Start with presets and customize as needed
3. **Testing**: Test configurations with sample papers before production use
4. **Versioning**: Enable version control for tracking changes
5. **Audit**: Enable audit trails for compliance requirements
6. **Documentation**: Document custom configurations with clear `grading_philosophy`

## Support

For issues or questions, please refer to the main GradeBench documentation or contact support.
