import { features } from 'hermetic-common';
import cache from './cache';
import extendData from './extendData';

const getCapabilitiesWithDescendants = (allCapabilities, parentCapabilityId, isRoot = true) => {
  const childCapabilities = allCapabilities
    .filter(c => c.parentCapabilityId === parentCapabilityId);
  const result = [];
  childCapabilities.forEach(cc => result
    .push(...getCapabilitiesWithDescendants(allCapabilities, cc.capabilityId, false)));
  result.push(...childCapabilities);
  if (isRoot) {
    result.push(allCapabilities.find(c => c.capabilityId === parentCapabilityId));
  }
  return result;
};

// normalise score to value between 0 and 1
const getNormalisedScore = (score, metric) => (score - metric.minScore)
  / (metric.maxScore - metric.minScore);

const getTotalHealthScore = (assessments, metrics) => {
  const total = metrics.reduce((runningTotal, metric) => {
    const assessment = assessments.find(a => a.metricId === metric.metricId);
    if (assessment) {
      return runningTotal + getNormalisedScore(assessment.score, metric);
    }
    return runningTotal;
  }, 0);
  // because scores are normalised to 1
  const maxPossibleScore = metrics.length;
  return Math.round(100 * total / maxPossibleScore);
};

const getPercentBand = (bands, score) => {
  const band = bands
    .find(b => (score >= b.minPercent) && (score < b.maxPercentExclusive));
  if (!band) {
    throw new Error(`Band not found for score ${score} with bands ${JSON.stringify(bands)}`);
  }
  return band;
};

const getNetworkConnections = (data, baseNodes, technologyId) => {
  // find connections which link to the base nodes
  // or which are explicitly tagged as relevant to an technology
  const filteredConnections = (data.networkConnections || [])
    .filter(c => (technologyId && c.technologies
      && c.technologies.some(tech => tech.technologyId === technologyId))
      || baseNodes.some(n => n.nodeId === c.fromNodeId)
      || baseNodes.some(n => n.nodeId === c.toNodeId))
    .map(c => ({
      from: c.fromNodeId,
      to: c.toNodeId,
      summary: c.summary,
      description: c.description,
      port: c.port,
      protocol: c.protocol,
    }));

  const relevantNodes = [...baseNodes];
  // add in nodes which relevant nodes connect to/from
  relevantNodes.push(...(data.networkNodes || [])
    .filter(n => !relevantNodes.some(rn => rn.nodeId === n.nodeId))
    .filter(n => filteredConnections.some(c => (
      (c.from === n.nodeId) || (c.to === n.nodeId)
    ))));

  const filteredNetworkLocations = (data.networkLocations || [])
    .filter(l => relevantNodes.some(n => n.locationId === l.locationId))
    .map(l => ({
      locationId: l.locationId,
      name: l.name,
    }));

  const nodes = relevantNodes.map(n => ({
    nodeId: n.nodeId,
    name: n.name || n.nodeId,
    locationId: n.locationId,
    isCore: technologyId
      ? n.technologies && n.technologies.some(tech => tech.technologyId === technologyId)
      : baseNodes.some(bn => bn.nodeId === n.nodeId),
    nodeType: n.nodeType,
    environmentNodes: (data.networkNodes || [])
      .filter(en => (!en.isAbstractNode)
        && ((en.implementsNodes || []).some(i => i.nodeId === n.nodeId)))
      .map(en => ({
        nodeId: en.nodeId,
        environmentId: en.environmentId,
        name: en.name || en.nodeId,
      })),
  }));

  return {
    connections: filteredConnections,
    networkLocations: filteredNetworkLocations,
    nodes,
  };
};

const getMaxLevelNumber = bands => bands.reduce((runningMax, current) => (
  current.levelNumber > runningMax ? current.levelNumber : runningMax
), 0);

// data.capabilityMetricBands, data.capabilityMetricSets, data.capabilityMetricAssessments, data.metrics);

