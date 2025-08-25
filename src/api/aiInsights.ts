import apiClient from "./apiClient";

export type AiInsightsPayload = {
  reportText: string;
  trend: unknown;
  pattern: unknown;
  comparison: unknown;
};

export async function generateAnalyticsInsights(
  userId: number,
  payload: AiInsightsPayload
): Promise<{ text: string }> {
  const res = await apiClient.post(
    `/analytics/users/${userId}/ai-insights`,
    payload
  );
  return res.data;
}
