import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  groups: [],
  selectedGroup: null,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setSelectedGroup: (state, action) => {
      state.selectedGroup = action.payload;
    },
    addGroup: (state, action) => {
      state.groups.push(action.payload);
    },
  },
});

export const { setGroups, setSelectedGroup, addGroup } = groupsSlice.actions;
export default groupsSlice.reducer;