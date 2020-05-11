import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import { HorizontalBar } from 'react-chartjs-2';
import palette from 'google-palette';
import modelStore from '../../stores/modelStore';
import costModelFilterStore from '../../stores/costModelFilterStore';
import YearSelector from './YearSelector';
import DisplaySlider from './DisplaySlider';
import TechnologySelector from './TechnologySelector';
import CategorySelector from './CategorySelector';

const colours = palette('mpn65', 40)
  .map(c => `#${c}`);

const getVendorData = () => {
  const labels = [];
  labels.allCategories = [];

  const addVendorCost = (vendorId, category, cost) => {
    let labelItem = labels.find(l => l.vendorId === vendorId);

    if (!labelItem) {
      const vendor = modelStore.vendors.find(v => v.vendorId === vendorId);
      const vendorName = vendor ? vendor.name : vendorId;

      labelItem = {
        label: vendorName,
        vendorId: vendorId,
        categories: [],
        totalCost: 0,
      };
      labels.push(labelItem);
    }
    let categoryItem = labelItem.categories.find(c => c.category === category);
    if (!categoryItem) {
      categoryItem = {
        category,
        cost: 0,
      };
      labelItem.categories.push(categoryItem);
    }
    categoryItem.cost += cost;
    labelItem.totalCost += cost;
  };

  modelStore.technologyCosts
    .filter(tc => tc.vendorId)
    .filter(tc => (tc.year >= costModelFilterStore.yearFrom)
      && (tc.year <= costModelFilterStore.yearTo))
    .forEach((tc) => {
      if (!labels.allCategories.find(c => c === tc.category)) {
        labels.allCategories.push(tc.category);
      }
      addVendorCost(tc.vendorId, tc.category, tc.cost);
    });

  return labels;
};

const getTechnologyData = () => {
  const labels = [];
  labels.allCategories = [];

  const addTechCost = (technologyId, vendorId, category, cost) => {
    let labelItem = labels
      .find(l => (technologyId && (l.technologyId === technologyId))
        || ((!technologyId) && (!l.technologyId) && (l.vendorId === vendorId)));

    if (!labelItem) {
      let label;
      if (technologyId) {
        const technology = modelStore.technologies.find(t => t.technologyId === technologyId);
        label = technology ? technology.name : technologyId;
      } else {
        const vendor = modelStore.vendors.find(v => v.vendorId === vendorId);
        const vendorName = vendor ? vendor.name : vendorId;
        label = `${vendorName} - Unknown Tech`;
      }

      labelItem = {
        label,
        vendorId: vendorId,
        technologyId: technologyId,
        categories: [],
        totalCost: 0,
      };
      labels.push(labelItem);
    }
    let categoryItem = labelItem.categories.find(c => c.category === category);
    if (!categoryItem) {
      categoryItem = {
        category,
        cost: 0,
      };
      labelItem.categories.push(categoryItem);
    }
    categoryItem.cost += cost;
  };

  modelStore.technologyCosts
    .filter(tc => (tc.year >= costModelFilterStore.yearFrom)
      && (tc.year <= costModelFilterStore.yearTo))
    .forEach((tc) => {
      if (!labels.allCategories.find(c => c === tc.category)) {
        labels.allCategories.push(tc.category);
      }
      addTechCost(tc.technologyId, tc.vendorId, tc.category, tc.cost);
    });
  return labels;
};

const getData = (labels) => {
  labels.forEach((l) => {
    // eslint-disable-next-line no-param-reassign
    l.totalCost = l.categories
      .filter(c => !costModelFilterStore.excludedCategories.includes(c.category))
      .reduce((total, c) => total + c.cost, 0);
  });

  let maxFirstElement = labels.filter(l => l.totalCost > 0).length - 30;
  maxFirstElement = (maxFirstElement < 0) ? 0 : maxFirstElement;
  const firstElement = Math.floor((costModelFilterStore.topItem / 100) * maxFirstElement);
  const lastElement = firstElement + 30;

  const sortedLabels = labels
    .filter(l => l.totalCost > 0)
    .sort((a, b) => b.totalCost - a.totalCost)
    .slice(firstElement, lastElement);

  const datasets = labels.allCategories
    .filter(c => !costModelFilterStore.excludedCategories.includes(c))
    .map((c, categoryIndex) => ({
      label: c,
      backgroundColor: sortedLabels.map(() => colours[categoryIndex]),
      data: sortedLabels.map((l) => {
        const categoryItem = l.categories.find(lc => lc.category === c);
        return categoryItem ? categoryItem.cost : 0;
      }),
    }));

  return {
    labels: sortedLabels.map(l => l.label),
    datasets,
  };
};

const VendorCostChart = () => {
  const labels = costModelFilterStore.vendorsOrTechnologies === 'vendors'
    ? getVendorData()
    : getTechnologyData();

  const chartData = getData(labels);

  const options = {
    scales: {
      yAxes: [{
        stacked: true,
        ticks: {
          autoSkip: false,
        },
      }],
      xAxes: [{
        stacked: true,
        position: 'top',
        ticks: {
          // format costs with thousands groups
          callback: value => value.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        },
      }],
    },
  };

  return <div>
    <div className="Overlay-options">
      <YearSelector costs={modelStore.technologyCosts} />
      <TechnologySelector />
      <CategorySelector categories={labels.allCategories} />
      <DisplaySlider />
    </div>
    <HorizontalBar
      data={chartData} options={options}
      />
  </div>;
};

export default observer(VendorCostChart);
