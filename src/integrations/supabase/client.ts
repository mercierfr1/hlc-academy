// Mock Supabase client for development
export const supabase = {
  functions: {
    invoke: async (functionName: string, options?: any) => {
      console.log(`Mock Supabase function call: ${functionName}`, options);
      
      // Mock responses based on function name
      switch (functionName) {
        case 'check-subscription':
          return {
            data: {
              subscribed: false,
              trial_end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            error: null
          };
        case 'customer-portal':
          return {
            data: { url: 'https://billing.stripe.com/p/login/test_portal' },
            error: null
          };
        default:
          return { data: null, error: null };
      }
    }
  }
};
