import { t } from '@lingui/macro';

export const TestComponent = () => {
  const message = t`Hello World`;

  return (
    <div>
      <p>{message}</p>
    </div>
  );
};
