import { useCallback, useState, type ChangeEvent } from 'react';

import { toKG } from '@lbb/util-convert';

export const App = () => {
  const [lbs, setLbs] = useState<string>(``);

  const onChangeLbs = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const { value: lbsNext } = target;

    setLbs(lbsNext);
  }, []);

  return (
    <div>
      <div>
        <input value={lbs} onChange={onChangeLbs} />
      </div>
      <div>{toKG(parseFloat(lbs))}kg</div>
    </div>
  );
};
