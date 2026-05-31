import type { SymptomQuestion } from "@/api/symptom/types";

export type QuestionNode = SymptomQuestion & {
  children: QuestionNode[];
};

export function buildQuestionTree(
  questions: SymptomQuestion[],
  answerQuestionMap: Map<string, SymptomQuestion>,
): QuestionNode[] {
  const nodes = new Map<string, QuestionNode>();
  questions.forEach((q) => nodes.set(q.id, { ...q, children: [] }));

  const roots: QuestionNode[] = [];

  for (const question of questions) {
    const node = nodes.get(question.id)!;

    if (!question.parentAnswerId) {
      roots.push(node);
      continue;
    }

    const parentQuestion = answerQuestionMap.get(question.parentAnswerId);
    if (!parentQuestion) {
      roots.push(node);
      continue;
    }

    const parentNode = nodes.get(parentQuestion.id);
    if (!parentNode) {
      roots.push(node);
      continue;
    }

    parentNode.children.push(node);
  }

  return roots;
}
