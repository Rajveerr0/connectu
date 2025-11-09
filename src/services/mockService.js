// Mock service for development
const simulateDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApplicationsAPI = {
  applyForJob: async (data) => {
    await simulateDelay(1500);
    console.log('Mock: Applying for job', data);
    return { 
      data: { 
        success: true, 
        application_id: Date.now(),
        message: 'Job application submitted successfully' 
      } 
    };
  },

  bookMentorshipSession: async (data) => {
    await simulateDelay(1500);
    console.log('Mock: Booking mentorship session', data);
    return { 
      data: { 
        success: true, 
        session_id: Date.now(),
        message: 'Mentorship session requested successfully' 
      } 
    };
  },

  requestCollaboration: async (data) => {
    await simulateDelay(1500);
    console.log('Mock: Requesting collaboration', data);
    return { 
      data: { 
        success: true, 
        collaboration_id: Date.now(),
        message: 'Collaboration request sent successfully' 
      } 
    };
  },

  saveJob: async (jobId) => {
    await simulateDelay(500);
    console.log('Mock: Saving job', jobId);
    return { data: { success: true } };
  },
};

// Check if we're in development mode
export const isDevelopment = process.env.NODE_ENV === 'development';