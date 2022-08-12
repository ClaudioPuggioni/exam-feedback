import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase-config";

const usersRef = collection(db, "users");

const signup = createAsyncThunk("dataCabinet/signup", async (inputs, api) => {
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

    return { username: inputs.username, email: user.email, uid: user.uid };
  } else {
    return api.rejectWithValue({ customError: "(username-already-in-use)" });
  }
});

const login = createAsyncThunk("dataCabinet/login", async (inputs, api) => {
  const usernameQuery = query(usersRef, where("username", "==", inputs.username));
  let foundEmail = false;
  const querySnapshot = await getDocs(usernameQuery);
  querySnapshot.forEach((doc) => {
    console.log("doc.id:", doc.id, " => ", doc.data());
    foundEmail = doc.data().email;
  });

  if (foundEmail) {
    try {
      const response = await signInWithEmailAndPassword(auth, foundEmail, inputs.password);
      const user = response.user;
      console.log("login user:", user);
      return { username: inputs.username, email: user.email, uid: user.uid };
    } catch (err) {
      console.log("err is", err);
      return api.rejectWithValue(err.response);
    }
  } else {
    // const err = { response: { error: "email error", code: "not found", message: "username not found" } };
    return api.rejectWithValue("username not found");
  }
});

const checkUsers = createAsyncThunk("dataCabinet/checkUsers", async (inputChild, api) => {
  const usernameQuery = query(usersRef, where("username", "==", inputChild));

  const querySnapshot = await getDocs(usernameQuery);
  let credCheck = false;
  querySnapshot.forEach((doc) => {
    if (doc.data().username === inputChild) credCheck = true;
  });

  return credCheck ? inputChild : api.rejectWithValue("user not found");
});

const leaveFback = createAsyncThunk("dataCabinet/leaveFback", async (values, api) => {
  const usernameQuery = query(usersRef, where("username", "==", values.username));
  let feedback = values.feedback;
  let uid;
  const querySnapshot = await getDocs(usernameQuery);
  querySnapshot.forEach((doc) => {
    if (doc.data().username === values.username) {
      uid = doc.id;
    }
  });
  await addDoc(collection(db, "users", uid, "feedback"), {
    feedback,
  });
});

const populateFback = createAsyncThunk("dataCabinet/populateFback", async (user, api) => {
  const usernameQuery = query(usersRef, where("username", "==", user));
  let uid;

  const usernameQuerySnapshot = await getDocs(usernameQuery);
  usernameQuerySnapshot.forEach((doc) => {
    if (doc.data().username === user) {
      uid = doc.id;
    }
  });

  const querySnapshot = await getDocs(collection(db, "users", uid, "feedback"));
  let tempArr = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    tempArr.push(doc.data());
  });
  console.log("tempArr:", tempArr);
  return tempArr;
});

const dataSlice = createSlice({
  name: "dataCabinet",
  initialState: { lgn: false, currentUser: false, loading: false, feedbackUser: false, feedbackArr: false },
  reducers: {
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
    [checkUsers.pending]: (state, action) => {
      state.loading = true;
    },
    [checkUsers.rejected]: (state, action) => {
      const error = action.error;
      const errorMessage = error.message;
      console.log(`ERRORCODE:${errorMessage}:${action.payload}`);
      state.loading = false;
    },
    [checkUsers.fulfilled]: (state, action) => {
      state.feedbackUser = action.payload;
      state.loading = false;
    },
    [leaveFback.pending]: (state, action) => {
      state.loading = true;
    },
    [leaveFback.rejected]: (state, action) => {
      const error = action.error;
      const errorMessage = error.message;
      console.log(`ERRORCODE:${errorMessage}:${action.payload}`);
      state.loading = false;
    },
    [leaveFback.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [populateFback.pending]: (state, action) => {
      state.loading = true;
    },
    [populateFback.rejected]: (state, action) => {
      const error = action.error;
      const errorMessage = error.message;
      console.log(`ERRORCODE:${errorMessage}:${action.payload}`);
      state.loading = false;
    },
    [populateFback.fulfilled]: (state, action) => {
      state.feedbackArr = action.payload;
      state.loading = false;
    },
  },
});

export { signup, login, checkUsers, leaveFback, populateFback };

export const { logout } = dataSlice.actions;

export default dataSlice.reducer;
