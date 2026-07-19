import { expect, test } from 'bun:test';

import { UNITS } from '../units';

import { addDuration } from '.';
import { type DurationString } from '.';

test(`addDuration(durationString)`, () => {
  UNITS.forEach((unit) => {
    const durationString: DurationString = `10${unit}`;
    const durationResult = addDuration(durationString);

    const { success } = durationResult;
    if (success === false) {
      const { error } = durationResult;
      console.error(error);
      expect(success).toBeTrue();
      return;
    }

    const { date } = durationResult;
    expect(date).toBeDate();
  });
});
