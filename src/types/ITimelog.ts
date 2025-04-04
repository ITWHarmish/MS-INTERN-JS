export interface TimeLog {
  _id?: string
  startTime?: string;
  endTime?: string;
  category?: string;
  description?: string;
  hours?: string;
  date?:Date;
}

export interface IDate {
  date?: string;
  userId?: string;
}

export interface IColumns {
  key?: string;
  startTime?: string;
  endTime?: string;
  category?: string;
  description?: string;
  _id?: string;
}

export interface ISetRowProps {
  label: string;
  value: string;
  textStyle?: React.CSSProperties;
  key?: string | number;
}
