export const chartDefaults = {
    column: {
        width: 760,
        height: 360,
        margin: { top: 20, right: 30, bottom: 60, left: 80 }
    },
    line: {
        width: 760,
        height: 360
    },
    pie: {
        width: 540,
        height: 420
    }
};
export const selectLocaleContent = (content, locale) => content[locale];
export function formatDemographicData(ageGroups, options = { valuesInThousands: true }) {
    const multiplier = options.valuesInThousands === false ? 1 : 1000;
    const totalMale = ageGroups.reduce((sum, group) => sum + group.male, 0) * multiplier;
    const totalFemale = ageGroups.reduce((sum, group) => sum + group.female, 0) * multiplier;
    const totalPopulation = totalMale + totalFemale;
    const maleShare = totalPopulation ? totalMale / totalPopulation : 0;
    const femaleShare = totalPopulation ? totalFemale / totalPopulation : 0;
    return {
        totalPopulation,
        totalMale,
        totalFemale,
        maleShare,
        femaleShare
    };
}
export function calculatePopulationChange(data, baseYear, targetYear) {
    var _a;
    const basePoint = (_a = data.find((point) => point.year === baseYear)) !== null && _a !== void 0 ? _a : data[data.length - 2];
    const targetPoint = targetYear
        ? data.find((point) => point.year === targetYear)
        : data[data.length - 1];
    if (!basePoint || !targetPoint) {
        throw new Error('Unable to calculate population change with provided years.');
    }
    const absoluteChange = targetPoint.total - basePoint.total;
    const percentChange = basePoint.total
        ? (absoluteChange / basePoint.total) * 100
        : 0;
    return {
        baseYear: basePoint.year,
        baseValue: basePoint.total,
        targetYear: targetPoint.year,
        targetValue: targetPoint.total,
        absoluteChange,
        percentChange
    };
}
