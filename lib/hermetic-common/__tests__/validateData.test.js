import validateData from '../src/validateData';

const metrics = [{
  metricId: 'a',
  category: 'A',
  name: 'A',
  description: 'AAAA',
  minScore: 1,
  maxScore: 3,
}];

const technologyMetricSets = [{
  metricSetId: '1',
  name: 'ms1',
  metrics: [{ metricId: 'a' }],
}];

const capabilityMetricSets = [{
  metricSetId: '1',
  name: 'ms1',
  metrics: [{ metricId: 'a' }],
}];

const capabilities = [{
  capabilityId: 'c1',
  name: 'C1',
  capabilityTypeId: 'ct1',
}];

const capabilityTypes = [{
  capabilityTypeId: 'ct1',
  name: 'CT1',
}];

const technologies = [{
  technologyId: 't1',
  name: 'T1',
}];

describe('validateData', () => {
  it('passes when a technology metric assessment is in bounds', () => {
    const goodData = {
      metrics,
      technologies,
      technologyMetricSets,
      technologyMetricAssessments: [{
        technologyId: 't1',
        metricSetId: '1',
        assessments: [{ metricId: 'a', score: 1 }],
      }],
    };
    validateData.validate(goodData);
  });
  it('fails when a technology metric assessment is out of bounds', () => {
    const goodData = {
      metrics,
      technologies,
      technologyMetricSets,
      technologyMetricAssessments: [{
        technologyId: 't1',
        metricSetId: '1',
        assessments: [{ metricId: 'a', score: 4 }],
      }],
    };
    let validationPassed;
    try {
      validateData.validate(goodData);
      validationPassed = true;
    } catch (e) {
      expect(e).toBeInstanceOf(validateData.ValidationError);
    }
    expect(validationPassed).toBeFalsy();
  });
  it('passes when a capability metric assessment is in bounds', () => {
    const goodData = {
      metrics,
      capabilityTypes,
      capabilities,
      capabilityMetricSets,
      capabilityMetricAssessments: [{
        capabilityId: 'c1',
        metricSetId: '1',
        assessments: [{ metricId: 'a', score: 1 }],
      }],
    };
    validateData.validate(goodData);
  });
  it('fails when a capability metric assessment is out of bounds', () => {
    const goodData = {
      metrics,
      capabilityTypes,
      capabilities,
      capabilityMetricSets,
      capabilityMetricAssessments: [{
        capabilityId: 'c1',
        metricSetId: '1',
        assessments: [{ metricId: 'a', score: 4 }],
      }],
    };
    let validationPassed;
    try {
      validateData.validate(goodData);
      validationPassed = true;
    } catch (e) {
      expect(e).toBeInstanceOf(validateData.ValidationError);
    }
    expect(validationPassed).toBeFalsy();
  });
});
