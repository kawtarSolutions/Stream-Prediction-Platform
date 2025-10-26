// API Service for Flask Backend Communication

const API_BASE_URL = '/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  let data;

  try {
    data = await response.json();
  } catch (e) {
    console.error('API: Failed to parse JSON response');
    throw new Error('Invalid response from server');
  }

  console.log('API: Response data:', data);

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Server error: ${response.status}`;
    console.error('API: Error response:', errorMsg);
    throw new Error(errorMsg);
  }

  return data;
};

// ==================== STUDENT API ====================

/**
 * Create a new student
 * @param {Object} studentData - { first_name, last_name, email, code_apoge, avg_api }
 * @returns {Promise<Object>} Created student object with student_id
 */
export const createStudent = async (studentData) => {
  console.log('API: Creating student with data:', studentData);
  console.log('API: Sending POST to:', `${API_BASE_URL}/students`);

  const response = await fetch(`${API_BASE_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });

  console.log('API: Response status:', response.status);
  console.log('API: Response ok:', response.ok);

  return handleResponse(response);
};

/**
 * Get all students
 * @returns {Promise<Array>} Array of student objects
 */
export const getAllStudents = async () => {
  const response = await fetch(`${API_BASE_URL}/students`);
  return handleResponse(response);
};

/**
 * Get a single student by ID
 * @param {number} studentId
 * @returns {Promise<Object>} Student object
 */
export const getStudentById = async (studentId) => {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}`);
  return handleResponse(response);
};

/**
 * Update student information
 * @param {number} studentId
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated student object
 */
export const updateStudent = async (studentId, updates) => {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  return handleResponse(response);
};

/**
 * Delete a student
 * @param {number} studentId
 * @returns {Promise<Object>} Deleted student object
 */
export const deleteStudent = async (studentId) => {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
};

// ==================== STREAMS API ====================

/**
 * Get all available streams
 * @returns {Promise<Array>} Array of stream objects
 */
export const getAllStreams = async () => {
  const response = await fetch(`${API_BASE_URL}/streams`);
  return handleResponse(response);
};

/**
 * Get a single stream by ID
 * @param {number} streamId
 * @returns {Promise<Object>} Stream object
 */
export const getStreamById = async (streamId) => {
  const response = await fetch(`${API_BASE_URL}/streams/${streamId}`);
  return handleResponse(response);
};

/**
 * Get stream capacity information
 * @param {number} streamId
 * @returns {Promise<Object>} Capacity information
 */
export const getStreamCapacity = async (streamId) => {
  const response = await fetch(`${API_BASE_URL}/streams/${streamId}/capacity`);
  return handleResponse(response);
};

// ==================== PREFERENCES API ====================

/**
 * Create student preferences
 * @param {number} studentId
 * @param {Array<string>} preferencesList - Array of stream names in order
 * @returns {Promise<Object>} Success message
 */
export const createPreferences = async (studentId, preferencesList) => {
  console.log('API: Creating preferences for student:', studentId);
  console.log('API: Preferences list:', preferencesList);
  console.log('API: Sending POST to:', `${API_BASE_URL}/preferences`);

  const response = await fetch(`${API_BASE_URL}/preferences`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      student_id: studentId,
      preferences_list: preferencesList,
    }),
  });

  console.log('API: Preferences response status:', response.status);
  console.log('API: Preferences response ok:', response.ok);

  return handleResponse(response);
};

/**
 * Get student preferences
 * @param {number} studentId
 * @returns {Promise<Object>} Preferences object with formatted list
 */
export const getStudentPreferences = async (studentId) => {
  const response = await fetch(`${API_BASE_URL}/preferences/${studentId}`);
  return handleResponse(response);
};

/**
 * Update student preferences
 * @param {number} studentId
 * @param {Array<string>} preferencesList - New array of stream names in order
 * @returns {Promise<Object>} Success message
 */
export const updatePreferences = async (studentId, preferencesList) => {
  const response = await fetch(`${API_BASE_URL}/preferences/${studentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      preferences_list: preferencesList,
    }),
  });

  return handleResponse(response);
};

/**
 * Calculate probability for a student
 * @param {number} studentId
 * @returns {Promise<Object>} Calculation result
 */
export const calculateProbability = async (studentId) => {
  console.log('API: Calculating probability for student:', studentId);
  console.log('API: Sending POST to:', `${API_BASE_URL}/preferences/calculate/${studentId}`);

  const response = await fetch(`${API_BASE_URL}/preferences/calculate/${studentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('API: Calculate probability response status:', response.status);
  console.log('API: Calculate probability response ok:', response.ok);

  return handleResponse(response);
};

/**
 * Get probability for a student
 * @param {number} studentId
 * @returns {Promise<Object>} Probability result
 */
export const getProbability = async (studentId) => {
  const response = await fetch(`${API_BASE_URL}/preferences/probability/${studentId}`);
  return handleResponse(response);
};

// ==================== HEALTH CHECK ====================

/**
 * Check if backend server is running
 * @returns {Promise<Object>} Health status
 */
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
};

export default {
  // Students
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,

  // Streams
  getAllStreams,
  getStreamById,
  getStreamCapacity,

  // Preferences
  createPreferences,
  getStudentPreferences,
  updatePreferences,
  calculateProbability,
  getProbability,

  // Health
  healthCheck,
};
