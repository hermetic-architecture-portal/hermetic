/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
// capabilities was stored as a yaml tree
// flatten this so it's easier to look up foreign keys
const normaliseMetrics = (data) => {
  console.log('Migration: normaliseMetrics');
  const kinds = [
    { name: 'capability', oldPrefix: 'capabilityH' },
    { name: 'technology', oldPrefix: 'h' },
  ];
  kinds.forEach((kind) => {
    if (data[`${kind.oldPrefix}ealthMetricDefinitions`]) {
      console.log(`Migration required - ${kind.name}`);
      data[`${kind.name}MetricBands`] = data[`${kind.oldPrefix}ealthMetricDefinitions`]
        .metricBands.totalBands
        .map((b) => {
          const result = Object.assign({}, b);
          result.bandId = result.totalBandId;
          delete result.totalBandId;
          result.levelNumber = Number.parseInt(result.bandId, 10);
          return result;
        });
      data.metrics = data.metrics || [];
      data[`${kind.name}MetricSets`] = [
        {
          metricSetId: kind.name,
          name: kind.name,
          metrics: [],
        },
      ];
      data[`${kind.oldPrefix}ealthMetricDefinitions`].metrics
        .forEach((metric) => {
          data.metrics.push(metric);
          data[`${kind.name}MetricSets`][0].metrics.push({
            metricId: metric.metricId,
          });
        });
      data[`${kind.name}MetricAssessments`] = [];
      data[`${kind.oldPrefix}ealthMetricAssessments`]
        .forEach((a) => {
          const newA = {
            metricSetId: kind.name,
            assessments: a.metrics.slice(),
          };
          newA[`${kind.name}Id`] = a[`${kind.name}Id`];
          data[`${kind.name}MetricAssessments`].push(newA);
        });
      delete data[`${kind.oldPrefix}ealthMetricAssessments`];
      delete data[`${kind.oldPrefix}ealthMetricDefinitions`];
    }
  });
};
export default normaliseMetrics;
