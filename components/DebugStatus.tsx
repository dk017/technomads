const DebugState = ({ state }: { state: any }) => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <div className="fixed bottom-0 right-0 bg-black/80 text-white p-4 m-4 rounded-lg text-xs">
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
    );
  };
  
  // Add to JobsPage:
  <DebugState state={{
    auth: { user: !!user, authLoading: false },
    access: { isSubscribed, isTrialActive, showAllJobs },
    jobs: { count: jobs.length, isLoading: jobsLoading }
  }} />