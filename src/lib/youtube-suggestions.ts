import seedData from "@/data/knowledge-seed.json";

export interface YoutubeSuggestion {
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

function toYoutubeSearch(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
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

export function suggestYoutubeVideos(question: string, sources: string[] = []): YoutubeSuggestion[] {
  const combined = normalize(`${question} ${sources.join(" ")}`);

  const ranked = scenarios
    .map((scenario) => ({ scenario, score: scoreScenario(scenario, combined) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const suggestions: YoutubeSuggestion[] = [
    {
      title: "جست‌وجوی ویدیوی آموزشی برای همین سؤال",
      url: toYoutubeSearch(`${question} آموزش کسب و کار خانگی`),
      reason: "بر اساس متن همین پیام شما",
    },
  ];

  for (const item of ranked) {
    suggestions.push({
      title: `${item.scenario.name} — ${item.scenario.title}`,
      url: toYoutubeSearch(`${item.scenario.name} ${item.scenario.title} آموزش`),
      reason: "پیشنهاد مرتبط با موضوع و منبع‌های پیدا شده",
    });
  }

  const deduped: YoutubeSuggestion[] = [];
  for (const suggestion of suggestions) {
    if (!deduped.some((item) => item.url === suggestion.url || item.title === suggestion.title)) {
      deduped.push(suggestion);
    }
  }

  return deduped.slice(0, 3);
}