const getItemHealth = (item, idFieldName, bands, metricSets, assessments, allMetrics) => {
  if (!item) {
    return item;
  }

  const result = {
    name: item.name,
  };
  result[idFieldName] = item[idFieldName];

  const itemHealth = (assessments || [])
    .find(a => a[idFieldName] === item[idFieldName]);

  if (itemHealth) {
    const metricSet = metricSets.find(ms => ms.metricSetId === itemHealth.metricSetId);
    const relevantMetrics = allMetrics.filter(metric => metricSet
      .metrics.some(msm => msm.metricId === metric.metricId));
    const totalScore = getTotalHealthScore(itemHealth.assessments, relevantMetrics);

    const totalBand = getPercentBand(bands, totalScore);

    result.totalScore = totalScore;
    result.totalBand = {
      levelNumber: totalBand.levelNumber,
      name: totalBand.name,
    };
    result.maxLevelNumber = getMaxLevelNumber(bands);

    const categories = [];
    relevantMetrics.forEach((m) => {
      if (!categories.includes(m.category)) {
        categories.push(m.category);
      }
    });

    result.categoryScores = [];
    categories.forEach((c) => {
      const categoryMetrics = relevantMetrics
        .filter(m => m.category === c);

      const categoryScore = getTotalHealthScore(itemHealth.assessments, categoryMetrics);

      const band = getPercentBand(bands, categoryScore);
      result.categoryScores.push({
        category: c,
        categoryScore: categoryScore,
        band: {
          levelNumber: band.levelNumber,
          name: band.name,
        },
      });
    });

    result.metrics = itemHealth.assessments.map((a) => {
      const definition = allMetrics
        .find(m => m.metricId === a.metricId);
      const percentScore = Math.round(100 * getNormalisedScore(a.score, definition));
      const scoreBand = getPercentBand(bands, percentScore);

      return {
        metricId: definition.metricId,
        name: definition.name,
        description: definition.description,
        category: definition.category,
        score: a.score,
        percentScore: percentScore,
        band: {
          levelNumber: scoreBand.levelNumber,
          name: scoreBand.name,
        },
      };
    });
  }

  return result;
};

const securityTrimFilter = (credentials, technology) => {
  if (technology.userApplication) {
    // regular application, just about anyone can see these
    return true;
  }
  if (!credentials) {
    // running the server in unauthenticated mode, let everyone see it
    return true;
  }
  return credentials.allowedFeatures && credentials.allowedFeatures.includes(features.techDetails);
};

const getImplementedNodes = (implementingNode, networkNodes) => (networkNodes || [])
  .filter(nn => (implementingNode.implementsNodes || [])
    .some(implementsNode => nn.nodeId === implementsNode.nodeId));

const getImplementedNode = (
  implementingNode, networkNodes,
) => getImplementedNodes(implementingNode, networkNodes)
  .pop();

const getCapabilitiesWithAncestors = (capabilities, allCapabilities) => {
  const result = capabilities.slice();
  const parents = capabilities
    .map((c) => {
      const capDetail = allCapabilities.find(ac => ac.capabilityId === c.capabilityId);
      if (capDetail.parentCapabilityId) {
        return {
          capabilityId: capDetail.parentCapabilityId,
        };
      }
      return null;
    }).filter(p => !!p);
  result.push(...parents);
  if (parents.length) {
    result.push(...getCapabilitiesWithAncestors(parents, allCapabilities));
  }
  return result;
};

const mapCapabilityTypes = (data, filterOnCapabilities) => (data.capabilityTypes || [])
  .map(ct => ({
    capabilityTypeId: ct.capabilityTypeId,
    name: ct.name,
    capabilities: (data.capabilities || [])
      .filter(c => c.capabilityTypeId === ct.capabilityTypeId)
      .filter(c => (!filterOnCapabilities)
        || filterOnCapabilities.some(fc => fc.capabilityId === c.capabilityId)),
    valueChains: (data.valueChains || [])
      .filter(vc => vc.capabilityTypeId === ct.capabilityTypeId)
      .map(vc => ({
        valueChainId: vc.valueChainId,
        name: vc.name,
        valueChainSegments: vc.valueChainSegments,
      })),
  }))
  .filter(ct => !!ct.capabilities.length);

