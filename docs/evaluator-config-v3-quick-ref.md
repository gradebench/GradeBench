# Evaluator Configuration V3 - Quick Reference

## Quick Start

### 1. Import Types

```typescript
import type { EvaluatorConfigurationV3 } from "@gb/quicks/types";
import { createDefaultEvaluatorConfigV3 } from "@gb/quicks/types";
```

### 2. Import Services

```typescript
import {
  createConfigurationV3,
  updateConfigurationV3,
  deleteConfigurationV3,
  getAllConfigurationsV3,
  validateConfigurationV3,
} from "@gb/quicks/services/evaluator.service";
```

### 3. Create Configuration

```typescript
const config = createDefaultEvaluatorConfigV3("Physics Exam", "Physics");
const saved = await createConfigurationV3(config);
```

## API Endpoints

| Action | Method | Endpoint                                 |
| ------ | ------ | ---------------------------------------- |
| List   | GET    | `/grade/v1/evaluator-configurations`     |
| Get    | GET    | `/grade/v1/evaluator-configurations/:id` |
| Create | POST   | `/grade/v1/evaluator-configurations`     |
| Update | PATCH  | `/grade/v1/evaluator-configurations/:id` |
| Delete | DELETE | `/grade/v1/evaluator-configurations/:id` |

## Configuration Structure

```typescript
{
  id: string;
  config_name: string;
  description?: string;
  identity: {...},               // Subject, exam type, philosophy
  scoring_methodology: {...},     // Marks, rounding, negative marking
  leniency_strictness: {...},    // Strictness levels, thresholds
  partial_marking_rules: {...},  // Partial marks, deductions
  feedback_preferences: {...},    // Tone, verbosity, style
  annotation_preferences: {...},  // PDF annotations, colors
  consistency_fairness: {...},   // Consistency checks, bias detection
  learning_adaptation: {...},     // AI learning settings
  subject_specific_rules: {...}, // Subject overrides
  question_type_rules: {...},    // MCQ, Essay, Code rules
  audit_compliance: {...},        // Audit trail, versioning
  quality_metrics: {...}          // Accuracy, confidence scores
}
```

## Common Configurations

### Strict Academic

```typescript
{
  leniency_strictness: {
    leniency_level: "strict",
    leniency_keyword_matching_threshold: 0.8,
  },
  partial_marking_rules: {
    partial_marking_enabled: false,
  }
}
```

### Lenient Learning

```typescript
{
  leniency_strictness: {
    leniency_level: "lenient",
    allow_alternative_approaches: true,
  },
  feedback_preferences: {
    feedback_tone: "encouraging",
    feedback_include_improvement_tips: true,
  }
}
```

### Competitive Exam

```typescript
{
  scoring_methodology: {
    allow_negative_marking: true,
    negative_marking_policy: "per_question",
    negative_mark_value_mcq: 0.25,
  },
  leniency_strictness: {
    leniency_level: "strict",
  }
}
```

## Key Parameters by Category

### Scoring (scoring_methodology)

- `scoring_scheme_default`: "integer" | "decimal"
- `decimal_precision`: 0-3
- `allow_negative_marking`: boolean
- `negative_mark_value_mcq`: number
- `rounding_policy`: "round_up" | "round_down" | "round_nearest" | "no_rounding"

### Leniency (leniency_strictness)

- `leniency_level`: "very_strict" | "strict" | "moderate" | "lenient" | "very_lenient"
- `leniency_keyword_matching_threshold`: 0.0-1.0
- `leniency_spelling_grammar_penalty_percent`: 0-100
- `allow_alternative_approaches`: boolean

### Partial Marking (partial_marking_rules)

- `partial_marking_enabled`: boolean
- `partial_mark_for_correct_method_wrong_answer`: 0-100
- `deduction_per_spelling_error`: number
- `keyword_hit_percentage_for_full_marks`: 0-100

### Feedback (feedback_preferences)

- `feedback_tone`: "encouraging" | "neutral" | "strict" | "professional" | "conversational"
- `feedback_verbosity`: "concise" | "moderate" | "detailed" | "comprehensive"
- `feedback_granularity`: "per_point" | "per_sub_question" | "per_question" | "summary_only"

### Subject-Specific (subject_specific_rules)

#### Math

- `subject_math_require_working`: boolean
- `subject_math_formula_weight`: 0-1.0
- `subject_math_calculation_weight`: 0-1.0

#### Literature

- `subject_literature_thematic_analysis_weight`: 0-1.0
- `subject_literature_textual_evidence_required`: boolean

#### Code

- `subject_code_syntax_weight`: 0-1.0
- `subject_code_logic_weight`: 0-1.0
- `subject_code_execution_required`: boolean

## Validation

```typescript
const validation = validateConfigurationV3(myConfig);
if (!validation.isValid) {
  console.error("Errors:", validation.errors);
}
```

### Common Validation Rules

- Decimal precision: 0-3
- Percentages: 0-100
- Thresholds: 0.0-1.0
- Weights: 0.0-1.0
- Grace marks: 0.0-5.0
- Colors: Valid hex (#RRGGBB)

## React Component

```tsx
import { EvaluatorConfigPanelV3 } from "@gb/quicks/components";

<EvaluatorConfigPanelV3
  onConfigSelected={(config) => {
    // Handle selected config
  }}
  initialConfigId="optional-id"
/>;
```

## Presets

```typescript
import { EVALUATOR_PRESETS_V3 } from "@gb/quicks/types";

const presets = [
  EVALUATOR_PRESETS_V3.STRICT_ACADEMIC,
  EVALUATOR_PRESETS_V3.LENIENT_LEARNING,
  EVALUATOR_PRESETS_V3.COMPETITIVE_EXAM,
  EVALUATOR_PRESETS_V3.MATHEMATICS_FOCUSED,
  EVALUATOR_PRESETS_V3.ESSAY_COMPREHENSIVE,
];
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Common Patterns

### Create with Defaults

```typescript
const config = createDefaultEvaluatorConfigV3("My Config", "Subject");
```

### Update Specific Field

```typescript
await updateConfigurationV3(id, {
  leniency_strictness: {
    ...existing.leniency_strictness,
    leniency_level: "lenient",
  },
});
```

### Duplicate Configuration

```typescript
const duplicate = await duplicateConfigurationV3(originalId, "New Name");
```

### Filter by Subject

```typescript
const mathConfigs = await getConfigurationsBySubjectV3("Mathematics");
```

## Tips

1. **Start with Presets**: Use preset configurations as starting points
2. **Validate First**: Always validate before saving
3. **Test Changes**: Test with sample papers before production
4. **Document Custom Settings**: Use `grading_philosophy` field
5. **Enable Auditing**: Turn on audit trails for compliance
6. **Version Control**: Enable version control for tracking changes

## Troubleshooting

### Configuration Not Saving

- Check validation errors
- Verify backend URL in environment
- Ensure all required fields are present

### Validation Failing

- Check parameter ranges (see validation rules)
- Verify hex color formats (#RRGGBB)
- Ensure percentages are 0-100
- Confirm thresholds are 0.0-1.0

### Component Not Rendering

- Verify imports are correct
- Check backend API is running
- Ensure NEXT_PUBLIC_API_URL is set

## Reference Links

- Full Documentation: `docs/evaluator-config-v3.md`
- Update Summary: `docs/EVALUATOR_CONFIG_UPDATE_SUMMARY.md`
- Type Definitions: `elements/quicks/src/types/evaluator-config-v3.ts`
- Service Layer: `elements/quicks/src/services/evaluator.service.ts`
