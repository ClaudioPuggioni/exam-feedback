import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase-config";

const signup = createAsyncThunk("dataCabinet/signup", async (inputs, api) => {
  const usersRef = collection(db, "users");
  const usernameQuery = query(usersRef, where("username", "==", inputs.username));

  const querySnapshot = await getDocs(usernameQuery);
  let credCheck = true;
  querySnapshot.forEach((doc) => {
    if (doc.data().username === inputs.username) credCheck = false;
  });

  if (credCheck) {
    const response = await createUserWithEmailAndPassword(auth, inputs.email, inputs.password);
    const user = response.user;
    console.log("signup user:", user);

    await addDoc(usersRef, {
      username: inputs.username,
      email: inputs.email,
    });

    const userData = { username: inputs.username, email: user.email, uid: user.uid };
    window.localStorage.setItem("userData", JSON.stringify(userData));
    return userData;
  } else {
    return api.rejectWithValue({ customError: "(username-already-in-use)" });
  }
});

const login = createAsyncThunk("dataCabinet/login", async (inputs, api) => {
  const usersRef = query(collection(db, "users"), where("username", "==", inputs.username));
  let foundEmail = false;
  const querySnapshot = await getDocs(usersRef);
  querySnapshot.forEach((doc) => {
    console.log("doc.id:", doc.id, " => ", doc.data());
    foundEmail = doc.data().email;
  });

  if (foundEmail) {
    try {
      const response = await signInWithEmailAndPassword(auth, foundEmail, inputs.password);
      const user = response.user;
      console.log("login user:", user);
      const userData = { username: inputs.username, email: user.email, uid: user.uid };
      window.localStorage.setItem("userData", JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.log("err is", err);
      return api.rejectWithValue(err.response);
    }
  } else {
    // const err = { response: { error: "email error", code: "not found", message: "username not found" } };
    return api.rejectWithValue("username not found");
  }
});

const dataSlice = createSlice({
  name: "dataCabinet",
  initialState: { lgn: false, currentUser: false, loading: false, feedbackArr: false },
  reducers: {
    leaveFback: (state, action) => {
      state.feedbackArr = action.payload;
    },
    logout: (state, action) => {
      state.lgn = false;
      localStorage.clear();
    },
  },
  extraReducers: {
    [signup.pending]: (state, action) => {
      state.loading = true;
    },
    [signup.rejected]: (state, action) => {
      const error = action.error;
      const errorMessage = error.message;
      console.log(`ERRORCODE:${errorMessage}:${action.payload}`);
      state.loading = false;
    },
    [signup.fulfilled]: (state, action) => {
      state.currentUser = action.payload;
      state.lgn = true;
      state.loading = false;
    },
    [login.pending]: (state, action) => {
      state.loading = true;
    },
    [login.rejected]: (state, action) => {
      const error = action.error;
      const errorMessage = error.message;
      console.log(`ERRORCODE:${errorMessage}:${action.payload}`);
      state.loading = false;
    },
    [login.fulfilled]: (state, action) => {
      state.currentUser = action.payload;
      state.lgn = true;
      state.loading = false;
    },
  },
});

export { signup, login };

export const { leaveFback, logout } = dataSlice.actions;

export default dataSlice.reducer;
