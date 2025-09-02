import React, { useState } from 'react';
import Card from '../common/Card';

const PatientList = ({ patients = [] }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card title="Patient List">
      <div className="space-y-3">
        {patients.length > 0 ? patients.map((patient) => (
          <div 
            key={patient._id} 
            className="flex justify-between items-center p-4 bg-gradient-to-r from-white to-ayur-light/20 border border-ayur-accent/20 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedPatient(patient)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-ayur-primary rounded-full flex items-center justify-center">
                <span className="text-white text-lg">{patient.name?.charAt(0) || 'P'}</span>
              </div>
              <div>
                <p className="font-semibold text-ayur-primary">{patient.name}</p>
                <p className="text-sm text-gray-600">{patient.therapy || 'Ayurveda Treatment'}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(patient.status || 'active')}`}>
                {patient.status || 'Active'}
              </span>
              <p className="text-sm text-gray-600 mt-1">{patient.lastSession ? new Date(patient.lastSession).toLocaleDateString() : 'No sessions'}</p>
            </div>
          </div>
        )) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">👥</div>
            <p>No patients yet</p>
            <p className="text-sm">Patients will appear here after bookings</p>
          </div>
        )}
      </div>
      
      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-ayur-primary">Patient Details</h2>
              <button 
                onClick={() => setSelectedPatient(null)}
                className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 text-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Patient Info */}
              <div className="bg-gradient-to-r from-ayur-light to-white p-4 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-ayur-primary rounded-full flex items-center justify-center">
                    <span className="text-2xl text-white">{selectedPatient.name?.charAt(0) || 'P'}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ayur-primary">{selectedPatient.name}</h3>
                    <p className="text-sm text-gray-600">{selectedPatient.profile?.age || 'N/A'} years, {selectedPatient.profile?.gender || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <p><span className="font-medium">Phone:</span> {selectedPatient.phone || 'N/A'}</p>
                  <p><span className="font-medium">Email:</span> {selectedPatient.email || 'N/A'}</p>
                </div>
              </div>
              
              {/* Current Treatment */}
              <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl">
                <h4 className="font-bold text-ayur-primary mb-2 text-sm">Current Treatment</h4>
                <div className="space-y-1 text-xs">
                  <p><span className="font-medium">Therapy:</span> {selectedPatient.therapy || 'Ayurveda Treatment'}</p>
                  <p><span className="font-medium">Last Session:</span> {selectedPatient.lastSession ? new Date(selectedPatient.lastSession).toLocaleDateString() : 'No sessions yet'}</p>
                </div>
              </div>
              
              {/* Medical History */}
              <div className="bg-red-50 p-4 rounded-xl">
                <h4 className="font-bold text-ayur-primary mb-2 text-sm">Medical History</h4>
                <ul className="space-y-1 text-xs">
                  {selectedPatient.profile?.medicalHistory?.length > 0 ? selectedPatient.profile.medicalHistory.slice(0, 3).map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="text-red-500">•</span>
                      <span>{item}</span>
                    </li>
                  )) : (
                    <li className="text-gray-500">No medical history recorded</li>
                  )}
                </ul>
              </div>
              
              {/* Treatment History */}
              <div className="bg-green-50 p-4 rounded-xl">
                <h4 className="font-bold text-ayur-primary mb-2 text-sm">Recent Sessions</h4>
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium text-ayur-primary text-sm">{selectedPatient.therapy || 'Ayurveda Treatment'}</p>
                      <p className="text-xs text-gray-600">{selectedPatient.lastSession ? new Date(selectedPatient.lastSession).toLocaleDateString() : 'No date'}</p>
                    </div>
                    <p className="text-xs text-gray-700">Status: {selectedPatient.status || 'Active'}</p>
                  </div>
                </div>
              </div>
              
              {/* Vitals & Medications */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 p-3 rounded-xl">
                  <h4 className="font-bold text-ayur-primary mb-2 text-sm">Vitals</h4>
                  <div className="space-y-1 text-xs">
                    <p><span className="font-medium">BP:</span> N/A</p>
                    <p><span className="font-medium">Pulse:</span> N/A</p>
                    <p><span className="font-medium">Weight:</span> N/A</p>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-3 rounded-xl">
                  <h4 className="font-bold text-ayur-primary mb-2 text-sm">Medications</h4>
                  <ul className="space-y-1 text-xs">
                    {selectedPatient.profile?.medications?.length > 0 ? selectedPatient.profile.medications.slice(0, 2).map((med, index) => (
                      <li key={index} className="flex items-center space-x-1">
                        <span className="text-orange-500">💊</span>
                        <span>{med}</span>
                      </li>
                    )) : (
                      <li className="text-gray-500">No medications recorded</li>
                    )}
                  </ul>
                </div>
              </div>
              
              {/* Allergies */}
              <div className="bg-red-50 p-3 rounded-xl">
                <h4 className="font-bold text-ayur-primary mb-2 text-sm">Allergies</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedPatient.profile?.allergies?.length > 0 ? selectedPatient.profile.allergies.map((allergy, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                      {allergy}
                    </span>
                  )) : (
                    <span className="text-gray-500 text-xs">No allergies recorded</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PatientList;