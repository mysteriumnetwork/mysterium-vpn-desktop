import {ActionType} from "redux-promise-middleware";

export const pending = (action: string): string => `${action}_${ActionType.Pending}`
export const fulfilled = (action: string): string => `${action}_${ActionType.Fulfilled}`
export const rejected = (action: string): string => `${action}_${ActionType.Rejected}`
