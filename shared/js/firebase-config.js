/* ═══════════════════════════════════════════════════
   FIREBASE CONFIG — shared by the site (js/app.js) and
   the admin panel (admin/js/*.js)
═══════════════════════════════════════════════════ */

const firebaseConfig = {
  apiKey: "AIzaSyCJ0AB8MhuM5COd7BSMJzSzoJFaLqpdHns",
  authDomain: "egale-c959f.firebaseapp.com",
  projectId: "egale-c959f",
  storageBucket: "egale-c959f.firebasestorage.app",
  messagingSenderId: "252018665202",
  appId: "1:252018665202:web:a6cfd16c2cbd8e988dd26b"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
