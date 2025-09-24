import { useEffect, useState } from 'react';
import { get as getApiDefinition } from '../../api/apiDefinition';

const ApiDefinition = () => {
  const [jsonObject, setJsonObject] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getApiDefinition()
      .then((res) => {
        try {
          const obj = typeof res === 'string' ? JSON.parse(res) : res;
          setJsonObject(obj);
        } catch {
          setError('Failed to parse JSON');
        }
      })
      .catch(() => setError('Failed to fetch API definition'));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>API Definition</h2>
      {error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : jsonObject ? (
        <pre
          style={{
            background: '#f4f4f4',
            padding: 16,
            borderRadius: 8,
            overflowX: 'auto',
          }}
        >
          {JSON.stringify(jsonObject, null, 2)}
        </pre>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ApiDefinition;
