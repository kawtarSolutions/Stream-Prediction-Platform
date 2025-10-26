import React, { useState } from 'react';
import { GripVertical, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createStudent, createPreferences, calculateProbability } from './services/api';

function MultiStepApplication() { 
  // State management
  const [step, setStep] = useState(1);

  const [studentInfo, setStudentInfo] = useState({
    first_name: '',
    last_name: '',
    studentCode: '',
    average_grade: '',
  });

  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    studentCode: '',
    average_grade: ''
  });

  const [streams, setStreams] = useState([
    { id: 1, name: 'Electrical Engineering and Digital Industries' },
    { id: 2, name: 'Biomedical Engineering' },
    { id: 3, name: 'Materials Engineering and Quality' },
    { id: 4, name: 'Mechanical Engineering' },
    { id: 5, name: 'Automotive and Aeronautical Engineering' },
    { id: 6, name: 'Digital Engineering in Data Science, AI & Digital Health' },
    { id: 7, name: 'Energy Systems and Environmental Engineering' },
  ]);

  const [draggedItem, setDraggedItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    // Validate first and last name - only letters
    if (name === 'first_name' || name === 'last_name') {
      if (value && !/^[A-Za-z\s]*$/.test(value)) {
        newErrors[name] = 'Only letters are allowed';
        return; // Don't update state if invalid
      } else {
        newErrors[name] = '';
      }
    }

    // Validate student code - exactly 8 digits
    if (name === 'studentCode') {
      if (value && !/^\d{0,8}$/.test(value)) {
        return; // Don't allow more than 8 digits
      }
      if (value && value.length > 0 && value.length !== 8) {
        newErrors[name] = 'Student code must be exactly 8 digits';
      } else {
        newErrors[name] = '';
      }
    }

    // Validate average grade - float between 1 and 20
    if (name === 'average_grade') {
      const numValue = parseFloat(value);
      if (value && (numValue < 1 || numValue > 20)) {
        newErrors[name] = 'Grade must be between 1 and 20';
      } else {
        newErrors[name] = '';
      }
    }

    setErrors(newErrors);
    setStudentInfo({ ...studentInfo, [name]: value });
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newStreams = [...streams];
    const draggedStream = newStreams[draggedItem];
    newStreams.splice(draggedItem, 1);
    newStreams.splice(index, 0, draggedStream);
    
    setStreams(newStreams);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newStreams = [...streams];
    [newStreams[index - 1], newStreams[index]] = [newStreams[index], newStreams[index - 1]];
    setStreams(newStreams);
  };

  const moveDown = (index) => {
    if (index === streams.length - 1) return;
    const newStreams = [...streams];
    [newStreams[index], newStreams[index + 1]] = [newStreams[index + 1], newStreams[index]];
    setStreams(newStreams);
  };

  const isStep1Valid = () => {
    const { first_name, last_name, studentCode, average_grade } = studentInfo;
    
    // Check all fields are filled
    if (!first_name || !last_name || !studentCode || !average_grade) {
      return false;
    }

    // Check first and last name only contain letters
    if (!/^[A-Za-z\s]+$/.test(first_name) || !/^[A-Za-z\s]+$/.test(last_name)) {
      return false;
    }

    // Check student code is exactly 8 digits
    if (!/^\d{8}$/.test(studentCode)) {
      return false;
    }

    // Check average grade is between 1 and 20
    const grade = parseFloat(average_grade);
    if (isNaN(grade) || grade < 1 || grade > 20) {
      return false;
    }

    return true;
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Step 1: Create student record
      console.log('=== STEP 1: Creating Student ===');
      const fullName = `${studentInfo.first_name} ${studentInfo.last_name}`;
      const studentData = {
        first_name: studentInfo.first_name,
        last_name: studentInfo.last_name,
        email: `${studentInfo.studentCode}@student.university.edu`,
        code_apoge: studentInfo.studentCode,
        avg_api: parseFloat(studentInfo.average_grade)
      };

      console.log('Student data:', studentData);
      const createdStudent = await createStudent(studentData);
      console.log('✅ Student created successfully:', createdStudent);

      const studentId = createdStudent.student_id;
      console.log('Student ID:', studentId);

      // Step 2: Create preferences (array of stream names in order)
      console.log('=== STEP 2: Creating Preferences ===');
      const preferencesList = streams.map(stream => stream.name);
      console.log('Preferences list:', preferencesList);

      await createPreferences(studentId, preferencesList);
      console.log('✅ Preferences created successfully');

      // Step 3: Calculate probability (if backend function exists)
      console.log('=== STEP 3: Calculating Probability ===');
      try {
        await calculateProbability(studentId);
        console.log('✅ Probability calculated successfully');
      } catch (error) {
        console.warn('⚠️ Probability calculation not available:', error.message);
        // Continue anyway - probability might not be implemented yet
      }

      // Step 4: Navigate to results page with student ID
      console.log('=== STEP 4: Navigating to Results ===');
      console.log('Navigating with studentId:', studentId, 'studentName:', fullName);
      navigate('/probability', {
        state: {
          studentId,
          studentName: fullName
        }
      });
      console.log('✅ Navigation complete');

    } catch (error) {
      console.error('Submission error:', error);
      console.error('Error details:', error.message);

      // Display user-friendly error message
      let errorMessage = '';

      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
        errorMessage = 'This student code is already registered. Please use a different student code.';
      } else if (error.message.includes('Stream') && error.message.includes('not found')) {
        errorMessage = 'There was an issue with the stream selection. Please contact the administrator.';
      } else if (error.message.includes('Preferences already exist')) {
        errorMessage = 'You have already submitted your preferences. Please contact support if you need to make changes.';
      } else if (error.message.includes('Invalid') || error.message.includes('validation')) {
        errorMessage = 'Please check that all fields are filled in correctly.';
      } else if (error.message.includes('not found') || error.message.includes('404')) {
        errorMessage = 'The requested service is unavailable. Please try again later.';
      } else if (error.message.includes('500') || error.message.includes('Server error')) {
        errorMessage = 'The server encountered an error. Please try again in a few moments.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'The request took too long. Please check your connection and try again.';
      } else {
        // Generic fallback - keep it simple
        errorMessage = 'Unable to submit your application. Please try again or contact support if the problem continues.';
      }

      setSubmitError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="app-container">
        <div className="content-wrapper">
          {/* Form Card */}
          <div className="form-card">
            {/* Step 1: Student Information */}
            {step === 1 && (
              <div>
                <h1 className="form-title">Student Information</h1>
                <p className="form-subtitle">Please provide your basic information</p>

                <div className="form-fields">
                  <div className="form-field">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={studentInfo.first_name}
                      onChange={handleInfoChange}
                      placeholder="Enter your first name"
                      className="form-input"
                    />
                    {errors.first_name && (
                      <span className="error-message">{errors.first_name}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={studentInfo.last_name}
                      onChange={handleInfoChange}
                      placeholder="Enter your last name"
                      className="form-input"
                    />
                    {errors.last_name && (
                      <span className="error-message">{errors.last_name}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">Student Code</label>
                    <input
                      type="text"
                      name="studentCode"
                      value={studentInfo.studentCode}
                      onChange={handleInfoChange}
                      placeholder="Enter your 8-digit student code"
                      className="form-input"
                      maxLength="8"
                    />
                    {errors.studentCode && (
                      <span className="error-message">{errors.studentCode}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">Average Grade</label>
                    <input
                      type="number"
                      name="average_grade"
                      value={studentInfo.average_grade}
                      onChange={handleInfoChange}
                      placeholder="Enter your average grade (1-20)"
                      className="form-input"
                      step="0.01"
                      min="1"
                      max="20"
                    />
                    {errors.average_grade && (
                      <span className="error-message">{errors.average_grade}</span>
                    )}
                  </div>
                </div>

                <div className="button-container welcomeButton">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid()}
                  >
                    Next: Preferences
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Stream Preferences */}
            {step === 2 && (
              <div className='preferences'>
                <h1 className="form-title">Rank Your Stream Preferences</h1>
                <p className="form-subtitle">
                  Drag and drop to arrange streams from most preferred (1) to least preferred (7)
                </p>

                <div className="streams-list">
                  {streams.map((stream, index) => (
                    <div
                      key={stream.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`stream-item ${draggedItem === index ? 'dragging' : ''}`}
                    >
                      <GripVertical className="grip-icon" size={20} />
                      
                      <div className="rank-badge">{index + 1}</div>
                      
                      <div className="stream-name">{stream.name}</div>

                    </div>
                  ))}
                </div>

                {submitError && (
                  <div className="error-message" style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fee', borderRadius: '4px', color: '#c00' }}>
                    {submitError}
                  </div>
                )}

                <div className="button-container space-between welcomeButton">
                  <button onClick={() => setStep(1)} disabled={isSubmitting}>
                    <ArrowLeft size={20} />
                    Back
                  </button>
                  <button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MultiStepApplication;