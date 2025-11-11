import {
  addYears,
  addQuarters,
  addMonths,
  addWeeks,
  addDays,
  addBusinessDays,
  addHours,
  addMinutes,
  addSeconds,
  addMilliseconds,
} from 'date-fns';

import {
  UNIT_YEARS,
  UNIT_QUARTERS,
  UNIT_MONTHS,
  UNIT_WEEKS,
  UNIT_DAYS,
  UNIT_BUSINESS_DAYS,
  UNIT_HOURS,
  UNIT_MINUTES,
  UNIT_SECONDS,
  UNIT_MILLISECONDS,
  type Unit,
} from '../units';

import { DURATION_STRING_REGEXP } from './constants';
import { type DurationString } from './types';

const getDurationValueAndUnit = (durationString: DurationString) => {
  const regExpExecArray = DURATION_STRING_REGEXP.exec(durationString);

  if (regExpExecArray === null) {
    const result = {
      success: false as const,
      error: new Error(`Failed to match regexp exec ${DURATION_STRING_REGEXP}`),
    };

    return result;
  }

  const [, valueString, unit] = regExpExecArray;

  if (valueString === undefined) {
    const result = {
      success: false as const,
      error: new Error(`value not matched, got: ${valueString}`),
    };

    return result;
  }

  if (unit === undefined) {
    const result = {
      success: false as const,
      error: new Error(`unit not matched, got: ${valueString}`),
    };

    return result;
  }

  const value = parseInt(valueString, 10);

  if (isNaN(value)) {
    const result = {
      success: false as const,
      error: new Error(
        `parseInt returned NaN, from valueString: ${valueString}`,
      ),
    };

    return result;
  }

  const durationValueAndUnit = {
    success: true as const,
    value,
    unit: unit as Unit,
  };

  return durationValueAndUnit;
};

type OptionsAddDuration = {
  readonly fromDate?: Date;
};
const OPTIONS_DEFAULT = {};
export const addDuration = (
  durationString: DurationString,
  options: OptionsAddDuration = OPTIONS_DEFAULT,
) => {
  const { fromDate = new Date() } = options;

  const durationValueAndUnitResult = getDurationValueAndUnit(durationString);

  const { success } = durationValueAndUnitResult;
  if (success === false) {
    const { error } = durationValueAndUnitResult;
    const result = {
      success: false as const,
      error,
    };
    return result;
  }

  const { value, unit } = durationValueAndUnitResult;

  switch (unit) {
    case UNIT_YEARS: {
      const yearsResult = {
        success: true as const,
        date: addYears(fromDate, value),
      };
      return yearsResult;
    }

    case UNIT_QUARTERS: {
      const quartersResult = {
        success: true as const,
        date: addQuarters(fromDate, value),
      };
      return quartersResult;
    }

    case UNIT_MONTHS: {
      const monthsResult = {
        success: true as const,
        date: addMonths(fromDate, value),
      };
      return monthsResult;
    }

    case UNIT_WEEKS: {
      const weeksResult = {
        success: true as const,
        date: addWeeks(fromDate, value),
      };
      return weeksResult;
    }

    case UNIT_DAYS: {
      const daysResult = {
        success: true as const,
        date: addDays(fromDate, value),
      };
      return daysResult;
    }

    case UNIT_BUSINESS_DAYS: {
      const businessDaysResult = {
        success: true as const,
        date: addBusinessDays(fromDate, value),
      };
      return businessDaysResult;
    }

    case UNIT_HOURS: {
      const hoursResult = {
        success: true as const,
        date: addHours(fromDate, value),
      };
      return hoursResult;
    }

    case UNIT_MINUTES: {
      const minutesResult = {
        success: true as const,
        date: addMinutes(fromDate, value),
      };
      return minutesResult;
    }

    case UNIT_SECONDS: {
      const secondsResult = {
        success: true as const,
        date: addSeconds(fromDate, value),
      };
      return secondsResult;
    }

    case UNIT_MILLISECONDS: {
      const millisecondsResult = {
        success: true as const,
        date: addMilliseconds(fromDate, value),
      };
      return millisecondsResult;
    }

    default: {
      const unhandledUnitResult = {
        success: false as const,
        error: new Error(`Unhandled unit: ${unit} for value: ${value}`),
      };

      return unhandledUnitResult;
    }
  }
};
