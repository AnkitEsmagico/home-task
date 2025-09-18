import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  selectedTask: null,
  filters: {
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const { setTasks, setSelectedTask, addTask, updateTask, setFilters } = tasksSlice.actions;
export default tasksSlice.reducer;