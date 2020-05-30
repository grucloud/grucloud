const assert = require("assert");
const _ = require("lodash");

const findUsedBy = ({ plan, specs, mapPlans }) => {
  const spec = specs.find((spec) => spec.type === plan.resource.type);
  assert(spec);

  if (!mapPlans.has(plan.resource.name)) {
    return;
  }
  return _.flatten([
    plan,
    ...spec.usedBy.map((type) => {
      const plansWithType = [...mapPlans.values()]
        .filter((plan) => plan.resource.type === type)
        .filter((x) => x)
        .map((plan) => {
          const result = findUsedBy({ plan, specs, mapPlans });
          mapPlans.delete(plan.resource.name);
          return result;
        });
      return _.flatten(plansWithType);
    }),
  ]);
};

const specUsedBy = (specs) =>
  specs.map((spec) => {
    const usedBy = specs
      .filter(({ dependsOn }) => dependsOn === spec.type)
      .map((spec) => spec.type)
      .filter((x) => x);
    return { ...spec, usedBy };
  });

const PlanReorder = ({ plans, specs: specsIn }) => {
  const specs = specUsedBy(specsIn);
  const mapPlans = new Map();
  plans.forEach((plan) => mapPlans.set(plan.resource.name, plan));
  return plans
    .map((plan) => findUsedBy({ plan, specs, mapPlans }))
    .filter((x) => x);
};

exports.PlanReorder = PlanReorder;
