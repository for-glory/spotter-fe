export interface OnboardingStep {
  attachTo: {
    element: string;
  };
  content: {
    title: string;
    description?: string;
  };
}
