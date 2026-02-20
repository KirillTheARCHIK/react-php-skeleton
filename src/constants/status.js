const PROGRESS_STATUS = "in_progress";
const READY_STATUS = "ready";
const ERROR_STATUS = "error";

export const STATUS_SECRYPTION_STAGE = {
  [READY_STATUS]: {
    id: READY_STATUS,
    label: "Готово",
    color: "success",
  },
  [PROGRESS_STATUS]: {
    id: PROGRESS_STATUS,
    label: "В процессе",
    color: "warning",
  },
  [ERROR_STATUS]: {
    id: ERROR_STATUS,
    label: "Ошибка",
    color: "error",
  },
};

export const UNDER_CONSIDERATION = "0";
export const AGREED = "1";
export const REJECTED = "2";

export const CREATED_SLUG = "created";
export const APPROVED_SLUG = "approved";
export const CANCELED_SLUG = "canceled";
export const REJECTED_SLUG = "rejected";
export const APPLICATIONS_CREATED_SLUG = "applications_created";
export const NO_SOLUTION_SLUG = "no_solution";
export const WAITING_APPROVE = "waiting_approve";
export const WAITING_DISTRIBUTION_PAIRS_SLUG = "waiting_distribution_pairs";
export const WAITING_CONFIRMATIONS_PAIRS = "waiting_confirmations_pairs";
export const PARTIALLY_EXECUTED_SLUG = "partially_executed";

export const BLOCKED_SLUG = "blocked";
export const DISTRIBUTED_SLUG = "distributed";
export const STARTED_SLUG = "started";

export const UNSATISFIED_SLUG = "unsatisfied";
