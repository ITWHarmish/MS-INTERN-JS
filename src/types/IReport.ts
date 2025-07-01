export interface IColumnsReports {
  key?: string;
  _id?: string;
  tasks?: Task[];
  status?: string;
  assignedDate?: string;
  expectedCompletionDate?: string;
  actualCompletionDate?: string;
  taskDescription?: string;
  internsDetails?: {
    joiningDate: string;
    duration: number;
  };
}

export interface IProgressReport {
  _id?: string;
  userId?: string;
  studentName?: string;
  companyName?: string;
  enrollmentNo?: string;
  projectTitle?: string;
  course?: string;
  division?: string;
  mentorFullName?: string;
  mentorId?: string;
  reportId?: string;
  status?: string;
  duration?: {
    from: string;
    to: string;
  };
  tasks?: Task[];
  selfEvaluation?: SelfEvaluation;
  externalGuideRemarks?: string[];
}
export interface Task {
  _id?: string;
  taskDescription: string;
  assignedDate: string;
  dateRange: string;
  expectedCompletionDate: string;
  actualCompletionDate: string;
}

export interface SelfEvaluation {
  regularity: number;
  punctuality: string;
  discipline: string;
  learningAbility: string;
  implementationAbility: string;
}
