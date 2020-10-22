import dayjs from 'dayjs/esm';
import isSameOrBefore from 'dayjs/esm/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/esm/plugin/isSameOrAfter';
import advancedFormat from 'dayjs/esm/plugin/advancedFormat';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat';
import weekday from 'dayjs/esm/plugin/weekday';
import weekYear from 'dayjs/esm/plugin/weekYear';
import weekOfYear from 'dayjs/esm/plugin/weekOfYear';
import localeData from 'dayjs/esm/plugin/localeData';
import localizedFormat from 'dayjs/esm/plugin/localizedFormat';
import isBetween from 'dayjs/esm/plugin/isBetween';
import utc from 'dayjs/esm/plugin/utc';
// import badMutable from 'dayjs/esm/plugin/badMutable';
import warning from './warning';
import isNil from 'lodash-es/isNil';
[
  isSameOrBefore,
  isSameOrAfter,
  advancedFormat,
  customParseFormat,
  weekday,
  weekYear,
  weekOfYear,
  localeData,
  localizedFormat,
  isBetween,
  utc,
  // badMutable,
].forEach(plugin => {
  dayjs.extend(plugin);
});

export const TimeType = {
  validator(value: any) {
    return typeof value === 'string' || isNil(value) || dayjs.isDayjs(value);
  },
};

export const TimesType = {
  validator(value: any) {
    if (Array.isArray(value)) {
      return (
        value.length === 0 ||
        value.findIndex(val => typeof val !== 'string') === -1 ||
        value.findIndex(val => !isNil(val) && !dayjs.isDayjs(val)) === -1
      );
    }
    return false;
  },
};

export const TimeOrTimesType = {
  validator(value: any) {
    if (Array.isArray(value)) {
      return (
        value.length === 0 ||
        value.findIndex(val => typeof val !== 'string') === -1 ||
        value.findIndex(val => !isNil(val) && !dayjs.isDayjs(val)) === -1
      );
    } else {
      return typeof value === 'string' || isNil(value) || dayjs.isDayjs(value);
    }
  },
};

export function checkValidate(
  componentName: string,
  value: any,
  propName: string,
  valueFormat: string,
) {
  const values = Array.isArray(value) ? value : [value];
  values.forEach(val => {
    if (!val) return;
    valueFormat &&
      warning(
        dayjs(val, valueFormat).isValid(),
        componentName,
        `When set \`valueFormat\`, \`${propName}\` should provides invalidate string time. `,
      );
    !valueFormat &&
      warning(
        dayjs.isDayjs(val) && val.isValid(),
        componentName,
        `\`${propName}\` provides invalidate dayjs time. If you want to set empty value, use \`null\` instead.`,
      );
  });
}
export const stringToDayjs = (value: any, valueFormat: string) => {
  if (Array.isArray(value)) {
    return value.map(val =>
      typeof val === 'string' && val ? dayjs(val, valueFormat) : val || null,
    );
  } else {
    return typeof value === 'string' && value ? dayjs(value, valueFormat) : value || null;
  }
};

export const dayjsToString = (value: any, valueFormat: string) => {
  if (Array.isArray(value)) {
    return value.map(val => (dayjs.isDayjs(val) ? val.format(valueFormat) : val));
  } else {
    return dayjs.isDayjs(value) ? value.format(valueFormat) : value;
  }
};

export default dayjs;
