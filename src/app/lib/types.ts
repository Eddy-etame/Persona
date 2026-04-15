export interface Persona {
  name: string; age: string; role: string; type: string; photo: string;
  occupation: string; studyLevel: string; program: string; yearOfStudy: string;
  bio: string; personality: string;
  maritalStatus: string; children: string; nationality: string; languages: string;
  hobbies: string; sports: string; musicTaste: string; readingHabits: string;
  socialStyle: string; values: string; fears: string; deepMotivations: string;
  stressLevel: string; stressManagement: string; sleepSchedule: string;
  diet: string; healthConsiderations: string; volunteerWork: string;
  travelHistory: string; roleModel: string; lifePhilosophy: string;
  weekendActivities: string; personalSocialMedia: string; monthlyBudget: string;
  dreamVacation: string; petOrNot: string; politicalEngagement: string;
  religiousViews: string; currentReads: string; favoriteSeries: string;
  introExtrovert: string; morningOrNight: string; bigLifeEvent: string;
  campus: string; neighborhood: string; housing: string; transportation: string;
  arriveTime: string; departTime: string; workSchedule: string; favoriteSpots: string;
  studentId: string; enrollmentDate: string; scholarshipStatus: string; partTimeJob: string;
  whyKeyce: string; previousSchool: string; parentsProfession: string; siblings: string;
  dreamJob: string; internshipExperience: string; relationWithTeachers: string;
  bestSubject: string; worstSubject: string; yearGoal: string; afterSchoolPlan: string;
  financialAid: string; dailyBudget: string; learningStyle: string; studyHabits: string;
  extracurricular: string; careerGoals: string; academicStrengths: string; academicWeaknesses: string;
  groupOrSolo: string; examStress: string; repeatYear: string;
  position: string; department: string; yearsAtKeyce: string; contractType: string;
  teachingHours: string; subjectsTaught: string; teachingStyle: string; classSize: string;
  assessmentMethods: string; previousCareer: string; whyTeaching: string;
  teachingPhilosophy: string; proudestAchievement: string; biggestChallenge: string;
  mentors: string; workLifeBalance: string; hopeForStudents: string;
  careerPlans: string; jobSatisfaction: string; prepTime: string;
  teachingAtOtherSchools: string; continuingEducation: string; unionMembership: string;
  relationWithStudents: string; relationWithAdmin: string; salaryRange: string;
  responsibleFor: string; teamSize: string; keyProcesses: string;
  managementStyle: string; decisionAuthority: string; careerPath: string;
  teamRelations: string; remoteWork: string; emailsPerDay: string;
  meetingsPerWeek: string; reportTo: string; externalRelations: string;
  biggestChallengeAdmin: string; proudestAchievementAdmin: string;
  workLifeBalanceAdmin: string; regulatoryPressure: string; conflictManagement: string;
  adminSatisfaction: string;
  primarySystemNeeds: string; frequentTasks: string; timeSpentOnSystem: string; systemUsage: string;
  techSavvy: string; digitalTools: string; devices: string; apps: string;
  privacyConcerns: string; techFrustrations: string; learnNewTechHow: string;
  goals: string; frustrations: string; needs: string; quote: string;
  idealFeature: string; dealBreaker: string; onboardingExpectation: string;
}

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  emotion: number;
  touchpoint?: string;
  opportunity?: string;
}
