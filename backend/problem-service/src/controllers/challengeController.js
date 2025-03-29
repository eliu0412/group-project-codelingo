import { db } from '../../../shared/initFirebase.js';
// import database from "../../../shared/firebaseConfig.js";
import {
  ref,
  push,
  query,
  orderByChild,
  equalTo,
  get,
  update,
  set,
} from "firebase/database";
import problemService from "../services/problemService.js";
import { exec } from "child_process";

// Allowable problem types
const allowableTypes = ["coding", "mcq", "fill"];
