import seedData from "@/data/knowledge-seed.json";

export type LearningProvider = "youtube" | "aparat" | "faradars";

export interface LearningResource {
  provider: LearningProvider;
  title: string;
  url: string;
  reason: string;
}

type Scenario = {
  name: string;
  title: string;
  hook: string;
};

const scenarios = seedData.videoScenarios as Scenario[];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[‌‍]/g, " ")
    .replace(/[^a-z0-9\u0600-\u06FF\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueTokens(text: string): string[] {
  return [...new Set(normalize(text).split(" ").filter((token) => token.length >= 3))];
}

function scoreScenario(scenario: Scenario, haystack: string): number {
  const joined = `${scenario.name} ${scenario.title} ${scenario.hook}`;
  const normalizedJoined = normalize(joined);
  let score = 0;

  if (haystack.includes(normalize(scenario.name))) score += 8;
  if (haystack.includes(normalize(scenario.title))) score += 6;
  if (haystack.includes(normalizedJoined)) score += 10;

  for (const token of uniqueTokens(joined)) {
    if (haystack.includes(token)) score += 1;
  }

  return score;
}

function toYoutubeSearch(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function toAparatSearch(query: string): string {
  return `https://www.aparat.com/search/${encodeURIComponent(query)}`;
}

function toFaradarsSearch(query: string): string {
  return `https://faradars.org/explore?query=${encodeURIComponent(query)}`;
}

function bestTopic(question: string, sources: string[] = []): string {
  const combined = normalize(`${question} ${sources.join(" ")}`);
  const best = scenarios
    .map((scenario) => ({ scenario, score: scoreScenario(scenario, combined) }))
    .sort((a, b) => b.score - a.score)[0];

  if (best && best.score > 0) {
    return best.scenario.name;
  }

  return question.trim();
}

export function buildEducationLinks(field: string, extraQuery = ""): LearningResource[] {
  const query = [...new Set(`${field} ${extraQuery}`.replace(/\s+/g, " ").trim().split(" ").filter(Boolean))].join(" ");
  return [
    {
      provider: "youtube",
      title: `یوتیوب — آموزش‌های بیشتر برای ${field}`,
      url: toYoutubeSearch(`${query} آموزش`),
      reason: "برای دیدن ویدیوهای بیشتر و مثال‌های تصویری",
    },
    {
      provider: "aparat",
      title: `آپارات — آموزش فارسی ${field}`,
      url: toAparatSearch(`${query} آموزش`),
      reason: "برای ویدیوهای فارسی و تجربه‌های بومی‌تر",
    },
    {
      provider: "faradars",
      title: `فرادرس — دوره‌ها و آموزش‌های مرتبط با ${field}`,
      url: toFaradarsSearch(`${query} آموزش`),
      reason: "برای آموزش‌های ساختاریافته‌تر و دوره‌ای",
    },
  ];
}

export function suggestLearningResources(question: string, sources: string[] = []): LearningResource[] {
  const topic = bestTopic(question, sources);
  return buildEducationLinks(topic, "کسب و کار خانگی تولید محتوا");
}
