const APPOINTMENTS_KEY = 'mediconnect_appointments';
const DOCTORS_KEY = 'mediconnect_doctors';

export const getCustomDoctors = () => {
  const data = localStorage.getItem(DOCTORS_KEY);
  return data ? JSON.parse(data) : [];
};

export const registerCustomDoctor = (doctor) => {
  const docs = getCustomDoctors();
  docs.push(doctor);
  localStorage.setItem(DOCTORS_KEY, JSON.stringify(docs));
};


export const getAppointments = () => {
  const data = localStorage.getItem(APPOINTMENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const createAppointment = (appointment) => {
  const appointments = getAppointments();
  const newAppt = {
    ...appointment,
    id: Date.now() + Math.random().toString(36).substring(7),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  appointments.push(newAppt);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  return newAppt;
};

export const updateAppointmentStatus = (id, status) => {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => a.id === id);
  if (index !== -1) {
    appointments[index].status = status;
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  }
};

export const deleteAppointment = (id) => {
  let appointments = getAppointments();
  appointments = appointments.filter(a => a.id !== id);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
};

export const getAppointmentsByDoctor = (doctorId) => {
  return getAppointments().filter(a => a.doctorId === doctorId);
};

export const getAppointmentsByPatient = (patientId) => {
  return getAppointments().filter(a => a.patientId === patientId);
};
