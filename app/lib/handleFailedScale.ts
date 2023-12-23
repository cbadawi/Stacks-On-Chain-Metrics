import { Scales } from '../components/helpers';

export default (
  xScaleCallback: Scales | undefined,
  data: any[],
  returnValue?: any
) => {
  const undefinedCallbackName = xScaleCallback
    ? 'yScaleCallback'
    : 'xScaleCallback';
  console.info(
    `Did not find callback ${undefinedCallbackName} with data ${JSON.stringify(
      data[0]
    )}`,
    console.trace()
  );

  return returnValue;
};