const repository = {
  getCapabilityTypes: async (sandbox) => {
    const data = await cache(null, false, sandbox);
    return mapCapabilityTypes(data);
  },
  getTechnologies: async (sandbox, credentials) => {
    const data = await cache(null, false, sandbox);
    const technologies = (data.technologies || [])
      .filter(tech => securityTrimFilter(credentials, tech))
      .map(tech => ({
        technologyId: tech.technologyId,
        name: tech.name,
        technologyType: tech.technologyType,
        parentTechnologyId: tech.parentTechnologyId,
        capabilities: tech.capabilities || [],
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const connections = (data.dataConnections || [])
      // make sure the user is allowed to see both ends of the connection
      .filter(row => technologies.find(t => t.technologyId === row.fromTechnologyId)
        && technologies.find(t => t.technologyId === row.toTechnologyId))
      .map(row => ({
        from: row.fromTechnologyId,
        to: row.toTechnologyId,
        summary: row.summary,
        description: row.description,
      }));
    return {
      technologies,
      connections,
    };
  },
  getTechnologyHealthMetricBands: async (sandbox) => {
    const data = await cache(null, false, sandbox);
    return data.technologyMetricBands || [];
  },
  getTechnologyHealthMetricTotals: async (sandbox, credentials) => {
    const data = await cache(null, false, sandbox);
    const result = (data.technologyMetricAssessments || []).map((a) => {
      const techDetail = data.technologies
        .filter(tech => securityTrimFilter(credentials, tech))
        .find(tech => tech.technologyId === a.technologyId);

      if (!techDetail) {
        return null;
      }

      const metricSet = data.technologyMetricSets.find(tms => tms.metricSetId === a.metricSetId);
      const metrics = data.metrics
        .filter(m => metricSet.metrics.some(msm => msm.metricId === m.metricId));
      const totalScore = getTotalHealthScore(a.assessments, metrics);
      const band = getPercentBand(data.technologyMetricBands, totalScore);

      return {
        technologyId: a.technologyId,
        technologyName: techDetail.name,
        userApplication: !!techDetail.userApplication,
        totalScore,
        slaLevel: techDetail.slaLevel,
        band: {
          bandId: band.bandId,
          levelNumber: band.levelNumber,
          name: band.name,
        },
        maxLevelNumber: getMaxLevelNumber(data.technologyMetricBands),
      };
    }).filter(assessment => !!assessment);
    return result;
  },
  getCapabilityHealthMetricBands: async (sandbox) => {
    const data = await cache(null, false, sandbox);
    return data.capabilityMetricBands || [];
  },
  getCapabilityHealthMetricTotals: async (sandbox) => {
    const data = await cache(null, false, sandbox);
    const result = (data.capabilityMetricAssessments || []).map((a) => {
      const metricSet = data.capabilityMetricSets.find(cms => cms.metricSetId === a.metricSetId);
      const metrics = data.metrics
        .filter(m => metricSet.metrics.some(msm => msm.metricId === m.metricId));
      const totalScore = getTotalHealthScore(a.assessments, metrics);
      const band = getPercentBand(data.capabilityMetricBands, totalScore);
      return {
        capabilityId: a.capabilityId,
        totalScore,
        band: {
          bandId: band.bandId,
          levelNumber: band.levelNumber,
          name: band.name,
        },
        maxLevelNumber: getMaxLevelNumber(data.capabilityMetricBands),
      };
    });
    return result;
  },
  getCapabilityResourcing: async (sandbox) => {
    const data = await cache(null, false, sandbox);
    const result = (data.capabilityResourcing || []).map(c => (
      {
        capabilityId: c.capabilityId,
        headcount: c.headcount,
      }
    ));
    return result;
  },
  getCapabilityDetail: async (sandbox, capabilityId) => {
    const data = await cache(null, false, sandbox);
    const capability = (data.capabilities || [])
      .find(c => c.capabilityId === capabilityId);
    if (!capability) {
      return undefined;
    }
    const result = {
      capabilityId: capability.capabilityId,
      name: capability.name,
      description: capability.description,
      links: capability.links,
    };
    result.childCapabilities = data.capabilities
      .filter(cc => cc.parentCapabilityId === capability.capabilityId)
      .map(cc => ({
        capabilityId: cc.capabilityId,
        name: cc.name,
      }));
    if (capability.parentCapabilityId) {
      result.parentCapability = {
        capabilityId: capability.parentCapabilityId,
        name: data.capabilities.find(c => c.capabilityId === capability.parentCapabilityId)
          .name,
      };
    }
    result.capabilityModel = getCapabilitiesWithDescendants(data.capabilities, capabilityId)
      .map(c => ({
        capabilityId: c.capabilityId,
        capabilityTypeId: c.capabilityTypeId,
        parentCapabilityId: c.parentCapabilityId,
        name: c.name,
      }));
    result.technologies = (data.technologies || [])
      .filter(tech => (tech.capabilities || [])
        .some(cap => cap.capabilityId === result.capabilityId))
      .map(tech => ({
        technologyId: tech.technologyId,
        name: tech.name,
      }));
    return result;
  },
  getCapabilityHealth: async (sandbox, capabilityId) => {
    const data = await cache(null, false, sandbox);
    const capability = (data.capabilities || [])
      .find(c => c.capabilityId === capabilityId);
    if (!capability) {
      return undefined;
    }
    return getItemHealth(capability, 'capabilityId',
      data.capabilityMetricBands, data.capabilityMetricSets,
      data.capabilityMetricAssessments, data.metrics);
  },
  getTechnologyDetail: async (sandbox, technologyId, credentials) => {
    const data = await cache(null, false, sandbox);

    const technology = data.technologies.find(tech => tech.technologyId === technologyId);
    if (!(technology && securityTrimFilter(credentials, technology))) {
      return null;
    }

    const result = {
      technologyId: technology.technologyId,
      name: technology.name,
      purpose: technology.purpose,
      businessOwner: technology.businessOwner,
      aka: technology.aka,
      lastReviewedOn: technology.lastReviewedOn,
      lastReviewedBy: technology.lastReviewedBy,
      generalLinks: technology.generalLinks,
      gdprAssessed: technology.gdprAssessed,
      cloudRiskAssessed: technology.cloudRiskAssessed,
      hasPrivateData: technology.hasPrivateData,
      technologyType: technology.technologyType,
    };

    if (technology.parentTechnologyId) {
      const parentTechnology = data.technologies
        .find(p => p.technologyId === technology.parentTechnologyId);
      result.parentTechnology = {
        technologyId: parentTechnology.technologyId,
        name: parentTechnology.name,
      };
    }

    result.childTechnologies = data.technologies
      .filter(c => c.parentTechnologyId === technology.technologyId)
      .map(c => ({
        technologyId: c.technologyId,
        name: c.name,
      }));

    result.capabilities = (technology.capabilities || []).map((c) => {
      const capability = (data.capabilities || [])
        .find(match => match.capabilityId === c.capabilityId);
      if (!capability) {
        return false;
      }
      return {
        capabilityId: c.capabilityId,
        name: capability.name,
      };
    }).filter(c => c)
      .sort((a, b) => a.name.localeCompare(b.name));

    const connections = (data.dataConnections || [])
      .filter(row => (
        (row.fromTechnologyId === technologyId) || (row.toTechnologyId === technologyId)
      ))
      .map(row => ({
        from: row.fromTechnologyId,
        to: row.toTechnologyId,
        summary: row.summary,
        description: row.description,
      }));

    result.connectedTechnologies = data.technologies
      .filter(tech => connections
        .some(c => (c.from === tech.technologyId) || (c.to === tech.technologyId)))
      .filter(tech => securityTrimFilter(credentials, tech))
      .map(tech => ({
        technologyId: tech.technologyId,
        name: tech.name,
      }));

    result.dataEntities = [];

    (data.dataEntities || []).forEach((de) => {
      const dt = (de.technologies || []).find(det => det.technologyId === technologyId);
      if (dt) {
        result.dataEntities.push({
          role: data.dataAccessRoles.find(dar => dar.dataAccessRoleId === dt.dataAccessRoleId),
          dataEntityId: de.dataEntityId,
          dataEntityName: de.name,
          description: dt.description,
        });
      }
    });

    result.connections = connections
      // make sure the user is allowed to see both ends of the connection
      .filter(row => result.connectedTechnologies.find(t => t.technologyId === row.from)
        && result.connectedTechnologies.find(t => t.technologyId === row.from));

    extendData(result, technology, 'technology', features.core, data);
    return result;
  },
  getTechnologyTechDetail: async (sandbox, technologyId) => {
    const data = await cache(null, false, sandbox);
    // don't need to security filter this as it requires the techDetails feature anyway
    const technology = data.technologies.find(tech => tech.technologyId === technologyId);

    if (!technology) {
      return technology;
    }

    const relevantNodes = (data.networkNodes || [])
      .filter(node => node.technologies && node.technologies
        .some(tech => tech.technologyId === technologyId));

    const connections = getNetworkConnections(data, relevantNodes, technologyId);

    const supportingTechnologies = (technology.supportingTechnologies || [])
      .map((st) => {
        const stDetail = data.technologies.find(tech => tech.technologyId === st.technologyId);
        return {
          technologyId: stDetail.technologyId,
          name: stDetail.name,
        };
      });

    const supportsTechnologies = data.technologies
      .filter(otherTech => (otherTech.supportingTechnologies || [])
        .find(st => st.technologyId === technologyId))
      .map(otherTech => ({
        technologyId: otherTech.technologyId,
        name: otherTech.name,
      }));

    const standardLevel = (data.technicalStandardLevels || [])
      .find(s => s.levelId === technology.standardLevelId);

    const functionalCapabilities = (data.functionalCapabilities || [])
      .filter(fc => (fc.technologies || [])
        .some(fct => fct.technologyId === technologyId))
      .map(fc => ({
        name: fc.name,
        functionalCapabilityId: fc.functionalCapabilityId,
      }));

    const result = {
      technologyId,
      name: technology.name,
      contacts: technology.contacts,
      slaLevel: technology.slaLevel,
      disasterRecovery: technology.disasterRecovery,
      technologyType: technology.technologyType,
      category: technology.category,
      lifecycleStatus: technology.lifecycleStatus,
      technicalLinks: technology.technicalLinks,
      nodes: connections.nodes,
      supportingTechnologies,
      supportsTechnologies,
      standardLevel,
      standardNotes: technology.standardNotes,
      environments: data.deploymentEnvironments || [],
      connections: connections.connections,
      networkLocations: connections.networkLocations,
      functionalCapabilities,
    };
    extendData(result, technology, 'technology', features.techDetails, data);
    return result;
  },
  getTechnologyComponents: async (sandbox, technologyId) => {
    const data = await cache(null, false, sandbox);
    // don't need to security filter this as it requires the techDetails feature anyway
    const technology = data.technologies.find(tech => tech.technologyId === technologyId);

    if (!technology) {
      return technology;
    }

    const connections = [];
    const components = [];

    (data.componentConnections || []).forEach((conn) => {
      const fromComponent = data.components.find(c => c.componentId === conn.fromComponentId);
      const toComponent = data.components.find(c => c.componentId === conn.toComponentId)
        || data.components
          .find(c => c.interfaces && c.interfaces.some(i => i.interfaceId === conn.toInterfaceId));
      const inScope = (fromComponent.technologies && fromComponent.technologies
        .find(tech => tech.technologyId === technologyId))
        || (toComponent.technologies && toComponent.technologies
          .find(tech => tech.technologyId === technologyId));
      if (inScope) {
        connections.push({
          fromComponentId: conn.fromComponentId,
          toComponentId: toComponent.componentId,
          toInterfaceId: conn.toInterfaceId,
          description: conn.description,
          tags: conn.tags || [],
        });
        if (!components.includes(fromComponent)) {
          components.push(fromComponent);
        }
        if (!components.includes(toComponent)) {
          components.push(toComponent);
        }
      }
    });

    return {
      components: components.map(c => ({
        componentId: c.componentId,
        description: c.description,
        actor: c.actor,
        technologies: (c.technologies || []).map(a => ({
          technologyId: a.technologyId,
        })),
        interfaces: (c.interfaces || []).map(i => ({
          interfaceId: i.interfaceId,
          description: i.description,
        })),
      })),
      connections,
    };
  },
  getTechnologyComponentDeployment: async (sandbox, technologyId) => {
    const data = await cache(null, false, sandbox);
    // don't need to security filter this as it requires the techDetails feature anyway
    const technology = data.technologies.find(tech => tech.technologyId === technologyId);

    if (!technology) {
      return technology;
    }

    const nodes = [];
    (data.componentDeployments || []).forEach((cd) => {
      const component = data.components.find(c => c.componentId === cd.componentId);
      if (component.technologies
        && component.technologies.find(a => a.technologyId === technologyId)) {
        const node = data.networkNodes.find(n => n.nodeId === cd.nodeId);
        let nodeElement = nodes.find(n => n.nodeId === node.nodeId);
        if (!nodeElement) {
          nodeElement = {
            nodeId: node.nodeId,
            name: node.name,
            components: [],
            executionEnvironments: [],
          };
          nodes.push(nodeElement);
        }
        if (cd.executionEnvironment
          && !nodeElement.executionEnvironments.includes(cd.executionEnvironment)) {
          nodeElement.executionEnvironments.push(cd.executionEnvironment);
        }
        nodeElement.components.push({
          componentId: component.componentId,
          description: component.description,
          executionEnvironment: cd.executionEnvironment,
        });
      }
    });
    return nodes;
  },
  getTechnologyHealth: async (sandbox, technologyId, credentials) => {
    const data = await cache(null, false, sandbox);
    const technology = data.technologies.find(tech => tech.technologyId === technologyId);
    if (!(technology && securityTrimFilter(credentials, technology))) {
      return null;
    }

    return getItemHealth(technology, 'technologyId',
      data.technologyMetricBands, data.technologyMetricSets,
      data.technologyMetricAssessments, data.metrics);
  },

  getNodes: async (sandbox) => {
    const data = await cache(null, false, sandbox);
    const result = (data.networkNodes || [])
      .filter(n => (n.nodeType !== 'Mobile Device') && (n.nodeType !== 'Desktop'))
      .map((n) => {
        const node = {
          nodeId: n.nodeId,
          name: n.name || n.nodeId,
          isAbstractNode: n.isAbstractNode,
        };
        if (n.isAbstractNode) {
          node.nodeType = n.nodeType;
        } else {
          const implementedNode = getImplementedNode(n, data.networkNodes);
          node.nodeType = n.nodeType || implementedNode.nodeType;
        }
        return node;
      });
    return result;
  },

  getNode: async (sandbox, nodeId) => {
    const data = await cache(null, false, sandbox);
    // don't need to security filter this as it requires the techDetails feature anyway
    const node = (data.networkNodes || []).find(n => n.nodeId === nodeId);

    if (!node) {
      return node;
    }

    const implementedNodes = node.isAbstractNode ? undefined
      : getImplementedNodes(node, data.networkNodes);

    const implementedNodesResult = node.isAbstractNode ? undefined
      : implementedNodes
        .map(n => ({
          nodeId: n.nodeId,
          name: n.name || n.nodeId,
        }));

    // eslint-disable-next-line prefer-destructuring
    let locationId = node.locationId;
    if ((!locationId) && implementedNodes && implementedNodes.length) {
      // eslint-disable-next-line prefer-destructuring
      locationId = implementedNodes[0].locationId;
    }
    // eslint-disable-next-line prefer-destructuring
    let nodeType = node.nodeType;
    if ((!nodeType) && implementedNodes && implementedNodes.length) {
      // eslint-disable-next-line prefer-destructuring
      nodeType = implementedNodes[0].nodeType;
    }
    const location = locationId && data.networkLocations.find(l => l.locationId === locationId);
    const environment = node.environmentId
      ? data.deploymentEnvironments.find(e => e.environmentId === node.environmentId)
      : { environmentId: 'default', name: 'Default' };

    const environmentNodes = !node.isAbstractNode ? undefined
      : data.networkNodes
        .filter(en => (!en.isAbstractNode)
          && ((en.implementsNodes || []).some(i => i.nodeId === node.nodeId)))
        .map(en => ({
          nodeId: en.nodeId,
          name: en.name || en.nodeId,
          environment: data.deploymentEnvironments
            .find(e => e.environmentId === en.environmentId),
        }));

    const technologiesData = (implementedNodes && implementedNodes.length)
      ? implementedNodes[0].technologies
      : node.technologies;

    const technologies = !technologiesData ? undefined
      : technologiesData.map(a => data.technologies
        .map(appDefinition => ({
          technologyId: appDefinition.technologyId,
          name: appDefinition.name,
        }))
        .find(appDefinition => appDefinition.technologyId === a.technologyId));

    let connections;

    if (implementedNodes && implementedNodes.length) {
      connections = getNetworkConnections(data, implementedNodes);
    } else {
      connections = getNetworkConnections(data, [node]);
    }

    const result = {
      nodeId: node.nodeId,
      name: node.name || node.nodeId,
      nodeType,
      location,
      environment,
      implementedNodes: implementedNodesResult,
      environmentNodes,
      technologies,
      connections,
    };

    if (!node.environmentId) {
      extendData(result, node, 'networkNode', features.techDetails, data);
    } else {
      extendData(result, node, 'environmentNode', features.techDetails, data);
    }

    return result;
  },

  getBusinessUnits: async (sandbox) => {
    const data = await cache(null, false, sandbox);
    return (data.businessUnits || [])
      .map(bu => ({
        businessUnitId: bu.businessUnitId,
        name: bu.name,
        capabilities: (bu.capabilities || [])
          .map(cap => ({ capabilityId: cap.capabilityId })),
      }));
  },

  getBusinessUnitDetail: async (sandbox, businessUnitId) => {
    const data = await cache(null, false, sandbox);
    const bu = (data.businessUnits || [])
      .find(match => match.businessUnitId === businessUnitId);
    if (!bu) {
      return bu;
    }

    const businessUnitCapabilities = getCapabilitiesWithAncestors(
      (bu.capabilities || []), (data.capabilities || []),
    );
    const capabilityTypes = mapCapabilityTypes(data, businessUnitCapabilities);

    return {
      businessUnitId: bu.businessUnitId,
      name: bu.name,
      description: bu.description,
      links: bu.links,
      capabilityTypes: capabilityTypes,
    };
  },

  getTechnicalReferenceModel: async (sandbox) => {
    const data = await cache(null, false, sandbox);
    return {
      layers: (data.technicalReferenceModelLayers || [])
        .map(l => ({
          trmLayerId: l.trmLayerId,
          name: l.name,
          categories: (data.technicalReferenceModelCategories || [])
            .filter(c => c.trmLayerId === l.trmLayerId),
        })),
      categories: (data.technicalReferenceModelCategories || []),
    };
  },

  getTechnicalStandardAssessments: async (sandbox) => {
    const data = await cache(null, false, sandbox);
    const technologies = (data.technologies || [])
      .map(t => ({
        technologyId: t.technologyId,
        standardLevelId: t.standardLevelId,
      }));
    return {
      technologies,
      technicalStandardLevels: data.technicalStandardLevels,
    };
  },

  getDataTopicTypes: async (sandbox) => {
    const data = await cache(null, false, sandbox);
    return data.dataTopicTypes || [];
  },

  getDataTopics: async (sandbox) => {
    const data = await cache(null, false, sandbox);
    return data.dataTopics || [];
  },

  getDataEntities: async (sandbox) => {
    const data = await cache(null, false, sandbox);
    return (data.dataEntities || [])
      .map(de => ({
        dataEntityId: de.dataEntityId,
        parentDataEntityId: de.parentDataEntityId,
        dataTopicId: de.dataTopicId,
        name: de.name,
      }));
  },

  getDataEntity: async (sandbox, dataEntityId) => {
    const data = await cache(null, false, sandbox);
    const entity = (data.dataEntities || [])
      .find(de => de.dataEntityId === dataEntityId);
    if (!entity) {
      return entity;
    }

    const technologies = (entity.technologies || [])
      .map((et) => {
        const technology = data.technologies.find(t => t.technologyId === et.technologyId);
        const role = data.dataAccessRoles.find(r => r.dataAccessRoleId === et.dataAccessRoleId);
        return {
          technologyId: technology.technologyId,
          technologyName: technology.name,
          role,
          description: et.description,
        };
      });

    const result = {
      dataEntityId: entity.dataEntityId,
      name: entity.name,
      description: entity.description,
      links: entity.links,
      technologies,
      childEntities: data.dataEntities
        .filter(ce => ce.parentDataEntityId === entity.dataEntityId)
        .map(ce => ({
          dataEntityId: ce.dataEntityId,
          name: ce.name,
        })),
    };
    if (entity.parentDataEntityId) {
      const parentEntity = data.dataEntities
        .find(de => de.dataEntityId === entity.parentDataEntityId);
      result.parentEntity = {
        dataEntityId: parentEntity.dataEntityId,
        name: parentEntity.name,
      };
    }
    return result;
  },

  getEaDomains: async (sandbox) => {
    const data = await cache(null, false, sandbox);

    const result = (data.eaDomains || [])
      .map(ead => ({
        eaDomainId: ead.eaDomainId,
        name: ead.name,
        displayOrder: ead.displayOrder,
        isCrossCutting: ead.isCrossCutting,
        artifacts: (data.eaArtifacts || [])
          .filter(a => a.eaDomainId === ead.eaDomainId)
          .map(a => ({
            eaArtifactId: a.eaArtifactId,
            name: a.name,
          })),
      }));
    return result;
  },

  getEaArtifact: async (sandbox, eaArtifactId) => {
    const data = await cache(null, false, sandbox);

    const artifact = (data.eaArtifacts || [])
      .find(a => a.eaArtifactId === eaArtifactId);

    if (!artifact) {
      return artifact;
    }

    return {
      eaArtifactId: artifact.eaArtifactId,
      name: artifact.name,
      description: artifact.description,
      links: artifact.links,
    };
  },
  getEaArtifactMetricBands: async (sandbox) => {
    const data = await cache(null, false, sandbox);
    return data.eaArtifactMetricBands || [];
  },
  getEaArtifactMetricTotals: async (sandbox) => {
    const data = await cache(null, false, sandbox);
    const result = (data.eaArtifactMetricAssessments || []).map((a) => {
      const metricSet = data.eaArtifactMetricSets.find(ems => ems.metricSetId === a.metricSetId);
      const metrics = data.metrics
        .filter(m => metricSet.metrics.some(msm => msm.metricId === m.metricId));
      const totalScore = getTotalHealthScore(a.assessments, metrics);
      const band = getPercentBand(data.eaArtifactMetricBands, totalScore);
      return {
        eaArtifactId: a.eaArtifactId,
        totalScore,
        band: {
          bandId: band.bandId,
          levelNumber: band.levelNumber,
          name: band.name,
        },
        maxLevelNumber: getMaxLevelNumber(data.eaArtifactMetricBands),
      };
    });
    return result;
  },
  getEaArtifactHealth: async (sandbox, eaArtifactId) => {
    const data = await cache(null, false, sandbox);
    const artifact = (data.eaArtifacts || [])
      .find(a => a.eaArtifactId === eaArtifactId);
    if (!artifact) {
      return undefined;
    }
    return getItemHealth(artifact, 'eaArtifactId',
      data.eaArtifactMetricBands, data.eaArtifactMetricSets,
      data.eaArtifactMetricAssessments, data.metrics);
  },
  getFunctionalCapabilities: async (sandbox) => {
    const data = await cache(null, false, sandbox);
    const capabilities = (data.functionalCapabilities || [])
      .map((c) => {
        const result = {
          functionalCapabilityId: c.functionalCapabilityId,
          name: c.name,
          trmCategoryId: c.trmCategoryId,
          technologies: [],
        };
        if (c.trmCategoryId) {
          const trmCategory = data.technicalReferenceModelCategories
            .find(trmc => trmc.trmCategoryId === c.trmCategoryId);
          result.categoryName = trmCategory.name;
        }
        if (c.technologies) {
          result.technologies = c.technologies
            .map((ct) => {
              const technology = data.technologies
                .find(t => t.technologyId === ct.technologyId);
              return {
                technologyId: ct.technologyId,
                name: technology.name,
                remarks: ct.remarks,
              };
            }).sort((a, b) => a.name.localeCompare(b.name));
        }
        return result;
      });

    return capabilities;
  },
  getFunctionalCapability: async (sandbox, functionalCapabilityId) => {
    const data = await cache(null, false, sandbox);

    const capability = (data.functionalCapabilities || [])
      .find(c => c.functionalCapabilityId === functionalCapabilityId);
    if (!capability) {
      return null;
    }

    const result = {
      functionalCapabilityId: capability.functionalCapabilityId,
      name: capability.name,
      description: capability.description,
    };

    if (capability.trmCategoryId) {
      const trmCategory = data.technicalReferenceModelCategories
        .find(trmc => trmc.trmCategoryId === capability.trmCategoryId);
      result.categoryName = trmCategory.name;
    }

    result.technologies = (capability.technologies || [])
      .map((ct) => {
        const technology = data.technologies
          .find(t => t.technologyId === ct.technologyId);
        return {
          technologyId: ct.technologyId,
          name: technology.name,
          remarks: ct.remarks,
        };
      }).sort((a, b) => a.name.localeCompare(b.name));

    return result;
  },
};

export default repository;
