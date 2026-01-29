import { aiLessonContent, getAILessonContent } from "./aiLessonContent";
import { aiLessonContentPart2, getAILessonContentPart2 } from "./aiLessonContentPart2";
import { aiLessonContentPart3, getAILessonContentPart3 } from "./aiLessonContentPart3";

// Combine all AI lesson content
export const allAILessonContent = {
  ...aiLessonContent,
  ...aiLessonContentPart2,
  ...aiLessonContentPart3,
};

export function getInteractiveLesson(lessonId: string) {
  return allAILessonContent[lessonId];
}
