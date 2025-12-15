import { GOOGLE_SCRIPT_URL } from "../constants";
import { EvaluationData, ScoreSummary } from "../types";

export const submitEvaluation = async (
  data: EvaluationData,
  score: ScoreSummary
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // 1. Prepare Payload
    const payload = {
      ...data.info,
      part1Score: score.part1Weighted.toFixed(2),
      part2Score: score.part2Weighted.toFixed(2),
      totalScore: score.totalScore.toFixed(2),
      level: score.level,
      timestamp: new Date().toISOString(),
      details: JSON.stringify({
        part1: data.part1.map(i => ({ id: i.id, score: i.score })),
        part2: data.part2.map(s => ({ 
            id: s.id, 
            score: s.items.reduce((acc, curr) => acc + curr.score, 0) 
        }))
      })
    };

    // 2. Generate JSONP Callback Name
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());

    // 3. Construct URL Params (Include callback here for safety)
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
      params.append(key, String(value));
    });
    params.append('callback', callbackName);

    // 4. Create Script URL
    const scriptUrl = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;

    // 5. Setup Global Callback
    (window as any)[callbackName] = (response: any) => {
      cleanup();
      if (response && response.status === 'success') {
        resolve(true);
      } else {
        reject(new Error(response?.message || 'Submission failed'));
      }
    };

    // 6. Inject Script
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.id = callbackName; // Tag ID for cleanup

    // Cleanup function
    const cleanup = () => {
      delete (window as any)[callbackName];
      const existingScript = document.getElementById(callbackName);
      if (existingScript) {
        existingScript.remove();
      }
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('Network error: Failed to connect to Google Script.'));
    };

    document.body.appendChild(script);

    // 7. Timeout Fallback (30 seconds)
    setTimeout(() => {
        if ((window as any)[callbackName]) {
            cleanup();
            reject(new Error('Request timed out. Please check your internet connection.'));
        }
    }, 30000);
  });
};