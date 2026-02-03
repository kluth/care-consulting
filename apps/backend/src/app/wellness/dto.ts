export class CreateCheckInDto {
  mood: number;
  stress: number;
  note?: string;
}

export class CreateAssessmentDto {
  score: number;
  answers: Record<string, any>;
}
