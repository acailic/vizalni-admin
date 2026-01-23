import climateStoryConfig from "./climate-story";
import { demographicsStory } from "./demographics-story";
import { economyStory } from "./economy-story";
import { healthcareStory } from "./healthcare-story";

export { demographicsStory } from "./demographics-story";
export { economyStory } from "./economy-story";
export { default as climateStory } from "./climate-story";
export { healthcareStory } from "./healthcare-story";

export const ALL_STORIES = [
  demographicsStory,
  economyStory,
  climateStoryConfig,
  healthcareStory,
] as const;
