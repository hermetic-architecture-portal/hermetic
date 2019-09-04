import Joi from 'joi';
import schema from './schema';

class ValidationError extends Error {}

const validateMetricScores = (assessmentSets, metrics, parentName, parentIdField, errors) => {
  if (!(assessmentSets && metrics)) {
    return;
  }
  assessmentSets.forEach((aSet) => {
    aSet.assessments
      .forEach((a) => {
        const metric = metrics.find(m => m.metricId === a.metricId);
        if (a.score > metric.maxScore) {
          errors.push(`Assessment score ${a.score} exceeds maximum ${metric.maxScore} for ${parentName} ${aSet[parentIdField]}, metric ${a.metricId}`);
        }
        if (a.score < metric.minScore) {
          errors.push(`Assessment score ${a.score} is less than minimum ${metric.minScore} for ${parentName} ${aSet[parentIdField]}, metric ${a.metricId}`);
        }
      });
  });
};

const integrityValidation = (data) => {
  const errors = [];

  validateMetricScores(data.capabilityMetricAssessments, data.metrics,
    'capability', 'capabilityId', errors);
  validateMetricScores(data.technologyMetricAssessments, data.metrics, 'technology',
    'technologyId', errors);

  if (errors.length) {
    throw new ValidationError(errors.join('\n'));
  }
};

const validate = (data) => {
  const schemaValidationResult = Joi.validate(data, schema,
    { context: { data, schema } });

  if (schemaValidationResult.error) {
    throw new ValidationError(schemaValidationResult.error.message);
  }
  integrityValidation(data);
};


export default {
  validate,
  ValidationError,
};
