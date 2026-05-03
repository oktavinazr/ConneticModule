import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

function App() {
  useEffect(() => {
    const legacyKeys = [
      'connetic_local_users',
      'admin-group-names',
      'connetic_global_test_progress',
      'connetic_lesson_progress',
      'student-groups',
    ];

    for (const key of legacyKeys) {
      window.localStorage.removeItem(key);
    }

    const dynamicLegacyPrefixes = [
      'assessment_save_',
      'group_discussions_local',
    ];

    for (let i = window.localStorage.length - 1; i >= 0; i -= 1) {
      const key = window.localStorage.key(i);
      if (!key) continue;
      if (dynamicLegacyPrefixes.some((prefix) => key.startsWith(prefix))) {
        window.localStorage.removeItem(key);
      }
    }
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
